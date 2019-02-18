import {IComponent,ITemplateResult,ComponentProp,RenderOptions,Peon,ComponentSlotSchema} from './type'
import {render} from './render';
import Updater from './updater';


let componentId = 1;
export abstract class Component implements IComponent{
    _mountFlag:boolean = false;
    state:ComponentProp
    id:string
    getSnapshotBeforeUpdate?(prevProps:ComponentProp, prevState:ComponentProp):any
    _mount:(node:Element | DocumentFragment)=>void
    _parentPart:Peon
    // private _pendingState:Partial<ComponentProp>
    _pendProps:ComponentProp
    props:ComponentProp
    fragment:DocumentFragment
    part:Peon
    _slots:ComponentSlotSchema;
    renderOption:RenderOptions
    constructor(props) {
        this.props = props;
        this.id = `${componentId++}`;
    }
    /** 
     * state的最新值取getDerivedStateFromProps的返回值
     * **/
    // static getDerivedStateFromProps(props, state):void
    componentDidCatch?:(e:Error)=>void
    componentWillReceiveProps(nextProps:ComponentProp):void{}
    shouldComponentUpdate(nextProps:ComponentProp,nextState:ComponentProp):boolean{
        return true;
    }
    abstract render():ITemplateResult
    componentDidMount():void{}
    componentDidUpdate(prevProps:ComponentProp, prevState:ComponentProp,snapshot?:any):void{}
    componentWillUnmount():void{}
    componentWillMount():void{}
    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
    // constructor(props) {
    //     this.props = props;
    // }
    private _doRender(){
        //eventContext 和 slots覆盖传入的eventContext和slots
        try{
            this.part = render(this.render(),this.fragment,{
                ...this.renderOption,
                eventContext:this, 
                slots:this._slots,
            });
        }catch(e){
            if(this.componentDidCatch){
                this.componentDidCatch(e);
            }else{
                throw new Error(e)
            }
        }
        
    }
    _firstCommit(){
        // this.componentWillMount();
        this._doRender();
        this._mount(this.fragment)
        this._mountFlag = true;
        this.componentDidMount();
    }
    _commit(prevProps:ComponentProp, prevState:ComponentProp,snapshot?:any){
        this._doRender();
        this.componentDidUpdate(prevProps,prevState,snapshot)
    }
    forceUpdate(callback?:()=>void){
        // this.setState(null,callback,true)
        Updater.enqueueSetState(this,null,callback,true);
    }
    setState(partialState?:Partial<ComponentProp>,callback?:()=>void){ //待优化
        // debugger;
        Updater.enqueueSetState(this,partialState || {},callback,false);
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