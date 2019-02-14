

import {RenderOptions,ITemplateResult} from './type';
import {NodePart} from './part';
import {removeNodes,clone} from './dom';
import templateProcessor from './template-processor';





const parts = new WeakMap<Node, NodePart>();


export function shadowRender(
    result:ITemplateResult,
    container: Element|DocumentFragment,
    options?:Partial<RenderOptions>){
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container,container.firstChild);
        parts.set(container,part = new NodePart({
            templateProcessor,
            templateClone:clone,
            ...options,
        }))
        part.appendInto(container);
    }
    part.setValue(result)
    part.commit();
    return part;
}


export function render( result:ITemplateResult,
    container: Element|DocumentFragment,
    options?:Partial<RenderOptions>){
    return shadowRender(result,container,{
        ...options,
        notInWebComponent:true
    })
}