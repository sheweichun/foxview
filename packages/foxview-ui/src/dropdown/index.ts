
import  {defineWebComponent,WebComponent,html,property} from 'foxview';
// import {Focusable,dispatchCustomEvent} from '../util/index';
import Position from './position';
import s from './style';  



export default function(prefix:string){
    class Dropdown extends WebComponent{
        @property({type:Boolean}) open:boolean
        // @property({type:String,noAccessor:true}) placeholder:string
        mountEl?:HTMLElement
        static styles = s;
        constructor() {
            super();
            this.state = {
                open:false
            };
            
        }
        initState(props){
            // let value:string;
            // if ('value' in props) {
            //     value = props.value;
            // } else {
            //     value = props.defaultChecked;
            // }
            return {
                // value
            }
        }
        componentWillUnmount() {
            if(this.mountEl){
                this.mountEl.parentNode.removeChild(this.mountEl);
            }
        }
        
        showOverlay(){
            if(this.mountEl == null){
                const tpl = this.getTemplate();
                if(tpl == null) return;
                this.mountEl = document.createElement('div');
                this.mountEl.style.position = "absolute";
                this.mountEl.style.zIndex = "99999";
                this.mountEl.appendChild(tpl.content);
                document.body.appendChild(this.mountEl);
            }
            this.mountEl.style.display = "block";
            const rect = this.getBoundingClientRect();
            Position.place({
                pinElement: this.mountEl,
                baseElement: this,
                needAdjust:true,
                align:'tl bl'
            })
            // console.log('rect :',rect);
        }
        hideOverlay(){ 
            this.mountEl.style.display = 'none';
        }
        getTemplate():HTMLTemplateElement{
            const children = this.children;
            for(let i = 0; i < children.length; i++){
                const child = children[i];
                if(child.tagName === 'TEMPLATE'){
                    return child as HTMLTemplateElement
                }
            }
        }
        onClick(){
            const {open} = this.state;
            if(open){
                this.hideOverlay()
            }else{
                this.showOverlay();
            }
            this.setState({
                open:!open
            })
            console.log('clicked!!');
        }
        // static getDerivedStateFromProps(newProps,newState){
        //     let value = newState.value;
        //     if ('value' in newProps) {
        //         value = newProps.value
        //     }
        //     return {
        //         value
        //     }
        // }
        render(){
            const {} = this.state;
            const {} = this.props;
            return html`<slot @click="${this.onClick}"></slot>`
        }
    }
    return defineWebComponent(`${prefix}-dropdown`,Dropdown);
}

// <slot name="addonBefore" class="input-group-addon input-group-text before"></slot>
// <slot name="addonAfter" class="input-group-addon input-group-text after"></slot>