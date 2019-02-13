"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var peon_1 = require("./peon");
var part_1 = require("./part");
var template_1 = require("./template");
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
function _prepareNodeContent(node, partIndex, peons) {
    var nodeValue = node.nodeValue;
    if (nodeValue && nodeValue.indexOf(template_1.marker) >= 0) {
        var strings = nodeValue.split(template_1.markerRegex);
        peons.push(peon_1.createPeon(peon_1.PeonType.Content, {
            startIndex: partIndex,
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
function _prepareNodeAttribute(node, partIndex, peons, extra) {
    var templateResult = extra.templateResult;
    console.log('name :', node.localName);
    if (node.hasAttributes()) {
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].value.indexOf(template_1.marker) >= 0) {
                var stringForPart = templateResult.strings[partIndex];
                // console.log('stringForPart  :',stringForPart);
                var name_1 = template_1.matchLastAttributeName(stringForPart)[2];
                var attributeLookupName = name_1.toLowerCase() + template_1.boundAttributeSuffix;
                var attributeValue = node.getAttribute(attributeLookupName);
                var strings = attributeValue.split(template_1.markerRegex);
                node.removeAttribute(attributeLookupName);
                var prefix = name_1[0];
                var target = AttributeMap[prefix] || DefaultAttributeTarget;
                peons.push(peon_1.createPeon(target.type, {
                    startIndex: partIndex,
                    strings: strings,
                    name: target.getName(name_1),
                    eventContext: extra.renderOption ? extra.renderOption.eventContext : null,
                    node: node
                }));
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
        partIndex: partIndex
    };
}
var _prepareMap = {
    1: _prepareNodeAttribute,
    3: _prepareNodeContent,
    8: _prepareNodeComment /* Node.COMMENT_NODE */
};
//todo  缓存优化
function default_1(templateResult, option) {
    var fragment = option.templateClone(templateResult.getTemplateElement());
    var peons = [];
    var walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
    var partIndex = 0;
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
        peons: peons
    };
}
exports.default = default_1;
