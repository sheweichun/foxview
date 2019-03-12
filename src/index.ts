
import {TemplateStringsArray,IRef, ITemplateResult,RenderOptionComponents} from './type';
import {TemplateResult,SVGTemplateResult} from './template-result'
export {defineWebComponent,WebComponent,property,customElement} from './webcomponent';
export {Component} from './component';
// export {defineComponent} from './component-registry';
import {shadowRender} from './render';
export const render = shadowRender;
// export {shadowRender as render} from './render'



export function html(strings: TemplateStringsArray, ...values: any[]) {
  return new TemplateResult(strings, values, 'html');
}

export const h = html

export function svg(strings:TemplateStringsArray,...values:any[]){
    return new SVGTemplateResult(strings,values,'svg');
}
export const s = svg

export function createRef(): IRef {
  return {
    current: null
  };
}


type FoxViewOption = {
    el:Element | string,
    template:ITemplateResult,
    components?:RenderOptionComponents
}

export default class FoxView{
    private _el:Element
    private _template:ITemplateResult
    private _components?:RenderOptionComponents
    constructor(opt:FoxViewOption){
        let el = opt.el;
        if(typeof el === 'string'){
            this._el = document.querySelector(el)
        }else{
            this._el = opt.el as Element;
        }
        this._template = opt.template
        this._components = opt.components
        this.render()
    }
    render(){
        render(this._template,this._el,{
            components:this._components || {}
        })
    }
}
// export function render(){

// }

