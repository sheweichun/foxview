import { TemplateStringsArray, ITemplateResult } from './type';
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
export declare class TemplateResult implements ITemplateResult {
    strings: TemplateStringsArray;
    values: any[];
    type: string;
    constructor(strings: TemplateStringsArray, values: any[], type: string);
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML(): string;
    getTemplateElement(): HTMLTemplateElement;
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
export declare class SVGTemplateResult extends TemplateResult {
    getHTML(): string;
    getTemplateElement(): HTMLTemplateElement;
}
