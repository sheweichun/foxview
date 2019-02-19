import { TemplateStringsArray } from './type';
import { TemplateResult, SVGTemplateResult } from './template-result';
export { defineWebComponent, WebComponent, property } from './webcomponent';
export { Component } from './component';
export { defineComponent } from './component-registry';
export { shadowRender as render } from './render';
export declare function html(strings: TemplateStringsArray, ...values: any[]): TemplateResult;
export declare function svg(strings: TemplateStringsArray, ...values: any[]): SVGTemplateResult;
