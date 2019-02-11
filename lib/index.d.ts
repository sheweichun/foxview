import { TemplateStringsArray } from './type';
import { TemplateResult } from './templateResult';
export { defineComponent, Component } from './component';
export { render } from './render';
export declare function html(strings: TemplateStringsArray, ...values: any[]): TemplateResult;
export declare function svg(strings: TemplateStringsArray, ...values: any[]): number;
