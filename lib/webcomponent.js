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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = require("./render");
var defaultConverter = {
    toAttribute: function (value, type) {
        switch (type) {
            case Boolean:
                return value
                    ? ''
                    : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through to allow removing/no
                // change behavior.
                return value == null
                    ? value
                    : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute: function (value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null
                    ? null
                    : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
exports.notEqual = function (value, old) {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
var defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: exports.notEqual
};
// const descriptorFromPrototype = (name: PropertyKey, proto: WebComponent) => {
//     if (name in proto) {
//       while (proto !== Object.prototype) {
//         if (proto.hasOwnProperty(name)) {
//           return Object.getOwnPropertyDescriptor(proto, name);
//         }
//         proto = Object.getPrototypeOf(proto);
//       }
//     }
//     return undefined;
// };
var WebComponent = /** @class */ (function (_super) {
    __extends(WebComponent, _super);
    function WebComponent() {
        var _this = _super.call(this) || this;
        _this._reflectingProperties = undefined;
        _this._instanceProperties = undefined;
        _this._changedProperties = new Map();
        _this._updatePromise = Promise.resolve(true);
        _this.initialize();
        return _this;
    }
    WebComponent._propertyValueFromAttribute = function (value, options) {
        var type = options.type;
        var converter = options.converter || defaultConverter;
        var fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    };
    WebComponent._attributeNameForProperty = function (name, options) {
        var attribute = options.attribute;
        return attribute === false ? undefined
            : (typeof attribute === 'string' ? attribute
                : (typeof name === 'string' ? name.toLowerCase()
                    : undefined));
    };
    WebComponent._propertyValueToAttribute = function (value, options) {
        if (options.reflect === undefined) {
            return;
        }
        var type = options.type;
        var converter = options.converter;
        var toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
        return toAttribute(value, type);
    };
    Object.defineProperty(WebComponent, "observedAttributes", {
        get: function () {
            // note: piggy backing on this to ensure we're _finalized.
            this._finalize();
            var attributes = [];
            if (this._classProperties) {
                //@ts-ignore
                for (var _i = 0, _a = this._classProperties; _i < _a.length; _i++) {
                    var _b = _a[_i], p = _b[0], v = _b[1];
                    var attr = this._attributeNameForProperty(p, v);
                    if (attr !== undefined) {
                        this._attributeToPropertyMap.set(attr, p);
                        attributes.push(attr);
                    }
                }
            }
            return attributes;
        },
        enumerable: true,
        configurable: true
    });
    WebComponent._finalize = function () {
        if (this.hasOwnProperty('_finalized') && this._finalized) {
            return;
        }
        var superCtor = Object.getPrototypeOf(this);
        if (typeof superCtor._finalize === 'function') {
            superCtor._finalize();
        }
        this._finalized = true;
        this._attributeToPropertyMap = new Map();
        if (this.hasOwnProperty('properties')) {
            var props = this.properties;
            // support symbols in properties (IE11 does not support this)
            var propKeys = Object.getOwnPropertyNames(props).concat((typeof Object.getOwnPropertySymbols === 'function')
                ? Object.getOwnPropertySymbols(props)
                : []);
            for (var _i = 0, propKeys_1 = propKeys; _i < propKeys_1.length; _i++) {
                var p = propKeys_1[_i];
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                this.createProperty(p, props[p]);
            }
        }
    };
    WebComponent.createProperty = function (name, options) {
        var _this = this;
        if (options === void 0) { options = defaultPropertyDeclaration; }
        if (!this.hasOwnProperty('_classProperties')) {
            this._classProperties = new Map();
            var superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach(function (v, k) { return _this._classProperties.set(k, v); });
            }
        }
        this._classProperties.set(name, options);
        if (!options.noAccessor) {
            var key_1 = typeof name === 'symbol' ? Symbol() : "__" + name;
            Object.defineProperty(this.prototype, name, {
                get: function () {
                    return this[key_1];
                },
                set: function (value) {
                    var oldValue = this[name];
                    this[key_1] = value;
                    this.requestUpdate(name, oldValue);
                },
                configurable: true,
                enumerable: true
            });
        }
    };
    WebComponent.prototype.initialize = function () {
        this.attachShadow({ mode: 'open' });
        // this._saveInstanceProperties();
        this.requestUpdate();
    };
    // private _saveInstanceProperties() {
    //     for (const [p] of (this.constructor as typeof WebComponent)._classProperties) {
    //         if (this.hasOwnProperty(p)) {
    //             const value = this[p as keyof this];
    //             delete this[p as keyof this];
    //             if (!this._instanceProperties) {
    //                 this._instanceProperties = new Map();
    //             }
    //             this._instanceProperties.set(p, value);
    //         }
    //     }
    // }
    WebComponent.prototype.requestUpdate = function (name, oldValue) {
        var shouldRequestUpdate = true;
        // if we have a property key, perform property update steps.
        if (name !== undefined && !this._changedProperties.has(name)) {
            var ctor = this.constructor;
            var options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
            if ((options.hasChanged || exports.notEqual)(this[name], oldValue)) {
                // track old value when changing.
                this._changedProperties.set(name, oldValue);
                // add to reflecting properties set
                if (options.reflect === true) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
                // abort the request if the property should not be considered changed.
            }
            else {
                shouldRequestUpdate = false;
            }
        }
        if (shouldRequestUpdate) {
            this._enqueueUpdate();
        }
        // return this.updateComplete;
    };
    WebComponent.prototype.shouldUpdate = function (_changedProperties) {
        return true;
    };
    WebComponent.prototype.performUpdate = function () {
        if (this._instanceProperties) {
            //@ts-ignore
            for (var _i = 0, _a = this._instanceProperties; _i < _a.length; _i++) {
                var _b = _a[_i], p = _b[0], v = _b[1];
                this[p] = v;
            }
            this._instanceProperties = undefined;
        }
        if (this.shouldUpdate(this._changedProperties)) {
            var changedProperties = this._changedProperties;
            this.update(changedProperties);
            this._markUpdated();
            //   if (!(this._updateState & STATE_HAS_UPDATED)) {
            //     this._updateState = this._updateState | STATE_HAS_UPDATED;
            //     this.firstUpdated(changedProperties);
            //   }
            //   this.firstUpdated(changedProperties);
            this.updated(changedProperties);
        }
        else {
            this._markUpdated();
        }
    };
    WebComponent.prototype._markUpdated = function () {
        this._changedProperties = new Map();
    };
    WebComponent.prototype._enqueueUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resolve, previousUpdatePromise, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousUpdatePromise = this._updatePromise;
                        this._updatePromise = new Promise(function (res) { return resolve = res; });
                        return [4 /*yield*/, previousUpdatePromise];
                    case 1:
                        _a.sent();
                        result = this.performUpdate();
                        if (!(result != null &&
                            typeof result.then === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, result];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        resolve(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    WebComponent.prototype.update = function (changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            //@ts-ignore
            for (var _i = 0, _a = this._reflectingProperties; _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                this._propertyToAttribute(k, this[k], v);
            }
            this._reflectingProperties = undefined;
        }
        render_1.shadowRender(this.render(), this.shadowRoot, { eventContext: this });
    };
    // connectedCallback(){ }
    WebComponent.prototype._propertyToAttribute = function (name, value, options) {
        if (options === void 0) { options = defaultPropertyDeclaration; }
        var ctor = this.constructor;
        var attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            var attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
        }
    };
    WebComponent.prototype._attributeToProperty = function (name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        // if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        //   return;
        // }
        var ctor = this.constructor;
        if (ctor._attributeToPropertyMap == null)
            return;
        var propName = ctor._attributeToPropertyMap.get(name);
        if (propName === undefined)
            return;
        var options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
        // mark state reflecting
        // this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName] =
            ctor._propertyValueFromAttribute(value, options);
        // mark state not reflecting
        // this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    };
    WebComponent.prototype.attributeChangedCallback = function (name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    };
    WebComponent.prototype.updated = function (_changedProperties) { };
    WebComponent.prototype.firstUpdated = function (_changedProperties) { };
    WebComponent._finalized = true;
    WebComponent.properties = {};
    return WebComponent;
}(HTMLElement));
exports.WebComponent = WebComponent;
function defineWebComponent(name, componentClz) {
    customElements.define(name, componentClz);
}
exports.defineWebComponent = defineWebComponent;
exports.property = function (options) { return function (proto, name) {
    proto.constructor.createProperty(name, options);
}; };
