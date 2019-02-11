"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("./render");
// import {TemplateStringsArray,ComponentPrototype} from './type';
class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        render_1.render(this.render(), this.shadowRoot);
    }
    // connectedCallback(){
    // }
    attributeChangedCallback(name, old, value) {
        console.log(name, old, value);
    }
}
exports.Component = Component;
function defineComponent(name, componentClz) {
    customElements.define(name, componentClz);
}
exports.defineComponent = defineComponent;
