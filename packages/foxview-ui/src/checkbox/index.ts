

import  {defineWebComponent,WebComponent,html,dhtml,property, createRef,Ref} from 'foxview';
import {dispatchCustomEvent} from '../util/index';
import s from './style';  



export default function(prefix:string){
    class Checkbox extends WebComponent{
        @property({type:Boolean}) disabled:boolean
        @property({type:Boolean}) checked:boolean
        @property({type:Boolean}) defaultChecked:boolean
        @property({type:Boolean}) indeterminate:boolean
        @property({type:Boolean}) defaultIndeterminate:boolean
        @property({type:String,noAccessor:true}) value:string
        @property({type:String,noAccessor:true}) id:string
        @property({type:String,noAccessor:true}) name:string
        // focusable:Focusable
        static styles = s
        // inputEl:Ref
        constructor() {
            super();
            // this.inputEl = createRef();
            // this.focusable = new Focusable(this.setState.bind(this));
        }
        // componentDidMount(){
            // this.focusable.enable(this.inputEl);
        // }
        // componentWillUnmount() {
        //     // this.focusable.destroy();
        // }
        
        initState(props){
            let checked:boolean, indeterminate:boolean;
            if ('checked' in props) {
                checked = props.checked;
            } else {
                checked = props.defaultChecked;
            }
            if ('indeterminate' in props) {
                indeterminate = props.indeterminate;
            } else {
                indeterminate = props.defaultIndeterminate;
            }
            // if (context.__group__) {
            //     checked = isChecked(context.selectedValue, props.value);
            // }
            // this.disabled = props.disabled;
            return {
                checked,
                indeterminate,
            };
        }
        static getDerivedStateFromProps(newProps,newState){
            let checked = newState.checked,indeterminate = newState.indeterminate;
            if ('checked' in newProps) {
                checked = newProps.checked
            }
            if ('indeterminate' in newProps) {
                indeterminate = newProps.indeterminate
            }
            return {
                checked,
                indeterminate
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
            // this.setState({
            //     checked: checked,
            //     indeterminate: false,
            // });
            this.checked = checked;
            this.indeterminate = false;
            e.stopPropagation();
            dispatchCustomEvent(this,'change',{checked:checked});
        }
        createLabel(item:any){
            return item ? (
                html`<span class="checkbox-label">
                ${item}
            </span>`
            ) : null
        }
        render(){
            const {checked,focused,indeterminate}  = this.state;
            const {rtl,label,id='',value,disabled,name} = this.props;
            let childInput = html`<input
                id="${id}"
                value="${value}"
                name="${name}"
                ?disabled="${disabled}"
                ?checked="${checked}"
                type="checkbox"
                @change="${this.onChange}"
                aria-checked="${indeterminate ? 'mixed' : checked}"
                class="checkbox-input"
            />`;
            const cls = `wrapper ${focused ? 'focused':''} ${disabled ? 'disabled':''} ${checked ? 'checked':''} ${indeterminate ? 'indeterminate':''}`;
            return html`<label 
                class="${cls}"
                dir="${rtl ? 'rtl' : undefined}"
                @mouseenter="${this.onMouseEnter}"
                @mouseleave="${this.onMouseLeave}"
            >
                <span class="checkbox">
                    <span class="checkbox-inner"></span>
                    ${childInput}
                </span>
                ${this.createLabel(label)}
                ${this.createLabel( html`<slot class="luodan"></slot>`)}
            </label>` 
        }
    }
    return defineWebComponent(`${prefix}-checkbox`,Checkbox);
}

// ${/*dhtml`<${prefix}-icon type="${type}" size="xs" class="foxview-icon ${indeterminate ? 'zoomIn' : ''}"/>`*/}