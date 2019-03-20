// import {TemplateResult} from './template-result';
import VMap from './util/map';

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

export const createMarker = () => document.createComment('');

export const marker = `{{tiny-${String(Math.random()).slice(2)}}}`;

export const nodeMarker = `<!--${marker}-->`;

export const markerRegex = new RegExp(`${marker}|${nodeMarker}`);

/**
 * Suffix appended to all bound attribute names.
 */
export const boundAttributeSuffix = '$tiny$';
export const boundAttributeSuffixReg = /\$tiny\$/;

const matchCache = new VMap<RegExpExecArray>();

export function matchLastAttributeName(value: string) {
  const cached = matchCache.get(value);
  if (cached) return cached;
  const result = lastAttributeNameRegex.exec(value);
  if (result) {
    matchCache.set(value, result);
  }
  return result;
}

const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
