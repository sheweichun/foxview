"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = require("./template");
var dom_1 = require("./dom");
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
var TemplateResult = /** @class */ (function () {
    function TemplateResult(strings, values, type) {
        this.strings = strings;
        this.values = values;
        this.type = type;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    TemplateResult.prototype.getHTML = function () {
        var endIndex = this.strings.length - 1;
        var html = '';
        for (var i = 0; i < endIndex; i++) {
            var s = this.strings[i];
            var match = template_1.matchLastAttributeName(s);
            if (match) {
                // We're starting a new bound attribute.
                // Add the safe attribute suffix, and use unquoted-attribute-safe
                // marker.
                html += s.substr(0, match.index) + match[1] + match[2] + template_1.boundAttributeSuffix + match[3] + template_1.marker;
            }
            else {
                // We're either in a bound node, or trailing bound attribute.
                // Either way, nodeMarker is safe to use.
                html += s + template_1.nodeMarker;
            }
        }
        html += this.strings[endIndex];
        return html;
    };
    // getHTML():string{
    //   let content = '';
    //   this.strings.forEach((str,index)=>{
    //       const val = this.values[index];
    //       content += str;
    //       if(val != null){
    //           content += val;
    //       }
    //   });
    //   return content;
    // }
    TemplateResult.prototype.getTemplateElement = function () {
        var template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    };
    return TemplateResult;
}());
exports.TemplateResult = TemplateResult;
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
var SVGTemplateResult = /** @class */ (function (_super) {
    __extends(SVGTemplateResult, _super);
    function SVGTemplateResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGTemplateResult.prototype.getHTML = function () {
        return "<svg>" + _super.prototype.getHTML.call(this) + "</svg>";
    };
    SVGTemplateResult.prototype.getTemplateElement = function () {
        var template = _super.prototype.getTemplateElement.call(this);
        var content = template.content;
        var svgElement = content.firstChild;
        content.removeChild(svgElement);
        dom_1.reparentNodes(content, svgElement.firstChild);
        return template;
    };
    return SVGTemplateResult;
}(TemplateResult));
exports.SVGTemplateResult = SVGTemplateResult;
