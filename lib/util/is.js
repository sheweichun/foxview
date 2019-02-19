"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(val) {
    return typeof val === 'string';
}
exports.isString = isString;
exports.isPrimitive = function (value) {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
