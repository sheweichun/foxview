
import  {defineWebComponent,WebComponent,html,property,createRef,Ref} from 'foxview';
import {dispatchCustomEvent} from '../util/index';
import s from './style';  



export default function(prefix:string){
    class Switch extends WebComponent{
        @property({type:Boolean}) disabled:boolean
        @property({type:Boolean}) checked:boolean
        @property({type:Boolean}) defaultChecked:boolean
        @property({type:String}) checkedLabel:string
        @property({type:String}) unCheckedLabel:string
        
        static styles = s;
        constructor() {
            super();
            // this.state = {};
        }
        initState(props){
            let checked:string;
            if ('value' in props) {
                checked = props.checked;
            } else {
                checked = props.defaultChecked;
            }
            return {
                checked
            }
        }
        static getDerivedStateFromProps(newProps,newState){
            let checked = newState.checked;
            if ('checked' in newProps) {
                checked = newProps.checked
            }
            return {
                checked
            }
        }
        onChange(e:MouseEvent){
            const {disabled} = this;
            if(disabled) return;
            this.checked = !this.state.checked;
            dispatchCustomEvent(this,'change',{checked:this.checked})
        }
        render(){
            const {checked} = this.state;
            const {checkedLabel,unCheckedLabel} = this.props;
            const {disabled} = this;
            let status:string,children:string;
            if(checked){
                status = 'on'
                children = checkedLabel
            }else{
                status = 'off'
                children = unCheckedLabel
            }
            return html`<div
                @click="${this.onChange}"
                role="switch"
                class="${`switch switch-medium switch-${status}`}"
                ?disabled="${disabled}"
                tabIndex="0">
                <div class="switch-children">
                    ${children}
                </div>
            </div>`
        }
    }
    return defineWebComponent(`${prefix}-switch`,Switch);
}

// <slot name="addonBefore" class="input-group-addon input-group-text before"></slot>
// <slot name="addonAfter" class="input-group-addon input-group-text after"></slot>