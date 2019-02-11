

import {TemplateStringsArray} from './type';
import {TemplateResult} from './templateResult';
import {clone} from './dom';

export function render(templateResult:TemplateResult,container: Element|DocumentFragment){
    container.appendChild(clone(templateResult.getTemplateElement()));
}