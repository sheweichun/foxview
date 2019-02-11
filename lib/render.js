"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("./dom");
function render(templateResult, container) {
    container.appendChild(dom_1.clone(templateResult.getTemplateElement()));
}
exports.render = render;
