"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var part_1 = require("./part");
var dom_1 = require("./dom");
var template_processor_1 = require("./template-processor");
var parts = new WeakMap();
function shadowRender(result, container, options) {
    var part = parts.get(container);
    if (part === undefined) {
        dom_1.removeNodes(container, container.firstChild);
        parts.set(container, part = new part_1.NodePart(__assign({ templateProcessor: template_processor_1.default, templateClone: dom_1.clone }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
    return part;
}
exports.shadowRender = shadowRender;
function render(result, container, options) {
    return shadowRender(result, container, __assign({}, options, { notInWebComponent: true }));
}
exports.render = render;
