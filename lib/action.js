"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_ATTRIBUTE_VALUE = 1;
exports.SET_ATTRIBUTE = 2;
exports.SET_CONTENT = 3;
function parseAction(s) {
    const lastChar = s[s.length - 1];
    if (lastChar === ':')
        for (let i = 0; i < s.length; i++) {
        }
}
exports.parseAction = parseAction;
