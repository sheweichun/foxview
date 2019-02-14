"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var peon_1 = require("./peon");
var part_1 = require("./part");
var dom_1 = require("./dom");
var component_registry_1 = require("./component-registry");
var template_1 = require("./template");
var constant_1 = require("./util/constant");
function _prepareSlot(node, partIndex, peons, extra) {
    var renderOption = extra.renderOption;
    var nodesToRemove = [node];
    var slotName = node.getAttribute('name') || constant_1.DEFAULT_SLOT_NAME;
    var slotNodes = renderOption.slots[slotName];
    if (slotNodes && slotNodes.length > 0) {
        var len = slotNodes.length;
        var parentNode = node.parentNode;
        for (var i = 0; i < len; i++) {
            parentNode.insertBefore(slotNodes[i], node);
        }
    }
    return {
        partIndex: partIndex,
        nodesToRemove: nodesToRemove
    };
}
function _prepareNodeComment(node, partIndex, peons, extra) {
    var renderOption = extra.renderOption;
    var nodeValue = node.nodeValue;
    var nodesToRemove = [];
    if (nodeValue === template_1.marker) {
        var nodePart = new part_1.NodePart(renderOption);
        nodePart.setValueIndex(partIndex);
        nodePart.attachNode(node);
        peons.push(nodePart);
        partIndex += 1;
        nodesToRemove.push(node);
    }
    return {
        partIndex: partIndex,
        nodesToRemove: nodesToRemove
    };
}
function _prepareNodeContent(node, partIndex, peons, extra) {
    var renderOption = extra.renderOption;
    var nodeValue = node.nodeValue;
    if (nodeValue && nodeValue.indexOf(template_1.marker) >= 0) {
        var strings = nodeValue.split(template_1.markerRegex);
        peons.push(peon_1.createPeon(peon_1.PeonType.Content, {
            startIndex: partIndex,
            notInWebComponent: renderOption.notInWebComponent,
            strings: strings,
            node: node
        }));
        partIndex += strings.length - 1;
    }
    return {
        partIndex: partIndex
    };
}
function sliceName(val) {
    return val.slice(1);
}
var AttributeMap = {
    '@': {
        type: peon_1.PeonType.Event,
        getName: sliceName
    },
    '.': {
        type: peon_1.PeonType.Property,
        getName: sliceName
    },
    '?': {
        type: peon_1.PeonType.BooleanAttribute,
        getName: sliceName
    }
};
var DefaultAttributeTarget = {
    type: peon_1.PeonType.Attribute,
    getName: function (val) {
        return val;
    }
};
function forEach_node_attribute(node, partIndex, templateResult, hasMarker, noMarker) {
    if (node.hasAttributes()) {
        var attributesToRemove = [];
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var curAttribute = attributes[i];
            if (curAttribute.value.indexOf(template_1.marker) >= 0) {
                var stringForPart = templateResult.strings[partIndex];
                var name_1 = template_1.matchLastAttributeName(stringForPart)[2];
                var attributeLookupName = name_1.toLowerCase() + template_1.boundAttributeSuffix;
                var attributeValue = node.getAttribute(attributeLookupName);
                var strings = attributeValue.split(template_1.markerRegex);
                attributesToRemove.push(attributeLookupName);
                var prefix = name_1[0];
                var target = AttributeMap[prefix] || DefaultAttributeTarget;
                // console.log(name,partIndex,templateResult.values);
                hasMarker(name_1, target, partIndex, strings);
                partIndex += strings.length - 1;
            }
            else {
                noMarker && noMarker(curAttribute);
            }
        }
        if (attributesToRemove.length > 0) {
            dom_1.removeAttributes(node, attributesToRemove);
        }
    }
    return partIndex;
}
function _prepareComponent(ComponentProto, node, partIndex, peons, extra) {
    var templateResult = extra.templateResult, renderOption = extra.renderOption;
    var propsSchemas = [];
    partIndex = forEach_node_attribute(node, partIndex, templateResult, function (name, target, newPartIndex) {
        propsSchemas.push({
            name: target.getName(name),
            index: newPartIndex
        });
    }, function (curAttribute) {
        propsSchemas.push({
            name: curAttribute.localName,
            value: curAttribute.value,
        });
    });
    var slots = {}; //todo slot处理
    var childNodeLen = node.children.length;
    if (childNodeLen > 0) {
        var defaultNodeList = [];
        var fragment = document.createDocumentFragment();
        while (node.children.length > 0) {
            var childNode = node.children[0];
            var slotName = childNode.getAttribute('slot');
            if (slotName) {
                slots[slotName] = [childNode];
            }
            else {
                defaultNodeList.push(childNode);
            }
            fragment.appendChild(childNode);
        }
        var result = walkNode(fragment, templateResult, partIndex, renderOption);
        partIndex = result.partIndex;
        if (result.peons.length) {
            peons.push.apply(peons, result.peons);
        }
        if (defaultNodeList.length > 0) {
            slots[constant_1.DEFAULT_SLOT_NAME] = defaultNodeList;
        }
    }
    var component = new part_1.ComponentPart(ComponentProto, propsSchemas, slots, extra.renderOption);
    component.insertBeforeNode(node);
    peons.push(component);
    return {
        partIndex: partIndex,
        nodesToRemove: [node]
    };
}
function _prepareNode(node, partIndex, peons, extra) {
    var localName = node.localName;
    var DefinedComponent = component_registry_1.getComponentByName(localName);
    if (DefinedComponent) {
        return _prepareComponent(DefinedComponent, node, partIndex, peons, extra);
    }
    else if (extra.renderOption.slots && localName === 'slot') { //无slot无需解析slot
        return _prepareSlot(node, partIndex, peons, extra);
    }
    else {
        return _prepareNodeAttribute(node, partIndex, peons, extra);
    }
}
function _prepareNodeAttribute(node, partIndex, peons, extra) {
    var templateResult = extra.templateResult, renderOption = extra.renderOption;
    partIndex = forEach_node_attribute(node, partIndex, templateResult, function (name, target, curPartIndex, strings) {
        peons.push(peon_1.createPeon(target.type, {
            startIndex: curPartIndex,
            strings: strings,
            notInWebComponent: renderOption.notInWebComponent,
            name: target.getName(name),
            eventContext: extra.renderOption ? extra.renderOption.eventContext : null,
            node: node
        }));
    });
    return {
        partIndex: partIndex
    };
}
var _prepareMap = {
    1: _prepareNode,
    3: _prepareNodeContent,
    8: _prepareNodeComment /* Node.COMMENT_NODE */
};
function walkNode(fragment, templateResult, partIndex, option) {
    var peons = [];
    var walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
    // let partIndex = 0;
    var nodesToRemove = [];
    while (walker.nextNode()) {
        var node = walker.currentNode;
        var handle = _prepareMap[node.nodeType];
        if (handle) {
            var result = handle(node, partIndex, peons, {
                templateResult: templateResult,
                renderOption: option
            });
            partIndex = result.partIndex;
            if (result.nodesToRemove) {
                nodesToRemove = nodesToRemove.concat(result.nodesToRemove);
            }
        }
    }
    for (var _i = 0, nodesToRemove_1 = nodesToRemove; _i < nodesToRemove_1.length; _i++) {
        var n = nodesToRemove_1[_i];
        n.parentNode.removeChild(n);
    }
    return {
        fragment: fragment,
        partIndex: partIndex,
        peons: peons
    };
}
exports.walkNode = walkNode;
var templateCaches = new Map();
// export type TemplateFactory = (result: ITemplateResult) => HTMLTemplateElement;
function templateFactory(result) {
    var templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    var template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    var key = result.strings.join(template_1.marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = result.getTemplateElement();
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
function default_1(templateResult, option) {
    var fragment = option.templateClone(templateFactory(templateResult)); //缓存优化
    return walkNode(fragment, templateResult, 0, option);
}
exports.default = default_1;
