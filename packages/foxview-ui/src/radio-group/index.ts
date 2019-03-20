

import  {defineWebComponent,WebComponent,html,dhtml,property, createRef,Ref} from 'foxview';
import {dispatchCustomEvent} from '../util/index';
import s from './style';  



export default function(prefix:string){
    class RadioGroup extends WebComponent{
        // @property({type:Boolean}) disabled:boolean
        @property({type:String}) value:string
        @property({type:String}) defaultValue:string
        @property({type:String,noAccessor:true}) name:string
        // @property({type:String}) size:string
        // @property({type:Boolean}) button:boolean
        radioList:NodeListOf<Element>
        radioValue:string
        // @property({type:Boolean}) indeterminate:boolean
        // @property({type:Boolean}) defaultIndeterminate:boolean
        static styles = s
        constructor() {
            super();
        }
        initState(props){
            let value:string;
            if ('value' in props) {
                value = props.value;
            } else {
                value = props.defaultValue;
            }
            this.radioValue = value;
            // if (context.__group__) {
            //     checked = isChecked(context.selectedValue, props.value);
            // }
            // this.disabled = props.disabled;
            return {};
        }
        
        _changeHandler=(e:MouseEvent)=>{
            const target  = e.target as HTMLInputElement;
            this._eachRadio((radio)=>{
                if(radio !== target){
                    radio.checked = false;
                }
            })
            // target.checked = true;
            this.radioValue = target.value;
            e.stopPropagation();
            dispatchCustomEvent(this,'change',{value:this.radioValue});
        }
        componentDidUpdate() {
            this.radioValue = this.value;
            this._eachRadio((radio)=>{
                if(radio.value === this.radioValue){
                    radio.checked = true
                }else{
                    radio.checked = false
                }
            });
        }
        _eachRadio(iterator:(el:HTMLInputElement,index:number)=>void){
            const {radioList} = this;
            if(radioList == null) return;
            for(let i = 0;i < radioList.length; i++){
                iterator(radioList[i] as HTMLInputElement,i);
            }
        }
        componentDidMount(){
            const {name} = this.props;
            const {radioValue} = this;
            this.radioList = this.querySelectorAll(`${prefix}-radio`);
            this._eachRadio((radio)=>{
                if(radio.value === radioValue){
                    radio.checked = true
                }
                radio.name = name;
                radio.addEventListener('change', this._changeHandler);
            })
        }
        componentWillUnmount() {
            this._eachRadio((radio)=>{
                radio.removeEventListener('change', this._changeHandler);
            });
            this.radioList = null;
        }
        

        render(){
            return html`<div class="radio-group">
                <slot></slot>
            </div>`
        }
    }
    return defineWebComponent(`${prefix}-radio-group`,RadioGroup);
}

// ${/*dhtml`<${prefix}-icon type="${type}" size="xs" class="foxview-icon ${indeterminate ? 'zoomIn' : ''}"/>`*/}