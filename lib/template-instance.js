"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateInstance = /** @class */ (function () {
    function TemplateInstance(options) {
        this._peons = [];
        this.mounted = false;
        this.options = options;
    }
    TemplateInstance.prototype._prepareFrament = function (templateResult) {
        var _a = this.options.templateProcessor(templateResult, this.options), peons = _a.peons, fragment = _a.fragment;
        this.fragment = fragment;
        this._peons = peons;
    };
    TemplateInstance.prototype.setValue = function (newTemplate) {
        var _this = this;
        if (!this.fragment) {
            this._prepareFrament(newTemplate);
        }
        this.template = newTemplate;
        this._peons.forEach(function (_peon) {
            _peon.setValue(_this.template.values);
        });
    };
    TemplateInstance.prototype.commit = function () {
        this._peons.forEach(function (_peon) {
            _peon.commit && _peon.commit();
        });
    };
    TemplateInstance.prototype._destroy = function () {
        this._peons.forEach(function (_peon) {
            _peon.destroy && _peon.destroy();
        });
        this._peons = null;
    };
    TemplateInstance.prototype.isSameTemplate = function (newTemplate) {
        if (this.template.type !== newTemplate.type)
            return false;
        var oldStrings = this.template.strings;
        var newStrings = newTemplate.strings;
        var oldLen = oldStrings.length;
        if (oldLen !== newStrings.length) {
            return false;
        }
        for (var i = 0; i < oldLen; i++) {
            if (oldStrings[i] !== newStrings[i]) {
                return false;
            }
        }
        return true;
    };
    return TemplateInstance;
}());
exports.TemplateInstance = TemplateInstance;
