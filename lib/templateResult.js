"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {reparentNodes} from './dom';
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    //   getHTML(): string {
    //     const endIndex = this.strings.length - 1;
    //     const html = [];
    //     for (let i = 0; i < endIndex; i++) {
    //       const s = this.strings[i];
    //     }
    //     html.push(this.strings[endIndex]);
    //     return html.join('');
    //   }
    getHTML() {
        let content = '';
        this.strings.forEach((str, index) => {
            const val = this.values[index];
            content += str;
            if (val != null) {
                content += val;
            }
        });
        return content;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
exports.TemplateResult = TemplateResult;
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
// export class SVGTemplateResult extends TemplateResult {
//   getHTML(): string {
//     return `<svg>${super.getHTML()}</svg>`;
//   }
//   getTemplateElement(): HTMLTemplateElement {
//     const template = super.getTemplateElement();
//     const content = template.content;
//     const svgElement = content.firstChild!;
//     content.removeChild(svgElement);
//     reparentNodes(content, svgElement.firstChild);
//     return template;
//   }
// }
