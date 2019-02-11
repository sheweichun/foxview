
import {TemplateStringsArray} from './type';
import {TemplateResult} from './templateResult'
import {createElement} from './element'
export {defineComponent,Component} from './component';
export {render} from './render';




export function html(strings:TemplateStringsArray,...values:any[]){
    return new TemplateResult(strings,values)
}

export function svg(strings:TemplateStringsArray,...values:any[]){
    return 1234;
}


export default {
    createElement
}