

import {RenderOptions,ITemplateResult} from './type';
import {NodePart} from './part';
import {removeNodes,clone} from './dom';
import templateProcessor from './template-processor';
import assign from './util/assign';





// const parts = new VMap<Node, NodePart>();


export function shadowRender(
    result:ITemplateResult,
    container: Element|DocumentFragment,
    options?:Partial<RenderOptions>){
    //@ts-ignore
    let part = container.$$part;
    if (part === undefined) {
        removeNodes(container,container.firstChild);
        
        part = new NodePart(assign({},{
            templateProcessor,
            templateClone:clone
        },options))
        part.appendInto(container);
        //@ts-ignore
        container.$$part = part;
    }
    part.setValue(result)
    part.commit();
    return part;
}


export function render( result:ITemplateResult,
    container: Element|DocumentFragment,
    options?:Partial<RenderOptions>){
    return shadowRender(result,container,assign({},options,{
        notInWebComponent:true
    }))
}