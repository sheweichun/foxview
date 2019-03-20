
import {IRef,TemplateStringsArray} from './type';
import {TemplateResult,SVGTemplateResult} from './template-result'
export {defineWebComponent,WebComponent,property,customElement} from './webcomponent';
export {Component} from './component';
// export {defineComponent} from './component-registry';
export {shadowRender as render,mount,unmount} from './render';

// export {shadowRender as render} from './render'

// export const render = shadowRender;

export function html(strings: TemplateStringsArray | string[], ...values: any[]) {
  return new TemplateResult(strings as string[], values, 'html');
}
export const h = html

function dynamicTagParse(strings: TemplateStringsArray | string[],values: any[]){
  const firstStr = strings[0];
  let newTemplate = strings,newValues = values;
  if(firstStr === '<'){
    const tagTemplate = `${firstStr}${values[0]}${strings[1]}`;
    newTemplate = [tagTemplate,...strings.slice(2)];
    newValues = values.slice(1);
  }
  const lastStr = newTemplate[newTemplate.length - 1];
  if(lastStr === '>'){
    const startIndex = newTemplate.length - 2;
    const tagTemplate = `${newTemplate[startIndex]}${newValues[newValues.length - 1]}${lastStr}`;
    newTemplate = [...newTemplate.slice(0,startIndex),tagTemplate];
    newValues = newValues.slice(0,newValues.length - 1);
  }
  
  return [newTemplate as string[],newValues]
}

export function dhtml(strings:TemplateStringsArray | string[],...values:any[]){
  const [nstrings,nvalues] = dynamicTagParse(strings,values)
  return new TemplateResult(nstrings,nvalues, 'html');
}
export const dh = dhtml

export function svg(strings:TemplateStringsArray | string[],...values:any[]){
  return new SVGTemplateResult(strings as string[],values,'svg');
}
export const s = svg

export function dsvg(strings:TemplateStringsArray | string[],...values:any[]){
  const [nstrings,nvalues] = dynamicTagParse(strings,values)
  return new SVGTemplateResult(nstrings,nvalues, 'svg');
}
export const ds = dsvg


export type Ref = IRef;
export function createRef(): IRef {
  return {
    current: null
  };
}


// export const customElement = Webc.customElement
// export const defineWebComponent = Webc.defineWebComponent
// export const WebComponent = Webc.WebComponent
// export const property = Webc.property

// type FoxViewOption = {
//     el:Element | string,
//     template:ITemplateResult,
//     components?:RenderOptionComponents
// }

// export function mount(opt:FoxViewOption){
//     let el = opt.el;
//     if(typeof el === 'string'){
//         el = document.querySelector(el)
//     }else{
//         el = opt.el as Element;
//     }
//     render(opt.template,el,{
//         components:opt.components || {}
//     })
// }

// export const unmount = clear



// class FoxView{
//     private _el:Element
//     private _template:ITemplateResult
//     private _components?:RenderOptionComponents
//     static h = html
//     static html = html
//     static svg = svg
//     static s = svg
//     static createRef = createRef
//     static render = shadowRender
//     constructor(opt:FoxViewOption){
//         let el = opt.el;
//         if(typeof el === 'string'){
//             this._el = document.querySelector(el)
//         }else{
//             this._el = opt.el as Element;
//         }
//         this._template = opt.template
//         this._components = opt.components
//         this.render()
//     }
//     render(){
//         render(this._template,this._el,{
//             components:this._components || {}
//         })
//     }
// }



// export default FoxView
