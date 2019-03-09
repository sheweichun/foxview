import { IComponent, ComponentProp } from './type';
import WMap from './util/map';
import assign from './util/assign';

type SetStateMapItem = {
  partialState: Partial<ComponentProp>;
  flushed?: boolean;
  instance: IComponent;
};

let callbackList: Array<() => void> = [];

interface IUpdater {
  isInBatchUpdating: boolean;
  isInClosingUpdating: boolean;
  enqueueSetState: (
    instance: IComponent,
    partialState: Partial<ComponentProp>,
    callback: () => void,
    isForce: boolean
  ) => void;
  closeBatchUpdating: () => void;
  performUpdate: (item: SetStateMapItem) => void;
  // performUpdate:(instance:IComponent,partialState:Partial<ComponentProp>)=>void
  // performUpdate:(instance:IComponent,partialState:Partial<ComponentProp>)=>void
}
let setStateMap: WMap<SetStateMapItem> = new WMap();

const Updater: IUpdater = {
  isInBatchUpdating: false,
  isInClosingUpdating: false,
  performUpdate: function(item: SetStateMapItem): void {
    const { instance } = item;
    let newState = assign({}, instance.state || {}, item.partialState);
    //@ts-ignore
    const getDerivedStateFromProps =
      instance.constructor.getDerivedStateFromProps;
    if (getDerivedStateFromProps) {
      const result = getDerivedStateFromProps.call(
        instance.constructor,
        instance._pendProps,
        newState
      );
      if (result) {
        newState = assign({}, newState, result);
      }
    }
    if (!instance._mountFlag) {
      // instance.componentWillMount();
      /**
       * 如果在componentWillUnmount调用了setState,此处会更新state,但不会触发二次渲染  (注:已取消componentWillMount)
       * 即便在componentWillMount中setState,此处item.partialState拿到也是最新的partialState
       * **/
      instance.state = newState;
      instance._firstCommit();
      return;
    }
    if (instance.shouldComponentUpdate(instance._pendProps, newState)) {
      const prevProps = instance.props;
      const prevState = instance.state;
      instance.props = instance._pendProps;
      instance.state = newState;
      let snapShot;
      if (instance.getSnapshotBeforeUpdate) {
        snapShot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
      }
      instance._commit(prevProps, prevState, snapShot);
    } else {
      instance.props = instance._pendProps;
      instance.state = newState;
    }
  },
  enqueueSetState: function(
    instance: IComponent,
    partialState: Partial<ComponentProp>,
    callback: () => void,
    isForce: boolean
  ) {
    if (Updater.isInBatchUpdating && !isForce) {
      const item = setStateMap.get(instance.id);
      if (item) {
        /**
         * flushed表示已经更新过了 直接忽略
         * 默认带partialState的都已记录到了setStateMap
         * 此次是为了过滤掉closeBatchUpdating instant._commit导致的无状态变更的二次更新
         * **/
        if (item.flushed) return;
        item.partialState = assign({}, item.partialState, partialState);
        callback && callbackList.push(callback);
      } else {
        const newItem = {
          partialState,
          instance,
          flushed: false
        };
        if (Updater.isInClosingUpdating) {
          Updater.performUpdate(newItem);
          callback && callback();
          return;
        }
        setStateMap.set(instance.id, newItem);
        callback && callbackList.push(callback);
      }
      return;
    }
    Updater.performUpdate({
      instance,
      partialState
    });
    callback && callback();
  },
  closeBatchUpdating() {
    Updater.isInClosingUpdating = true;
    setStateMap._each((id, item) => {
      // const {instance,partialState} = item;
      Updater.performUpdate(item);
      item.flushed = true;
    });
    // Object.keys(setStateMap).forEach()
    // for(let [instance,item] of setStateMap){
    //     instance.state = assign({},item.partialState,item.partialState);
    //     instance._commit()
    //     item.flushed = true;
    // }
    setStateMap.clear();
    Updater.isInClosingUpdating = false;
    Updater.isInBatchUpdating = false;
    const callbackLen = callbackList.length;
    for (let i = 0; i < callbackLen; i++) {
      callbackList[i]();
    }
    callbackList.splice(0, callbackLen);
  }
};
export default Updater;
