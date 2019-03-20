
import  {defineWebComponent,WebComponent,html,property,createRef,Ref} from 'foxview';
import {Focusable,dispatchCustomEvent} from '../util/index';
import s from './style';  



export default function(prefix:string){
    class Select extends WebComponent{
        @property({type:String}) value:string
        @property({type:Boolean}) disabled:boolean
        @property({type:String,noAccessor:true}) placeholder:string
        static styles = s;
        inputRef:Ref
        focusable:Focusable
        constructor() {
            super();
            this.state = {};
            this.inputRef = createRef();
            this.focusable = new Focusable(this);
        }
        initState(props){
            let value:string;
            if ('value' in props) {
                value = props.value;
            } else {
                value = props.defaultChecked;
            }
            return {
                value
            }
        }
        static getDerivedStateFromProps(newProps,newState){
            let value = newState.value;
            if ('value' in newProps) {
                value = newProps.value
            }
            return {
                value
            }
        }
        componentDidMount(){
            this.focusable.enable(this.inputRef);
        }
        componentWillUnmount() {
            this.focusable.destroy();
        }
        onKeyUp(e:KeyboardEvent){
            const {keyCode} = e;
            if(keyCode === 13){
                dispatchCustomEvent(this,'pressenter')
            }
        }
        onChange(e:MouseEvent){
            const {value} = e.target as HTMLInputElement;
            this.value = value;
            dispatchCustomEvent(this,'change',{value:value})
        }
        render(){
            const {focused,value} = this.state;
            const {disabled,placeholder} = this.props;
            const focusClz = focused ? 'focus' : '';
            const disabledClz = disabled ? 'disabled' : '';
            return html`<span class="input-group medium">
                <span class="${`input medium ${focusClz} ${disabledClz}`}" @input=${this.onChange} @keyup="${this.onKeyUp}">
                    <input placeholder="${placeholder}" ?disabled="${disabled}" value="${value || ''}" ref="${this.inputRef}" class=""/>
                </span>
            </span>`
        }
    }
    return defineWebComponent(`${prefix}-select`,Select);
}

// <slot name="addonBefore" class="input-group-addon input-group-text before"></slot>
// <slot name="addonAfter" class="input-group-addon input-group-text after"></slot>