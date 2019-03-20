

import  {defineWebComponent,WebComponent,html,property} from 'foxview';
import s from './style';  

class Button extends WebComponent{
    @property({type:Boolean}) rtl:boolean
    @property({type:String}) type:string
    @property({type:String}) size:string
    @property({type:Boolean}) warning:boolean
    @property({type:Boolean}) disabled:boolean
    static styles = s
    render(){
        const {rtl,type='normal',size="medium",warning,disabled} = this.props;
        // const {rtl,type,size,warning,disabled} = this;
        return html`  
        <button class="${type} ${size} ${warning ? 'warning':''}" ?disabled=${disabled} dir="${rtl ? 'rtl' : undefined}" role="button">
            <slot></slot>
        </button>
        `
    }
}

export default function(prefix){
    return defineWebComponent(`${prefix}-button`,Button);
}