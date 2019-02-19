"use strict";
// import {TemplateResult} from './template-result';
Object.defineProperty(exports, "__esModule", { value: true });
// type TemplatePart = {
//   type: 'node',
//   index: number
// }|{type: 'attribute', index: number, name: string, strings: string[]};
// export class Template{
//   parts: TemplatePart[] = [];
//   element: HTMLTemplateElement;
//   constructor(result: TemplateResult, element: HTMLTemplateElement) {
//     this.element = element;
//   }
//   _prepareTemplate(){
//     const content = this.element.content;
//     const walker = document.createTreeWalker(
//       content,
//       133,
//       null,
//       false
//     )
//   }
// }
exports.createMarker = function () { return document.createComment(''); };
exports.marker = "{{tiny-" + String(Math.random()).slice(2) + "}}";
exports.nodeMarker = "<!--" + exports.marker + "-->";
exports.markerRegex = new RegExp(exports.marker + "|" + exports.nodeMarker);
/**
 * Suffix appended to all bound attribute names.
 */
exports.boundAttributeSuffix = '$tiny$';
var matchCache = new Map();
function matchLastAttributeName(value) {
    var cached = matchCache.get(value);
    if (cached)
        return cached;
    var result = lastAttributeNameRegex.exec(value);
    if (result) {
        matchCache.set(value, result);
    }
    return result;
}
exports.matchLastAttributeName = matchLastAttributeName;
var lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
