import {IComponent,ITemplateResult,ComponentProp,RenderOptions,Peon,ComponentSlotSchema} from './type'
import {render} from './render';
import Updater from './updater';


let componentId = 1;
export abstract class Component implements IComponent{
    _mountFlag:boolean = false;
    state:ComponentProp
    id:string
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
    
    componentWillReceiveProps(nextProps:ComponentProp):void{}
    componentShouldUpdate(nextProps:ComponentProp,nextState:ComponentProp):boolean{
        return true;
    }
    abstract render():ITemplateResult
    componentDidMount():void{}
    componentDidUpdate():void{}
    componentWillUnmount():void{}
    componentWillMount():void{}
    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
    // constructor(props) {
    //     this.props = props;
    // }
    private _doRender(){
        //eventContext 和 slots覆盖传入的eventContext和slots
        this.part = render(this.render(),this.fragment,{
            ...this.renderOption,
            eventContext:this, 
            slots:this._slots,
        });
    }
    _firstCommit(){
        // this.componentWillMount();
        this._doRender();
        this._mount(this.fragment)
        this._mountFlag = true;
        this.componentDidMount();
    }
    _commit(){
        this._doRender();
        this.componentDidUpdate()
        // if(!this._mountFlag){
        //     this._firstCommit();
        // }else{
        //     this._doRender();
        //     this.componentDidUpdate();
        // }
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