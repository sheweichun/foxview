

import  {defineWebComponent,WebComponent,html,property} from 'foxview';
import s from './style';  

class Icon extends WebComponent{
    @property({type:String}) size = "medium"
    @property({type:String}) type = ""
    static styles = s
    render(){
        const {size,type} = this.props;
        return html`<i class="${`${size} ${type}`}"/>` 
    }
}

export default function(prefix){
    return defineWebComponent(`${prefix}-icon`,Icon);
}