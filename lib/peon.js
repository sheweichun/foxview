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
var PeonType;
(function (PeonType) {
    PeonType[PeonType["Attribute"] = 0] = "Attribute";
    PeonType[PeonType["Property"] = 1] = "Property";
    PeonType[PeonType["Content"] = 2] = "Content";
    PeonType[PeonType["Event"] = 3] = "Event";
    PeonType[PeonType["BooleanAttribute"] = 4] = "BooleanAttribute";
    // Comment
})(PeonType = exports.PeonType || (exports.PeonType = {}));
function injectValue2Strings(startIndex, strings, values) {
    var result = '';
    var lastIndex = strings.length - 1;
    for (var i = 0; i < lastIndex; i++) {
        result += strings[i] + values[startIndex + i];
    }
    result += strings[lastIndex];
    return result;
}
var AttributePeon = /** @class */ (function () {
    function AttributePeon(option) {
        this._shouldUpdate = false;
        this.startIndex = option.startIndex;
        this.name = option.name;
        this.node = option.node;
        this.strings = option.strings;
    }
    AttributePeon.prototype.setValue = function (values) {
        var newValue = injectValue2Strings(this.startIndex, this.strings, values);
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    };
    AttributePeon.prototype.commit = function () {
        if (!this._shouldUpdate)
            return;
        this
            .node
            .setAttribute(this.name, this._pendingValue);
        this._shouldUpdate = false;
    };
    return AttributePeon;
}());
var ContentPeon = /** @class */ (function () {
    function ContentPeon(option) {
        this._shouldUpdate = false;
        this.startIndex = option.startIndex;
        this.node = option.node;
        this.strings = option.strings;
    }
    ContentPeon.prototype.setValue = function (values) {
        var newValue = injectValue2Strings(this.startIndex, this.strings, values);
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = injectValue2Strings(this.startIndex, this.strings, values);
    };
    ContentPeon.prototype.commit = function () {
        if (!this._shouldUpdate)
            return;
        this.node.nodeValue = this._pendingValue;
        this._shouldUpdate = false;
    };
    return ContentPeon;
}());
var eventOptionsSupported = false;
try {
    var options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
}
catch (_e) { }
var EventPeon = /** @class */ (function () {
    function EventPeon(option) {
        var _this = this;
        this.value = undefined;
        this._pendingValue = undefined;
        this.node = option.node;
        this.name = option.name;
        this.startIndex = option.startIndex;
        this.eventContext = option.eventContext;
        this._boundHandleEvent = function (e) { return _this.handleEvent(e); };
    }
    EventPeon.getOptions = function (o) {
        return o && (eventOptionsSupported
            ? {
                capture: o.capture,
                passive: o.passive,
                once: o.once
            }
            : o.capture);
    };
    EventPeon.prototype.setValue = function (values) {
        this._pendingValue = values[this.startIndex];
    };
    EventPeon.prototype.commit = function () {
        var newListener = this._pendingValue;
        var oldListener = this.value;
        var element = this.node;
        var shouldRemoveListener = newListener == null
            || oldListener != null
                && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
        var shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            element.removeEventListener(this.name, this._boundHandleEvent, this._options);
        }
        if (shouldAddListener) {
            this._options = EventPeon.getOptions(newListener);
            element.addEventListener(this.name, this._boundHandleEvent, this._options);
        }
        this.value = newListener;
        // this._pendingValue = noChange;
    };
    EventPeon.prototype.handleEvent = function (event) {
        if (typeof this.value === 'function') {
            this
                .value
                .call(this.eventContext || this.node, event);
        }
        else {
            this
                .value
                .handleEvent(event);
        }
    };
    return EventPeon;
}());
var BooleanAttributePeon = /** @class */ (function (_super) {
    __extends(BooleanAttributePeon, _super);
    function BooleanAttributePeon(option) {
        var _this = _super.call(this, option) || this;
        if (_this.strings.length !== 2 || _this.strings[0] !== '' || _this.strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        return _this;
    }
    BooleanAttributePeon.prototype.setValue = function (values) {
        var newValue = values[this.startIndex];
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    };
    BooleanAttributePeon.prototype.commit = function () {
        if (!this._shouldUpdate)
            return;
        var value = this._pendingValue;
        if (value) {
            this.node.setAttribute(this.name, '');
        }
        else {
            this.node.removeAttribute(this.name);
        }
        this._shouldUpdate = false;
    };
    return BooleanAttributePeon;
}(AttributePeon));
var PropertyPeon = /** @class */ (function (_super) {
    __extends(PropertyPeon, _super);
    function PropertyPeon(option) {
        var _this = _super.call(this, option) || this;
        _this.single =
            (_this.strings.length === 2 && _this.strings[0] === '' && _this.strings[1] === '');
        return _this;
    }
    PropertyPeon.prototype.setValue = function (values) {
        var newValue;
        if (this.single) {
            newValue = values[this.startIndex];
        }
        else {
            newValue = injectValue2Strings(this.startIndex, this.strings, values);
        }
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    };
    PropertyPeon.prototype.commit = function () {
        if (!this._shouldUpdate)
            return;
        this
            .node[this.name] = this._pendingValue;
        this._shouldUpdate = false;
    };
    return PropertyPeon;
}(AttributePeon));
function createPeon(type, option) {
    switch (type) {
        case PeonType.Attribute:
            return new AttributePeon(option);
        case PeonType.Content:
            return new ContentPeon(option);
        case PeonType.Event:
            return new EventPeon(option);
        case PeonType.Property:
            return new PropertyPeon(option);
        case PeonType.BooleanAttribute:
            return new BooleanAttributePeon(option);
    }
}
exports.createPeon = createPeon;
