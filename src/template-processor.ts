import {
  Peon,
  ITemplateResult,
  ProcessResult,
  RenderOptions,
  IComponentConstructor,
  ComponentPropSchema,
  ComponentSlotSchema
} from './type';
import { PeonType, createPeon } from './peon';
import { NodePart, ComponentPart } from './part';
import { removeAttributes } from './dom';
// import {getCom} from './component-registry';
import {
  marker,
  matchLastAttributeName,
  boundAttributeSuffix,
  markerRegex
} from './template';
import { DEFAULT_SLOT_NAME } from './util/constant';
import VMap from './util/map';

// type PrepareMap = {
//     [key:number]:Function
// }

type HandlerExtra = {
  templateResult?: ITemplateResult;
  renderOption: RenderOptions;
};

type HandleResult = {
  partIndex: number;
  nodesToRemove?: Node[];
};

function _prepareSlot(
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
) {
  const { renderOption } = extra;
  const nodesToRemove: Node[] = [node];
  const slotName = node.getAttribute('name') || DEFAULT_SLOT_NAME;
  const slotNodes = renderOption.slots[slotName];
  if (slotNodes && slotNodes.length > 0) {
    const len = slotNodes.length;
    const parentNode = node.parentNode;
    for (let i = 0; i < len; i++) {
      parentNode.insertBefore(slotNodes[i], node);
    }
  }
  return {
    partIndex,
    nodesToRemove
  };
}

function _prepareNodeComment(
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
): HandleResult {
  const { renderOption } = extra;
  const nodeValue = node.nodeValue!;
  const nodesToRemove: Node[] = [];
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
function _prepareNodeContent(
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
) {
  const { renderOption } = extra;
  const nodeValue = node.nodeValue!;
  if (nodeValue && nodeValue.indexOf(marker) >= 0) {
    const strings = nodeValue.split(markerRegex);
    peons.push(
      createPeon(PeonType.Content, {
        startIndex: partIndex,
        notInWebComponent: renderOption.notInWebComponent,
        strings,
        node
      })
    );
    partIndex += strings.length - 1;
  }
  return {
    partIndex
  };
}

function sliceName(val: string) {
  return val.slice(1);
}

type AttributeMapItem = {
  type: PeonType;
  getName: (val: string) => string;
};
const AttributeMap = {
  '@': {
    type: PeonType.Event,
    getName: sliceName
  },
  '.': {
    type: PeonType.Property,
    getName: sliceName
  },
  '?': {
    type: PeonType.BooleanAttribute,
    getName: sliceName
  }
};

const DefaultAttributeTarget = {
  type: PeonType.Attribute,
  getName: function(val: string) {
    return val;
  }
};

function forEach_node_attribute(
  node: Element,
  partIndex: number,
  templateResult: ITemplateResult,
  hasMarker: (
    name: string,
    target: AttributeMapItem,
    partIndex: number,
    strings: string[]
  ) => void,
  noMarker?: (curAttribute: Attr) => void
) {
  if (node.hasAttributes()) {
    const attributesToRemove = [];
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const curAttribute = attributes[i];
      if (curAttribute.value.indexOf(marker) >= 0) {
        const stringForPart = templateResult.strings[partIndex];
        const name = matchLastAttributeName(stringForPart)![2];
        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
        const attributeValue = node.getAttribute(attributeLookupName)!;
        const strings = attributeValue.split(markerRegex);
        attributesToRemove.push(attributeLookupName);
        const prefix = name[0];
        const target = AttributeMap[prefix] || DefaultAttributeTarget;
        // console.log(name,partIndex,templateResult.values);
        hasMarker(name, target, partIndex, strings);
        partIndex += strings.length - 1;
      } else {
        noMarker && noMarker(curAttribute);
      }
    }
    if (attributesToRemove.length > 0) {
      removeAttributes(node, attributesToRemove);
    }
  }
  return partIndex;
}

function _prepareComponent(
  ComponentProto: IComponentConstructor,
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
) {
  const { templateResult, renderOption } = extra;
  let propsSchemas: ComponentPropSchema[] = [];
  partIndex = forEach_node_attribute(
    node,
    partIndex,
    templateResult,
    function(name, target, newPartIndex) {
      propsSchemas.push({
        name: target.getName(name),
        index: newPartIndex
      });
    },
    function(curAttribute: Attr) {
      propsSchemas.push({
        name: curAttribute.localName,
        value: curAttribute.value
      });
    }
  );
  const slots: ComponentSlotSchema = {}; //todo slot处理
  const childNodeLen = node.children.length;
  if (childNodeLen > 0) {
    const defaultNodeList: Element[] = [];
    const fragment = document.createDocumentFragment();
    while (node.children.length > 0) {
      const childNode = node.children[0];
      const slotName = childNode.getAttribute('slot');
      if (slotName) {
        slots[slotName] = [childNode];
      } else {
        defaultNodeList.push(childNode);
      }
      fragment.appendChild(childNode);
    }
    const result = walkNode(fragment, templateResult, partIndex, renderOption);
    partIndex = result.partIndex;
    if (result.peons.length) {
      peons.push(...result.peons);
    }
    if (defaultNodeList.length > 0) {
      slots[DEFAULT_SLOT_NAME] = defaultNodeList;
    }
  }
  const component = new ComponentPart(
    ComponentProto,
    propsSchemas,
    slots,
    extra.renderOption
  );
  component.insertBeforeNode(node);
  peons.push(component);
  // console.log('localName :',node.localName,component);
  return {
    partIndex,
    nodesToRemove: [node]
  };
}

function _prepareNode(
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
) {
  const { components } = extra.renderOption;
  const { localName } = node;
  let DefinedComponent;
  if (components) {
    DefinedComponent = components[localName];
  }

  //todo 处理function组件
  if (DefinedComponent) {
    return _prepareComponent(
      DefinedComponent as IComponentConstructor,
      node,
      partIndex,
      peons,
      extra
    );
  } else if (extra.renderOption.slots && localName === 'slot') {
    //无slot无需解析slot
    return _prepareSlot(node, partIndex, peons, extra);
  } else {
    return _prepareNodeAttribute(node, partIndex, peons, extra);
  }
}

function _prepareNodeAttribute(
  node: Element,
  partIndex: number,
  peons: Array<Peon>,
  extra: HandlerExtra
) {
  const { templateResult, renderOption } = extra;
  partIndex = forEach_node_attribute(node, partIndex, templateResult, function(
    name,
    target,
    curPartIndex,
    strings
  ) {
    peons.push(
      createPeon(target.type, {
        startIndex: curPartIndex,
        strings,
        notInWebComponent: renderOption.notInWebComponent,
        name: target.getName(name),
        eventContext: extra.renderOption
          ? extra.renderOption.eventContext
          : null,
        node
      })
    );
  });
  return {
    partIndex
  };
}

const _prepareMap = {
  1: _prepareNode /* Node.ELEMENT_NODE */,
  3: _prepareNodeContent /* Node.TEXT_NODE */,
  8: _prepareNodeComment /* Node.COMMENT_NODE */
};

export function walkNode(
  fragment: DocumentFragment,
  templateResult: ITemplateResult,
  partIndex: number,
  option: RenderOptions
): ProcessResult {
  const peons = [];
  const walker = document.createTreeWalker(
    fragment,
    133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */,
    null as any,
    false
  );
  // let partIndex = 0;
  let nodesToRemove: Node[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Element;
    const handle = _prepareMap[node.nodeType];
    if (handle) {
      const result: HandleResult = handle(node, partIndex, peons, {
        templateResult,
        renderOption: option
      } as HandlerExtra);
      partIndex = result.partIndex;
      if (result.nodesToRemove) {
        nodesToRemove = nodesToRemove.concat(result.nodesToRemove);
      }
    }
  }
  for (const n of nodesToRemove) {
    n.parentNode!.removeChild(n);
  }
  return {
    fragment,
    partIndex,
    peons
  };
}

// export type templateCache = {
//     stringsArray: WeakMap<TemplateStringsArray, HTMLTemplateElement>;
//     keyString: Map<string, HTMLTemplateElement>;
//   };
// const templateCaches = new Map<string, templateCache>();
// export type TemplateFactory = (result: ITemplateResult) => HTMLTemplateElement;

// function templateFactory(result: ITemplateResult) {
//     let templateCache = templateCaches.get(result.type);
//     if (templateCache === undefined) {
//       templateCache = {
//         stringsArray: new WeakMap<TemplateStringsArray, HTMLTemplateElement>(),
//         keyString: new Map<string, HTMLTemplateElement>()
//       };
//       templateCaches.set(result.type, templateCache);
//     }

//     let template = templateCache.stringsArray.get(result.strings);
//     if (template !== undefined) {
//       return template;
//     }

//     // If the TemplateStringsArray is new, generate a key from the strings
//     // This key is shared between all templates with identical content
//     const key = result.strings.join(marker);

//     // Check if we already have a Template for this key
//     template = templateCache.keyString.get(key);
//     if (template === undefined) {
//       // If we have not seen this key before, create a new Template
//       template = result.getTemplateElement();
//       // Cache the Template for this key
//       templateCache.keyString.set(key, template);
//     }

//     // Cache all future queries for this TemplateStringsArray
//     templateCache.stringsArray.set(result.strings, template);
//     return template;
// }
export type templateCache = VMap<HTMLTemplateElement>;
const templateCaches = new VMap<templateCache>();
function templateFactory(result: ITemplateResult) {
  let templateCache = templateCaches.get(result.type);
  if (templateCache === undefined) {
    templateCache = new VMap<HTMLTemplateElement>();
    templateCaches.set(result.type, templateCache);
  }

  // let template = templateCache.stringsArray.get(result.strings);
  // if (template !== undefined) {
  //   return template;
  // }

  // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content
  const key = result.strings.join(marker);

  // Check if we already have a Template for this key
  let template = templateCache.get(key);
  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = result.getTemplateElement();
    templateCache.set(key, template);
    // Cache the Template for this key
    //   templateCache.keyString.set(key, template);
  }

  // Cache all future queries for this TemplateStringsArray
  // templateCache.stringsArray.set(result.strings, template);
  return template;
}

export default function(
  templateResult: ITemplateResult,
  option: RenderOptions
): ProcessResult {
  const fragment = option.templateClone!(templateFactory(templateResult)); //缓存优化
  return walkNode(fragment, templateResult, 0, option);
}
