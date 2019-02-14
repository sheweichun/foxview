"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_result_1 = require("./template-result");
var webcomponent_1 = require("./webcomponent");
exports.defineWebComponent = webcomponent_1.defineWebComponent;
exports.WebComponent = webcomponent_1.WebComponent;
exports.property = webcomponent_1.property;
var component_1 = require("./component");
exports.Component = component_1.Component;
var component_registry_1 = require("./component-registry");
exports.defineComponent = component_registry_1.defineComponent;
var render_1 = require("./render");
exports.render = render_1.shadowRender;
function html(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return new template_result_1.TemplateResult(strings, values, 'html');
}
exports.html = html;
function svg(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return new template_result_1.SVGTemplateResult(strings, values, 'svg');
}
exports.svg = svg;
// export function render(){
// }
