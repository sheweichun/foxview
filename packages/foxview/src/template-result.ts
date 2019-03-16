import { TemplateStringsArray, ITemplateResult } from './type';
import {
  matchLastAttributeName,
  boundAttributeSuffix,
  marker,
  nodeMarker
} from './template';
import { reparentNodes } from './dom';
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
export class TemplateResult implements ITemplateResult {
  strings: TemplateStringsArray;
  values: any[];
  type: string;
  constructor(strings: TemplateStringsArray, values: any[], type: string) {
    this.strings = strings;
    this.values = values;
    this.type = type;
  }

  /**
   * Returns a string of HTML used to create a `<template>` element.
   */
  getHTML(): string {
    const endIndex = this.strings.length - 1;
    let html = '';
    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i];
      const match = matchLastAttributeName(s);
      if (match) {
        // We're starting a new bound attribute.
        // Add the safe attribute suffix, and use unquoted-attribute-safe
        // marker.
        html +=
          s.substr(0, match.index) +
          match[1] +
          match[2] +
          boundAttributeSuffix +
          match[3] +
          marker;
      } else {
        // We're either in a bound node, or trailing bound attribute.
        // Either way, nodeMarker is safe to use.
        html += s + nodeMarker;
      }
    }
    html += this.strings[endIndex];
    return html;
  }
  // getHTML():string{
  //   let content = '';
  //   this.strings.forEach((str,index)=>{
  //       const val = this.values[index];
  //       content += str;
  //       if(val != null){
  //           content += val;
  //       }
  //   });
  //   return content;
  // }

  getTemplateElement(): HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }
}

/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
export class SVGTemplateResult extends TemplateResult {
  getHTML(): string {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement(): HTMLTemplateElement {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild!;
    content.removeChild(svgElement);
    reparentNodes(content, svgElement.firstChild);
    return template;
  }
}
