

import  {defineWebComponent,WebComponent,html,property} from 'foxview';
import s from './style';  

class Button extends WebComponent{
    @property({type:Boolean}) rtl = false
    @property({type:String}) type = 'normal'
    @property({type:String}) size = 'medium'
    @property({type:Boolean}) warning = false
    @property({type:Boolean}) disabled = false 
    static styles = s
    render(){
        const {rtl,type,size,warning,disabled} = this.props;
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