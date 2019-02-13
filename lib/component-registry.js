"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentCenter = new Map();
function defineComponent(name, ComponentProto) {
    ComponentCenter.set(name, ComponentProto);
}
exports.defineComponent = defineComponent;
function getComponentByName(name) {
    return ComponentCenter.get(name);
}
exports.getComponentByName = getComponentByName;
