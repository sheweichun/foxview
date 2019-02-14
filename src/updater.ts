
import {IComponent,ComponentProp} from './type'

type SetStateMapItem = {
    partialState:Partial<ComponentProp>
    flushed:boolean,
    instance:IComponent
}

let callbackList:Array<()=>void> = [];

interface IUpdater {
    isInBatchUpdating:boolean
    enqueueSetState:(instance:IComponent,partialState:Partial<ComponentProp>,callback:()=>void,isForce:boolean)=>void,
    closeBatchUpdating:()=>void
}
let setStateMap:{
    [key:string]:SetStateMapItem
} = {};
const Updater:IUpdater = {
    isInBatchUpdating:false,
    enqueueSetState:function(instance:IComponent,partialState:Partial<ComponentProp>,callback:()=>void,isForce:boolean){
        if(Updater.isInBatchUpdating && !isForce){
            const item = setStateMap[instance.id];
            if(item){
                /** 
                 * flushed表示已经更新过了 直接忽略
                 * 默认带partialState的都已记录到了setStateMap
                 * 此次是为了过滤掉closeBatchUpdating instant._commit导致的无状态变更的二次更新
                 * **/
                if(item.flushed) return; 
                item.partialState = Object.assign({},item.partialState,partialState);
                callback && callbackList.push(callback)
            }else{
                setStateMap[instance.id] = {
                    partialState,
                    instance,
                    flushed:false
                }
                callback && callbackList.push(callback)
            }
            return
        }
        instance.state = Object.assign({},this.state || {},partialState);
        callback && callback();
    },
    closeBatchUpdating(){
        Object.keys(setStateMap).forEach((id)=>{
            const item= setStateMap[id];
            const {instance,partialState} = item;
            instance.state = Object.assign({},instance.state,partialState);
            instance._commit()
            item.flushed = true;
        })
        // for(let [instance,item] of setStateMap){
        //     instance.state = Object.assign({},item.partialState,item.partialState);
        //     instance._commit()
        //     item.flushed = true;
        // }
        setStateMap = {};
        Updater.isInBatchUpdating = false;
        const callbackLen = callbackList.length;
        for(let i = 0; i < callbackLen ; i++){
            callbackList[i]();
        }
        callbackList.splice(0,callbackLen);
    }
}
export default Updater