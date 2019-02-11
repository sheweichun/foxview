"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templateResult_1 = require("./templateResult");
var component_1 = require("./component");
exports.defineComponent = component_1.defineComponent;
exports.Component = component_1.Component;
var render_1 = require("./render");
exports.render = render_1.render;
function html(strings, ...values) {
    return new templateResult_1.TemplateResult(strings, values);
}
exports.html = html;
function svg(strings, ...values) {
    return 1234;
}
exports.svg = svg;
