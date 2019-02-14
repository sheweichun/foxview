
import {TemplateStringsArray} from './type';
import {TemplateResult,SVGTemplateResult} from './template-result'
export {defineWebComponent,WebComponent,property} from './webcomponent';
export {Component} from './component';
export {defineComponent} from './component-registry';
export {shadowRender as render} from './render'



export function html(strings:TemplateStringsArray,...values:any[]){
    return new TemplateResult(strings,values,'html')
}

export function svg(strings:TemplateStringsArray,...values:any[]){
    return new SVGTemplateResult(strings,values,'svg');
}

// export function render(){

// }

