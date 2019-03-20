

import  {defineWebComponent,WebComponent,html,property} from 'foxview';
import {dispatchCustomEvent} from '../util/index';
import s from './style';  



export default function(prefix:string){
    class Radio extends WebComponent{
        @property({type:Boolean}) disabled:boolean
        @property({type:Boolean}) checked:boolean
        @property({type:Boolean}) defaultChecked:boolean
        @property({type:String,noAccessor:true}) value:string
        @property({type:String,noAccessor:true}) id:string
        @property({type:String,noAccessor:true}) name:string
        // @property({type:Boolean}) button:boolean
        
        // @property({type:Boolean}) indeterminate:boolean
        // @property({type:Boolean}) defaultIndeterminate:boolean
        // focusable:Focusable
        static styles = s
        // inputEl:Ref
        constructor() {
            super();
            // this.inputEl = createRef();
            // this.focusable = new Focusable(this.setState.bind(this));
        }
        componentDidMount(){
            // this.focusable.enable(this.inputEl);
        }
        componentWillUnmount() {
            // this.focusable.destroy();
        }
        
        initState(props){
            let checked:boolean;
            if ('checked' in props) {
                checked = props.checked;
            } else {
                checked = props.defaultChecked;
            }
            // if (context.__group__) {
            //     checked = isChecked(context.selectedValue, props.value);
            // }
            // this.disabled = props.disabled;
            return {
                checked,
            };
        }
        static getDerivedStateFromProps(newProps,newState){
            let checked = newState.checked;
            if ('checked' in newProps) {
                checked = newProps.checked
            }
            // console.log('getDerivedStateFromProps checked :',checked,newProps.value,newState.checked);
            return {
                checked
            }
        }
        onMouseEnter(){
        }
        onMouseLeave(){
    
        }
        onChange(e:MouseEvent){
            const {checked} = e.target as HTMLInputElement;
            const {disabled} = this.props;
            if (disabled) {
                return;
            }
            // if (this.context.__group__) {
            //     this.context.onChange(value, e);
            // } else {
            // console.log('checked!!!!! :',checked,e.target,this.props.value);
            e.stopPropagation();
            // this.setState({
            //     checked: checked
            // });
            // this.state.checked = checked;
            this.checked = checked;
            dispatchCustomEvent(this,'change',{checked:checked});
        }
        createLabel(item:any){
            return item ? (
                html`<span class="radio-label">
                ${item}
            </span>`
            ) : null
        }
        render(){
            const {checked,focused}  = this.state;
            const {rtl,id='',disabled,value,name} = this.props;
            let childInput = html`<input
                id="${id}"
                ?disabled="${disabled}"
                ?checked="${checked}"
                name="${name}"
                value="${value}"
                type="radio"
                @change="${this.onChange}"
                aria-checked="${checked}"
                class="radio-input"
            />`;
            const focusClz = focused ? 'focused':'';
            const checkedClz = checked ? 'checked':''
            const disabledClz = disabled ? 'disabled':'';
            const cls = `radio ${checkedClz} ${focusClz}`
            const clsInner = `radio-inner ${checked ? 'press' : 'unpress'}`
            // const radioComp = !button ? html`<span class="${cls}">
            //     <span class="${clsInner}" />
            //     ${childInput}
            // </span>` : html`<span class="radio-single-input">${childInput}</span>`;
            const radioComp = html`<span class="${cls}">
                <span class="${clsInner}" />
                ${childInput}
            </span>`;;
            const clsWrapper = `wrapper ${focusClz} ${disabledClz} ${checkedClz}`;
            return html`<label 
                class="${clsWrapper}"
                dir="${rtl ? 'rtl' : undefined}"
                @mouseenter="${this.onMouseEnter}"
                @mouseleave="${this.onMouseLeave}"
            >
                ${radioComp}
                ${this.childNodes.length > 0 ? this.createLabel(html`<slot></slot>`) : ''}
            </label>` 
        }
    }
    return defineWebComponent(`${prefix}-radio`,Radio);
}

// ${/*dhtml`<${prefix}-icon type="${type}" size="xs" class="foxview-icon ${indeterminate ? 'zoomIn' : ''}"/>`*/}