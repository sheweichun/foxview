import {IComponent,ITemplateResult,ComponentProp,RenderOptions,Peon,ComponentSlotSchema} from './type'
import {render} from './render';
import Updater from './updater';


let componentId = 1;
export abstract class Component implements IComponent{
    private _mountFlag:boolean = false;
    state:ComponentProp
    id:string
    // private _pendingState:Partial<ComponentProp>
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
    componentShouldUpdate(nextProps:ComponentProp):boolean{
        return true;
    }
    abstract render():ITemplateResult
    componentDidMount():void{}
    componentDidUpdate():void{}
    componentWillUnmount():void{}
    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
    // constructor(props) {
    //     this.props = props;
    // }
    _commit(){
        //eventContext 和 slots覆盖传入的eventContext和slots
        this.part = render(this.render(),this.fragment,{
            ...this.renderOption,
            eventContext:this, 
            slots:this._slots,
        });
    }
    forceUpdate(callback?:()=>void){
        this.setState(null,callback,true)
    }
    setState(partialState?:Partial<ComponentProp>,callback?:()=>void,isForce?:boolean){ //待优化
        // debugger;
        Updater.enqueueSetState(this,partialState || {},callback,isForce);
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