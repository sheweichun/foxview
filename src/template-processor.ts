
import {Peon,ITemplateResult,ProcessResult, RenderOptions} from './type';
import {PeonType,createPeon} from './peon';
import {NodePart,ComponentPart} from './part';
import {getComponentByName} from './component-registry';
import {marker,matchLastAttributeName,boundAttributeSuffix, markerRegex} from './template';

// type PrepareMap = {
//     [key:number]:Function
// }

type HandlerExtra = {
    templateResult?:ITemplateResult,
    renderOption:RenderOptions
}

type HandleResult = {
    partIndex:number
    nodesToRemove?:Node[]
}

function _prepareNodeComment(node:Element,partIndex:number,peons: Array<Peon>,extra:HandlerExtra):HandleResult{
    const {renderOption} = extra;
    const nodeValue = node.nodeValue!;
    const nodesToRemove:Node[] = [];
    if (nodeValue === marker) {
        const nodePart = new NodePart(renderOption);
        nodePart.setValueIndex(partIndex);
        nodePart.attachNode(node);
        peons.push(nodePart);
        partIndex += 1;
        nodesToRemove.push(node);
    }
    return {
        partIndex,
        nodesToRemove
    };
}
function _prepareNodeContent(node:Element,partIndex:number,peons: Array<Peon>){
    const nodeValue = node.nodeValue!;
    if (nodeValue && nodeValue.indexOf(marker) >= 0) {
        const strings = nodeValue.split(markerRegex);
        peons.push(createPeon(PeonType.Content,{
            startIndex:partIndex,
            strings,
            node
        }))
        partIndex += strings.length - 1;
    }
    return {
        partIndex
    };
}

function sliceName(val:string){
    return val.slice(1)
}

const AttributeMap = {
    '@':{
        type:PeonType.Event,
        getName:sliceName
    },
    '.':{
        type:PeonType.Property,
        getName:sliceName
    },
    '?':{
        type:PeonType.BooleanAttribute,
        getName:sliceName
    }
}

const DefaultAttributeTarget = {
    type:PeonType.Attribute,
    getName:function(val:string){
        return val;
    }
}

function _prepareNodeAttribute(node:Element,partIndex:number,peons: Array<Peon>,extra:HandlerExtra){
    const {templateResult} = extra;
    console.log('name :',node.localName);
    if(node.hasAttributes()){
        const attributes = node.attributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].value.indexOf(marker) >= 0) {
                const stringForPart = templateResult.strings[partIndex];
                // console.log('stringForPart  :',stringForPart);
                const name = matchLastAttributeName(stringForPart)![2];
                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName)!;
                const strings = attributeValue.split(markerRegex);
                node.removeAttribute(attributeLookupName);
                const prefix = name[0]
                const target = AttributeMap[prefix] || DefaultAttributeTarget;
                peons.push(createPeon(target.type,{
                    startIndex:partIndex,
                    strings,
                    name:target.getName(name),
                    eventContext:extra.renderOption ? extra.renderOption.eventContext : null,
                    node
                }))
                // if(prefix === '@'){
                //     peons.push(createPeon(PeonType.Event,{
                //         startIndex:partIndex,
                //         strings,
                //         name:name.slice(1),
                //         eventContext:extra.renderOption ? extra.renderOption.eventContext : null,
                //         node
                //     }))
                // }else if(prefix === '.'){
                //     peons.push(createPeon(PeonType.Property,{
                //         startIndex:partIndex,
                //         strings,
                //         name:name.slice(1),
                //         node
                //     }))
                // }else{
                //     peons.push(createPeon(PeonType.Attribute,{
                //         startIndex:partIndex,
                //         strings,
                //         name,
                //         node
                //     }))
                // }
                partIndex += strings.length - 1;
            }
        }
    }
    return {
        partIndex
    };
}

const _prepareMap = {
    1:_prepareNodeAttribute,  /* Node.ELEMENT_NODE */
    3:_prepareNodeContent, /* Node.TEXT_NODE */
    8:_prepareNodeComment /* Node.COMMENT_NODE */

}



//todo  缓存优化
export default function(templateResult:ITemplateResult,option:RenderOptions):ProcessResult{
    const fragment = option.templateClone!(templateResult.getTemplateElement());
    const peons = [];
    const walker = document.createTreeWalker(
        fragment,
        133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */,
        null as any,
        false);
    let partIndex = 0;
    let nodesToRemove:Node[] = [];
    while (walker.nextNode()) {
        const node = walker.currentNode as Element;
        const handle = _prepareMap[node.nodeType]
        if(handle){
            const result:HandleResult = handle(node,partIndex,peons,{
                templateResult,
                renderOption:option
            } as HandlerExtra);
            partIndex = result.partIndex;
            if(result.nodesToRemove){
                nodesToRemove = nodesToRemove.concat(result.nodesToRemove)
            }
        }
    }
    for (const n of nodesToRemove) {
        n.parentNode!.removeChild(n);
    }
    return {
        fragment,
        peons
    }
}