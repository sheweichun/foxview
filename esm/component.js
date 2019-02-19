import { render } from './render';
import Updater from './updater';
let componentId = 1;
export class Component {
    constructor(props) {
        this._mountFlag = false;
        this.props = props;
        this.id = `${componentId++}`;
    }
    componentWillReceiveProps(nextProps) { }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentDidMount() { }
    componentDidUpdate(prevProps, prevState, snapshot) { }
    componentWillUnmount() { }
    componentWillMount() { }
    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
    // constructor(props) {
    //     this.props = props;
    // }
    _doRender() {
        //eventContext 和 slots覆盖传入的eventContext和slots
        try {
            this.part = render(this.render(), this.fragment, Object.assign({}, this.renderOption, { eventContext: this, slots: this._slots }));
        }
        catch (e) {
            if (this.componentDidCatch) {
                this.componentDidCatch(e);
            }
            else {
                throw new Error(e);
            }
        }
    }
    _firstCommit() {
        // this.componentWillMount();
        this._doRender();
        this._mount(this.fragment);
        this._mountFlag = true;
        this.componentDidMount();
    }
    _commit(prevProps, prevState, snapshot) {
        this._doRender();
        this.componentDidUpdate(prevProps, prevState, snapshot);
    }
    forceUpdate(callback) {
        // this.setState(null,callback,true)
        Updater.enqueueSetState(this, null, callback, true);
    }
    setState(partialState, callback) {
        // debugger;
        Updater.enqueueSetState(this, partialState || {}, callback, false);
        // this.state = Object.assign({},this.state || {},partialState || {});
        // this._commit();
        // this._pendingState = Object.assign({},this.state || {},this._pendingState);
        // this._updatePromise = new Promise((resolve,reject)=>{
        //     if(this._updatePromise.then(()=>{
        //     }))
        //     this.state = this._pendingState;
        //     this._commit();
        // })
    }
}
