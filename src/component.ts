import {IComponent,ITemplateResult,ComponentProp,RenderOptions,Peon,ComponentSlotSchema} from './type'
import {shadowRender} from './render';



export abstract class Component implements IComponent{
    private _mountFlag:boolean = false;
    state:ComponentProp
    props:ComponentProp
    fragment:DocumentFragment
    part:Peon
    _slots:ComponentSlotSchema;
    renderOption:RenderOptions
    componentWillReceiveProps(nextProps:ComponentProp):void{}
    abstract render():ITemplateResult
    componentDidMount():void{}
    componentDidUpdate():void{}
    componentWillUnmount():void{}
    // constructor(props) {
    //     this.props = props;
    // }
    _commit(){
        //eventContext 和 slots覆盖传入的eventContext和slots
        this.part = shadowRender(this.render(),this.fragment,{
            ...this.renderOption,
            eventContext:this, 
            slots:this._slots,
        });
    }
    setState(partialState:ComponentProp){
        this.state = Object.assign({},this.state || {},partialState)
        this._commit();
    }
}