

import  {defineWebComponent,WebComponent,html,property} from 'foxview';
import {dispatchCustomEvent,list2Map,map2List,INodeMap} from '../util/index';
import s from './style';  






export default function(prefix:string){
    class CheckboxGroup extends WebComponent{
        // @property({type:Boolean}) disabled:boolean
        // @property({type:Boolean}) disabled:boolean
        @property() value:string[]
        @property() defaultValue:string[]
        @property({type:String,noAccessor:true}) name:string
        // @property({type:String}) size:string
        // @property({type:Boolean}) button:boolean
        checkboxList:NodeListOf<Element>
        checkboxValue:INodeMap
        // @property({type:Boolean}) indeterminate:boolean
        // @property({type:Boolean}) defaultIndeterminate:boolean
        static styles = s
        constructor() {
            super();
        }
        initState(props){
            let value:string[];
            if ('value' in props) {
                value = props.value;
            } else {
                value = props.defaultValue;
            }
            value = value || [];
            
            this.checkboxValue = list2Map(value);
            // if (context.__group__) {
            //     checked = isChecked(context.selectedValue, props.value);
            // }
            // this.disabled = props.disabled;
            return {};
        }
        
        _changeHandler=(e:CustomEvent)=>{
            const target  = e.target as HTMLInputElement;
            const checked = e.detail.checked;
            this.checkboxValue[target.value] = checked;
            // target.checked = checked;
            e.stopPropagation();
            dispatchCustomEvent(this,'change',{value:map2List(this.checkboxValue)});
        }
        componentDidUpdate() {
            this.checkboxValue = list2Map(this.value);
            this._eachcheckbox((checkbox)=>{
                const checked = this.checkboxValue[checkbox.value];
                checkbox.checked = checked;
            });
        }
        _eachcheckbox(iterator:(el:HTMLInputElement,index:number)=>void){
            const {checkboxList} = this;
            if(checkboxList == null) return;
            for(let i = 0;i < checkboxList.length; i++){
                iterator(checkboxList[i] as HTMLInputElement,i);
            }
        }
        componentDidMount(){
            const {name} = this.props;
            this.checkboxList = this.querySelectorAll(`${prefix}-checkbox`);
            this._eachcheckbox((checkbox)=>{
                const checked = this.checkboxValue[checkbox.value];
                checkbox.checked = checked;
                checkbox.name = name;
                checkbox.addEventListener('change', this._changeHandler);
            })
        }
        componentWillUnmount() {
            this._eachcheckbox((checkbox)=>{
                checkbox.removeEventListener('change', this._changeHandler);
            });
            this.checkboxList = null;
        }
        

        render(){
            return html`<div class="checkbox-group">
                <slot></slot>
            </div>`
        }
    }
    return defineWebComponent(`${prefix}-checkbox-group`,CheckboxGroup);
}

// ${/*dhtml`<${prefix}-icon type="${type}" size="xs" class="foxview-icon ${indeterminate ? 'zoomIn' : ''}"/>`*/}