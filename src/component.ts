
import {render} from './render';
import {TemplateResult} from './templateResult';
// import {TemplateStringsArray,ComponentPrototype} from './type';


export abstract class Component extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        render(this.render(),this.shadowRoot)
        
    }
    abstract render():TemplateResult
    // connectedCallback(){
        
    // }
    attributeChangedCallback(name: string, old: string|null, value: string|null) {
        console.log(name,old,value);
    }
}

export function defineComponent(name:string,componentClz:typeof Component){
    customElements.define(name, componentClz)
}