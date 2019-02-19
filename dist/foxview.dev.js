(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.FoxView = {}));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var template = createCommonjsModule(function (module, exports) {
	// import {TemplateResult} from './template-result';
	Object.defineProperty(exports, "__esModule", { value: true });
	// type TemplatePart = {
	//   type: 'node',
	//   index: number
	// }|{type: 'attribute', index: number, name: string, strings: string[]};
	// export class Template{
	//   parts: TemplatePart[] = [];
	//   element: HTMLTemplateElement;
	//   constructor(result: TemplateResult, element: HTMLTemplateElement) {
	//     this.element = element;
	//   }
	//   _prepareTemplate(){
	//     const content = this.element.content;
	//     const walker = document.createTreeWalker(
	//       content,
	//       133,
	//       null,
	//       false
	//     )
	//   }
	// }
	exports.createMarker = function () { return document.createComment(''); };
	exports.marker = "{{tiny-" + String(Math.random()).slice(2) + "}}";
	exports.nodeMarker = "<!--" + exports.marker + "-->";
	exports.markerRegex = new RegExp(exports.marker + "|" + exports.nodeMarker);
	/**
	 * Suffix appended to all bound attribute names.
	 */
	exports.boundAttributeSuffix = '$tiny$';
	var matchCache = new Map();
	function matchLastAttributeName(value) {
	    var cached = matchCache.get(value);
	    if (cached)
	        return cached;
	    var result = lastAttributeNameRegex.exec(value);
	    if (result) {
	        matchCache.set(value, result);
	    }
	    return result;
	}
	exports.matchLastAttributeName = matchLastAttributeName;
	var lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
	});

	unwrapExports(template);
	var template_1 = template.createMarker;
	var template_2 = template.marker;
	var template_3 = template.nodeMarker;
	var template_4 = template.markerRegex;
	var template_5 = template.boundAttributeSuffix;
	var template_6 = template.matchLastAttributeName;

	var dom = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isCEPolyfill = window.customElements !== undefined &&
	    window.customElements.polyfillWrapFlushCallback !== undefined;
	function clone(template) {
	    return exports.isCEPolyfill ?
	        template.content.cloneNode(true) :
	        document.importNode(template.content, true);
	}
	exports.clone = clone;
	exports.reparentNodes = function (container, start, end, before) {
	    if (end === void 0) { end = null; }
	    if (before === void 0) { before = null; }
	    var node = start;
	    while (node !== end) {
	        var n = node.nextSibling;
	        container.insertBefore(node, before);
	        node = n;
	    }
	};
	/**
	 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
	 * (exclusive), from `container`.
	 */
	function removeNode(node) {
	    var parentNode = node.parentNode;
	    if (parentNode) {
	        parentNode.removeChild(node);
	    }
	}
	exports.removeNode = removeNode;
	exports.removeAllNodes = function (container, startNode, endNode) {
	    if (endNode === void 0) { endNode = null; }
	    var node = startNode;
	    while (node !== endNode) {
	        var n = node.nextSibling;
	        container.removeChild(node);
	        node = n;
	    }
	    endNode && container.removeChild(endNode);
	};
	exports.removeNodes = function (container, startNode, endNode) {
	    if (endNode === void 0) { endNode = null; }
	    var node = startNode;
	    while (node !== endNode) {
	        var n = node.nextSibling;
	        container.removeChild(node);
	        node = n;
	    }
	};
	function removeAttributes(node, toRemoveAttributes) {
	    for (var i = 0; i < toRemoveAttributes.length; i++) {
	        node.removeAttribute(toRemoveAttributes[i]);
	    }
	}
	exports.removeAttributes = removeAttributes;
	});

	unwrapExports(dom);
	var dom_1 = dom.isCEPolyfill;
	var dom_2 = dom.clone;
	var dom_3 = dom.reparentNodes;
	var dom_4 = dom.removeNode;
	var dom_5 = dom.removeAllNodes;
	var dom_6 = dom.removeNodes;
	var dom_7 = dom.removeAttributes;

	var templateResult = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
	            var match = template.matchLastAttributeName(s);
	            if (match) {
	                // We're starting a new bound attribute.
	                // Add the safe attribute suffix, and use unquoted-attribute-safe
	                // marker.
	                html += s.substr(0, match.index) + match[1] + match[2] + template.boundAttributeSuffix + match[3] + template.marker;
	            }
	            else {
	                // We're either in a bound node, or trailing bound attribute.
	                // Either way, nodeMarker is safe to use.
	                html += s + template.nodeMarker;
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
	        var template$$1 = document.createElement('template');
	        template$$1.innerHTML = this.getHTML();
	        return template$$1;
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
	        var template$$1 = _super.prototype.getTemplateElement.call(this);
	        var content = template$$1.content;
	        var svgElement = content.firstChild;
	        content.removeChild(svgElement);
	        dom.reparentNodes(content, svgElement.firstChild);
	        return template$$1;
	    };
	    return SVGTemplateResult;
	}(TemplateResult));
	exports.SVGTemplateResult = SVGTemplateResult;
	});

	unwrapExports(templateResult);
	var templateResult_1 = templateResult.TemplateResult;
	var templateResult_2 = templateResult.SVGTemplateResult;

	var templateInstance = createCommonjsModule(function (module, exports) {
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
	});

	unwrapExports(templateInstance);
	var templateInstance_1 = templateInstance.TemplateInstance;

	var part = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });




	// import {isPrimitive} from './util/is'
	var ComponentPart = /** @class */ (function () {
	    // _markCleared:boolean = false;
	    function ComponentPart(componentClass, propsSchemas, slots, options) {
	        this._pendingValue = undefined;
	        this._valueIndex = undefined;
	        this._componentClass = componentClass;
	        this._propsSchemas = propsSchemas;
	        this._slots = slots;
	        this.options = options;
	    }
	    ComponentPart.prototype.insertBeforeNode = function (container) {
	        var parentNode = container.parentNode;
	        this.fragment = document.createDocumentFragment();
	        // this.startNode = parentNode.insertBefore(createMarker(),container);
	        this.endNode = parentNode.insertBefore(template.createMarker(), container);
	    };
	    ComponentPart.prototype.setValue = function (values) {
	        var newProps = this._propsSchemas.reduce(function (ret, item) {
	            ret[item.name] = item.index != null ? values[item.index] : item.value;
	            return ret;
	        }, {});
	        Object.freeze(newProps);
	        var instance = this._componentInstance;
	        if (!instance) {
	            instance = new this._componentClass(newProps);
	            // instance._parentPart = this;
	            instance._mount = this._insert.bind(this);
	            instance.props = newProps;
	            instance._pendProps = newProps;
	            instance.fragment = this.fragment;
	            instance.renderOption = this.options;
	            instance._slots = this._slots;
	            this._componentInstance = instance;
	            // this._updateFlag = true;
	        }
	        else {
	            // instance.componentWillReceiveProps(newProps)
	            // this._updateFlag = instance.shouldComponentUpdate(newProps,instance.state);
	            instance._pendProps = newProps;
	        }
	    };
	    ComponentPart.prototype._insert = function (node) {
	        this.endNode.parentNode.insertBefore(node, this.endNode);
	    };
	    ComponentPart.prototype.destroy = function () {
	        var instance = this._componentInstance;
	        instance.componentWillUnmount();
	        instance._mount = null;
	        if (instance.part) {
	            instance.part.destroy();
	        }
	        this._slots = null;
	        this.endNode = null;
	        this.fragment = null;
	    };
	    ComponentPart.prototype.commit = function () {
	        // const instance = this._componentInstance;
	        // console.log('_componentInstance :',this._componentInstance);
	        this._componentInstance.setState();
	        // if(!instance._mountFlag){
	        //   instance._commit()
	        // }else{
	        //   instance.setState(null,()=>{
	        //     this._componentInstance.componentDidUpdate();
	        //   })
	        // }
	    };
	    return ComponentPart;
	}());
	exports.ComponentPart = ComponentPart;
	var NodePartValueType;
	(function (NodePartValueType) {
	    NodePartValueType[NodePartValueType["TemplateResult"] = 0] = "TemplateResult";
	    NodePartValueType[NodePartValueType["ArrayResult"] = 1] = "ArrayResult";
	    NodePartValueType[NodePartValueType["NodeValue"] = 2] = "NodeValue";
	    NodePartValueType[NodePartValueType["Node"] = 3] = "Node";
	    NodePartValueType[NodePartValueType["None"] = 4] = "None";
	})(NodePartValueType || (NodePartValueType = {}));
	var NodePart = /** @class */ (function () {
	    function NodePart(options) {
	        var _a;
	        this._valueType = NodePartValueType.None;
	        this._pendingValue = undefined;
	        this._valueIndex = undefined;
	        this._valueHandleMap = (_a = {},
	            _a[NodePartValueType.TemplateResult] = this._setTemplateResultValue.bind(this),
	            _a[NodePartValueType.ArrayResult] = this._setIterableValue.bind(this),
	            _a);
	        this.options = options;
	    }
	    NodePart.prototype.appendInto = function (container) {
	        this.startNode = container.appendChild(template.createMarker());
	        this.endNode = container.appendChild(template.createMarker());
	    };
	    // insertAfterNode(ref: Node) {
	    //   this.startNode = ref;
	    //   this.endNode = ref.nextSibling!;
	    // }
	    NodePart.prototype.attachNode = function (ref) {
	        this.startNode = template.createMarker();
	        this.endNode = template.createMarker();
	        var parentNode = ref.parentNode;
	        parentNode.insertBefore(this.endNode, ref);
	        parentNode.insertBefore(this.startNode, this.endNode);
	    };
	    NodePart.prototype.setValueIndex = function (valueIndex) {
	        this._valueIndex = valueIndex;
	    };
	    /**
	     * Appends this part into a parent part.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    NodePart.prototype.appendIntoPart = function (part) {
	        part._insert(this.startNode = template.createMarker());
	        part._insert(this.endNode = template.createMarker());
	    };
	    /**
	     * Appends this part after `ref`
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    NodePart.prototype.insertAfterPart = function (ref) {
	        var tmpMarker = template.createMarker();
	        ref._insert(tmpMarker);
	        this.endNode = ref.endNode;
	        ref.endNode = tmpMarker;
	        this._insert(this.startNode = template.createMarker());
	    };
	    NodePart.prototype.setValue = function (value) {
	        var newValue;
	        if (this._valueIndex != null) {
	            newValue = value[this._valueIndex];
	        }
	        else {
	            newValue = value;
	        }
	        var newValueType;
	        if (newValue instanceof templateResult.TemplateResult) {
	            newValueType = NodePartValueType.TemplateResult;
	        }
	        else if (Array.isArray(newValue)) {
	            newValueType = NodePartValueType.ArrayResult;
	        }
	        else if (newValue instanceof Node) {
	            newValueType = NodePartValueType.Node;
	        }
	        else {
	            newValueType = NodePartValueType.NodeValue;
	        }
	        if (this._valueType !== NodePartValueType.None && this._valueType !== newValueType) {
	            this._clear(); //当值类型发生了变化，清楚上一次的渲染结果
	        }
	        this._valueType = newValueType;
	        var handle = this._valueHandleMap[this._valueType];
	        if (handle) {
	            handle(newValue);
	        }
	        this._pendingValue = newValue;
	    };
	    NodePart.prototype.destroy = function () {
	        switch (this._valueType) {
	            case NodePartValueType.TemplateResult:
	                this.value._destroy();
	                break;
	            case NodePartValueType.ArrayResult:
	                this.value.forEach(function (np) {
	                    np.destroy();
	                });
	                break;
	        }
	        this.value = null;
	        dom.removeAllNodes(this.startNode.parentNode, this.startNode, this.endNode);
	        this.startNode = null;
	        this.endNode = null;
	        // this._node = null;
	    };
	    NodePart.prototype._clearDOM = function (startNode) {
	        if (startNode === void 0) { startNode = this.startNode; }
	        dom.removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
	    };
	    NodePart.prototype._clear = function () {
	        switch (this._valueType) {
	            case NodePartValueType.TemplateResult:
	                this.value._destroy();
	                break;
	            case NodePartValueType.ArrayResult:
	                this.value.forEach(function (np) {
	                    np.destroy();
	                });
	                break;
	        }
	        this.value = null; //清除原有的value
	        this._clearDOM(this.startNode);
	    };
	    NodePart.prototype._insert = function (node) {
	        this.endNode.parentNode.insertBefore(node, this.endNode);
	        // this._node = node;
	    };
	    // private _clearAllMarker(){
	    //   if(this.startNode && this.startNode.parentNode){
	    //     this.startNode.parentNode.removeChild(this.startNode)
	    //   }
	    //   if(this.endNode && this.endNode.parentNode){
	    //     this.endNode.parentNode.removeChild(this.endNode)
	    //   }
	    //   this.startNode = null;
	    //   this.endNode = null;
	    //   this._markCleared = true;
	    // }
	    NodePart.prototype._setTemplateResultValue = function (value) {
	        if (this.value && this.value.isSameTemplate(value)) {
	            this.value.setValue(value);
	        }
	        else {
	            if (this.value) {
	                this.value._destroy();
	            }
	            this._clearDOM();
	            var instance = new templateInstance.TemplateInstance(this.options);
	            instance.setValue(value);
	            this._insert(instance.fragment);
	            this.value = instance;
	        }
	    };
	    NodePart.prototype._commitTemplateResult = function () {
	        var instance = this.value;
	        instance.commit();
	    };
	    NodePart.prototype._setIterableValue = function (value) {
	        var itemParts = this.value || [];
	        var partIndex = 0;
	        var itemPart;
	        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
	            var item = value_1[_i];
	            // Try to reuse an existing part
	            itemPart = itemParts[partIndex];
	            // If no existing part, create a new one
	            if (itemPart === undefined) {
	                itemPart = new NodePart(this.options);
	                itemParts[partIndex] = itemPart;
	                if (partIndex === 0) {
	                    itemPart.appendIntoPart(this);
	                }
	                else {
	                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
	                }
	            }
	            // if(itemPart.startNode.parentNode == null){
	            //   console.log(itemPart.startNode.parentNode,flag);
	            // }
	            itemPart.setValue(item);
	            partIndex++;
	        }
	        this.value = itemParts;
	        var prevLen = itemParts.length;
	        if (partIndex < prevLen) {
	            itemPart = itemParts[partIndex];
	            // Truncate the parts array so _value reflects the current state
	            for (var i = partIndex; i < prevLen; i++) {
	                var removeItemPart = itemParts[i];
	                removeItemPart && removeItemPart.destroy();
	            }
	            itemParts.length = partIndex;
	            // this._clearDOM(itemPart && itemPart!.endNode);
	        }
	    };
	    NodePart.prototype._commitIterable = function () {
	        // Lets us keep track of how many items we stamped so we can clear leftover
	        // items from a previous render
	        var itemParts = this.value || [];
	        // let itemPart: NodePart|undefined;
	        for (var _i = 0, itemParts_1 = itemParts; _i < itemParts_1.length; _i++) {
	            var itemPart = itemParts_1[_i];
	            itemPart.commit();
	        }
	    };
	    NodePart.prototype._commitNode = function (value) {
	        if (this.value === value) {
	            return;
	        }
	        this._clearDOM();
	        this._insert(value);
	        this.value = value;
	    };
	    NodePart.prototype._commitText = function (value) {
	        value = value == null ? '' : value;
	        if (this.value) {
	            if (this._textValue === value)
	                return;
	            this.value.nodeValue = value;
	            this._textValue = value;
	        }
	        else {
	            this.value = document.createTextNode(typeof value === 'string' ? value : String(value));
	            this._insert(this.value);
	            this._textValue = value;
	        }
	        // const node = this.startNode.nextSibling!;
	        // value = value == null ? '' : value;
	        // if (node === this.endNode.previousSibling &&
	        //     node.nodeType === 3 /* Node.TEXT_NODE */) {
	        //   // If we only have a single text node between the markers, we can just
	        //   // set its value, rather than replacing it.
	        //   // TODO(justinfagnani): Can we just check if this.value is primitive?
	        //   node.textContent = value;
	        // } else {
	        //   this._commitNode(document.createTextNode(
	        //       typeof value === 'string' ? value : String(value)));
	        // }
	        // this.value = value;
	    };
	    // private _commitText(value: string): void {
	    //   const node = this.startNode.nextSibling!;
	    //   value = value == null ? '' : value;
	    //   if (node === this.endNode.previousSibling &&
	    //       node.nodeType === 3 /* Node.TEXT_NODE */) {
	    //     // If we only have a single text node between the markers, we can just
	    //     // set its value, rather than replacing it.
	    //     // TODO(justinfagnani): Can we just check if this.value is primitive?
	    //     node.textContent = value;
	    //   } else {
	    //     this._commitNode(document.createTextNode(
	    //         typeof value === 'string' ? value : String(value)));
	    //   }
	    //   this.value = value;
	    // }
	    NodePart.prototype.commit = function () {
	        var value = this._pendingValue;
	        switch (this._valueType) {
	            case NodePartValueType.TemplateResult:
	                return this._commitTemplateResult();
	            case NodePartValueType.ArrayResult:
	                return this._commitIterable();
	            case NodePartValueType.NodeValue:
	                return this._commitText(value);
	            case NodePartValueType.Node:
	                return this._commitNode(value);
	        }
	    };
	    return NodePart;
	}());
	exports.NodePart = NodePart;
	});

	unwrapExports(part);
	var part_1 = part.ComponentPart;
	var part_2 = part.NodePart;

	var map = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var MapPolyfill = /** @class */ (function () {
	    function MapPolyfill() {
	        this._cache = {};
	    }
	    MapPolyfill.prototype._each = function (iterator) {
	        var cache = this._cache;
	        Object.keys(cache).forEach(function (name) {
	            iterator(name, cache[name]);
	        });
	    };
	    MapPolyfill.prototype.clear = function () {
	        this._cache = {};
	    };
	    MapPolyfill.prototype.has = function (name) {
	        return this._cache.hasOwnProperty(name);
	    };
	    MapPolyfill.prototype.get = function (name) {
	        return this._cache[name];
	    };
	    MapPolyfill.prototype.set = function (name, value) {
	        this._cache[name] = value;
	    };
	    Object.defineProperty(MapPolyfill.prototype, "size", {
	        get: function () {
	            return Object.keys(this._cache).length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return MapPolyfill;
	}());
	exports.default = MapPolyfill;
	});

	unwrapExports(map);

	var updater = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var callbackList = [];
	var setStateMap = new map.default();
	var Updater = {
	    isInBatchUpdating: false,
	    isInClosingUpdating: false,
	    performUpdate: function (item) {
	        var instance = item.instance;
	        var newState = Object.assign({}, instance.state || {}, item.partialState);
	        //@ts-ignore
	        var getDerivedStateFromProps = (instance.constructor).getDerivedStateFromProps;
	        if (getDerivedStateFromProps) {
	            var result = getDerivedStateFromProps.call(instance.constructor, instance._pendProps, newState);
	            if (result) {
	                newState = Object.assign({}, newState, result);
	            }
	        }
	        if (!instance._mountFlag) {
	            // instance.componentWillMount();
	            /**
	             * 如果在componentWillUnmount调用了setState,此处会更新state,但不会触发二次渲染  (注:已取消componentWillMount)
	             * 即便在componentWillMount中setState,此处item.partialState拿到也是最新的partialState
	             * **/
	            instance.state = newState;
	            instance._firstCommit();
	            return;
	        }
	        if (instance.shouldComponentUpdate(instance._pendProps, newState)) {
	            var prevProps = instance.props;
	            var prevState = instance.state;
	            instance.props = instance._pendProps;
	            instance.state = newState;
	            var snapShot = void 0;
	            if (instance.getSnapshotBeforeUpdate) {
	                snapShot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
	            }
	            instance._commit(prevProps, prevState, snapShot);
	        }
	        else {
	            instance.props = instance._pendProps;
	            instance.state = newState;
	        }
	    },
	    enqueueSetState: function (instance, partialState, callback, isForce) {
	        if (Updater.isInBatchUpdating && !isForce) {
	            var item = setStateMap.get(instance.id);
	            if (item) {
	                /**
	                 * flushed表示已经更新过了 直接忽略
	                 * 默认带partialState的都已记录到了setStateMap
	                 * 此次是为了过滤掉closeBatchUpdating instant._commit导致的无状态变更的二次更新
	                 * **/
	                if (item.flushed)
	                    return;
	                item.partialState = Object.assign({}, item.partialState, partialState);
	                callback && callbackList.push(callback);
	            }
	            else {
	                var newItem = {
	                    partialState: partialState,
	                    instance: instance,
	                    flushed: false
	                };
	                if (Updater.isInClosingUpdating) {
	                    Updater.performUpdate(newItem);
	                    callback && callback();
	                    return;
	                }
	                setStateMap.set(instance.id, newItem);
	                callback && callbackList.push(callback);
	            }
	            return;
	        }
	        Updater.performUpdate({
	            instance: instance,
	            partialState: partialState
	        });
	        callback && callback();
	    },
	    closeBatchUpdating: function () {
	        Updater.isInClosingUpdating = true;
	        setStateMap._each(function (id, item) {
	            // const {instance,partialState} = item;
	            Updater.performUpdate(item);
	            item.flushed = true;
	        });
	        // Object.keys(setStateMap).forEach()
	        // for(let [instance,item] of setStateMap){
	        //     instance.state = Object.assign({},item.partialState,item.partialState);
	        //     instance._commit()
	        //     item.flushed = true;
	        // }
	        setStateMap.clear();
	        Updater.isInClosingUpdating = false;
	        Updater.isInBatchUpdating = false;
	        var callbackLen = callbackList.length;
	        for (var i = 0; i < callbackLen; i++) {
	            callbackList[i]();
	        }
	        callbackList.splice(0, callbackLen);
	    }
	};
	exports.default = Updater;
	});

	unwrapExports(updater);

	var peon = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
	    AttributePeon.prototype.destroy = function () { };
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
	    ContentPeon.prototype.destroy = function () { };
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
	        this.notInWebComponent = option.notInWebComponent;
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
	    EventPeon.prototype.destroy = function () {
	        this.node && this.node.removeEventListener(this.name, this._boundHandleEvent, this._options);
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
	        if (this.notInWebComponent) {
	            updater.default.isInBatchUpdating = true;
	        }
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
	        if (this.notInWebComponent) {
	            updater.default.closeBatchUpdating();
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
	});

	unwrapExports(peon);
	var peon_1 = peon.PeonType;
	var peon_2 = peon.createPeon;

	var componentRegistry = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ComponentCenter = new Map();
	function defineComponent(name, ComponentProto) {
	    ComponentCenter.set(name, ComponentProto);
	}
	exports.defineComponent = defineComponent;
	function getCom(name) {
	    return ComponentCenter.get(name);
	}
	exports.getCom = getCom;
	});

	unwrapExports(componentRegistry);
	var componentRegistry_1 = componentRegistry.defineComponent;
	var componentRegistry_2 = componentRegistry.getCom;

	var constant = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_SLOT_NAME = '@slot@';
	});

	unwrapExports(constant);
	var constant_1 = constant.DEFAULT_SLOT_NAME;

	var templateProcessor = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });






	function _prepareSlot(node, partIndex, peons, extra) {
	    var renderOption = extra.renderOption;
	    var nodesToRemove = [node];
	    var slotName = node.getAttribute('name') || constant.DEFAULT_SLOT_NAME;
	    var slotNodes = renderOption.slots[slotName];
	    if (slotNodes && slotNodes.length > 0) {
	        var len = slotNodes.length;
	        var parentNode = node.parentNode;
	        for (var i = 0; i < len; i++) {
	            parentNode.insertBefore(slotNodes[i], node);
	        }
	    }
	    return {
	        partIndex: partIndex,
	        nodesToRemove: nodesToRemove
	    };
	}
	function _prepareNodeComment(node, partIndex, peons, extra) {
	    var renderOption = extra.renderOption;
	    var nodeValue = node.nodeValue;
	    var nodesToRemove = [];
	    if (nodeValue === template.marker) {
	        var nodePart = new part.NodePart(renderOption);
	        nodePart.setValueIndex(partIndex);
	        nodePart.attachNode(node);
	        peons.push(nodePart);
	        partIndex += 1;
	        nodesToRemove.push(node);
	    }
	    return {
	        partIndex: partIndex,
	        nodesToRemove: nodesToRemove
	    };
	}
	function _prepareNodeContent(node, partIndex, peons, extra) {
	    var renderOption = extra.renderOption;
	    var nodeValue = node.nodeValue;
	    if (nodeValue && nodeValue.indexOf(template.marker) >= 0) {
	        var strings = nodeValue.split(template.markerRegex);
	        peons.push(peon.createPeon(peon.PeonType.Content, {
	            startIndex: partIndex,
	            notInWebComponent: renderOption.notInWebComponent,
	            strings: strings,
	            node: node
	        }));
	        partIndex += strings.length - 1;
	    }
	    return {
	        partIndex: partIndex
	    };
	}
	function sliceName(val) {
	    return val.slice(1);
	}
	var AttributeMap = {
	    '@': {
	        type: peon.PeonType.Event,
	        getName: sliceName
	    },
	    '.': {
	        type: peon.PeonType.Property,
	        getName: sliceName
	    },
	    '?': {
	        type: peon.PeonType.BooleanAttribute,
	        getName: sliceName
	    }
	};
	var DefaultAttributeTarget = {
	    type: peon.PeonType.Attribute,
	    getName: function (val) {
	        return val;
	    }
	};
	function forEach_node_attribute(node, partIndex, templateResult, hasMarker, noMarker) {
	    if (node.hasAttributes()) {
	        var attributesToRemove = [];
	        var attributes = node.attributes;
	        for (var i = 0; i < attributes.length; i++) {
	            var curAttribute = attributes[i];
	            if (curAttribute.value.indexOf(template.marker) >= 0) {
	                var stringForPart = templateResult.strings[partIndex];
	                var name_1 = template.matchLastAttributeName(stringForPart)[2];
	                var attributeLookupName = name_1.toLowerCase() + template.boundAttributeSuffix;
	                var attributeValue = node.getAttribute(attributeLookupName);
	                var strings = attributeValue.split(template.markerRegex);
	                attributesToRemove.push(attributeLookupName);
	                var prefix = name_1[0];
	                var target = AttributeMap[prefix] || DefaultAttributeTarget;
	                // console.log(name,partIndex,templateResult.values);
	                hasMarker(name_1, target, partIndex, strings);
	                partIndex += strings.length - 1;
	            }
	            else {
	                noMarker && noMarker(curAttribute);
	            }
	        }
	        if (attributesToRemove.length > 0) {
	            dom.removeAttributes(node, attributesToRemove);
	        }
	    }
	    return partIndex;
	}
	function _prepareComponent(ComponentProto, node, partIndex, peons, extra) {
	    var templateResult = extra.templateResult, renderOption = extra.renderOption;
	    var propsSchemas = [];
	    partIndex = forEach_node_attribute(node, partIndex, templateResult, function (name, target, newPartIndex) {
	        propsSchemas.push({
	            name: target.getName(name),
	            index: newPartIndex
	        });
	    }, function (curAttribute) {
	        propsSchemas.push({
	            name: curAttribute.localName,
	            value: curAttribute.value,
	        });
	    });
	    var slots = {}; //todo slot处理
	    var childNodeLen = node.children.length;
	    if (childNodeLen > 0) {
	        var defaultNodeList = [];
	        var fragment = document.createDocumentFragment();
	        while (node.children.length > 0) {
	            var childNode = node.children[0];
	            var slotName = childNode.getAttribute('slot');
	            if (slotName) {
	                slots[slotName] = [childNode];
	            }
	            else {
	                defaultNodeList.push(childNode);
	            }
	            fragment.appendChild(childNode);
	        }
	        var result = walkNode(fragment, templateResult, partIndex, renderOption);
	        partIndex = result.partIndex;
	        if (result.peons.length) {
	            peons.push.apply(peons, result.peons);
	        }
	        if (defaultNodeList.length > 0) {
	            slots[constant.DEFAULT_SLOT_NAME] = defaultNodeList;
	        }
	    }
	    var component = new part.ComponentPart(ComponentProto, propsSchemas, slots, extra.renderOption);
	    component.insertBeforeNode(node);
	    peons.push(component);
	    // console.log('localName :',node.localName,component);
	    return {
	        partIndex: partIndex,
	        nodesToRemove: [node]
	    };
	}
	function _prepareNode(node, partIndex, peons, extra) {
	    var localName = node.localName;
	    var DefinedComponent = componentRegistry.getCom(localName);
	    if (DefinedComponent) {
	        return _prepareComponent(DefinedComponent, node, partIndex, peons, extra);
	    }
	    else if (extra.renderOption.slots && localName === 'slot') { //无slot无需解析slot
	        return _prepareSlot(node, partIndex, peons, extra);
	    }
	    else {
	        return _prepareNodeAttribute(node, partIndex, peons, extra);
	    }
	}
	function _prepareNodeAttribute(node, partIndex, peons, extra) {
	    var templateResult = extra.templateResult, renderOption = extra.renderOption;
	    partIndex = forEach_node_attribute(node, partIndex, templateResult, function (name, target, curPartIndex, strings) {
	        peons.push(peon.createPeon(target.type, {
	            startIndex: curPartIndex,
	            strings: strings,
	            notInWebComponent: renderOption.notInWebComponent,
	            name: target.getName(name),
	            eventContext: extra.renderOption ? extra.renderOption.eventContext : null,
	            node: node
	        }));
	    });
	    return {
	        partIndex: partIndex
	    };
	}
	var _prepareMap = {
	    1: _prepareNode,
	    3: _prepareNodeContent,
	    8: _prepareNodeComment /* Node.COMMENT_NODE */
	};
	function walkNode(fragment, templateResult, partIndex, option) {
	    var peons = [];
	    var walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
	    // let partIndex = 0;
	    var nodesToRemove = [];
	    while (walker.nextNode()) {
	        var node = walker.currentNode;
	        var handle = _prepareMap[node.nodeType];
	        if (handle) {
	            var result = handle(node, partIndex, peons, {
	                templateResult: templateResult,
	                renderOption: option
	            });
	            partIndex = result.partIndex;
	            if (result.nodesToRemove) {
	                nodesToRemove = nodesToRemove.concat(result.nodesToRemove);
	            }
	        }
	    }
	    for (var _i = 0, nodesToRemove_1 = nodesToRemove; _i < nodesToRemove_1.length; _i++) {
	        var n = nodesToRemove_1[_i];
	        n.parentNode.removeChild(n);
	    }
	    return {
	        fragment: fragment,
	        partIndex: partIndex,
	        peons: peons
	    };
	}
	exports.walkNode = walkNode;
	var templateCaches = new Map();
	// export type TemplateFactory = (result: ITemplateResult) => HTMLTemplateElement;
	function templateFactory(result) {
	    var templateCache = templateCaches.get(result.type);
	    if (templateCache === undefined) {
	        templateCache = {
	            stringsArray: new WeakMap(),
	            keyString: new Map()
	        };
	        templateCaches.set(result.type, templateCache);
	    }
	    var template$$1 = templateCache.stringsArray.get(result.strings);
	    if (template$$1 !== undefined) {
	        return template$$1;
	    }
	    // If the TemplateStringsArray is new, generate a key from the strings
	    // This key is shared between all templates with identical content
	    var key = result.strings.join(template.marker);
	    // Check if we already have a Template for this key
	    template$$1 = templateCache.keyString.get(key);
	    if (template$$1 === undefined) {
	        // If we have not seen this key before, create a new Template
	        template$$1 = result.getTemplateElement();
	        // Cache the Template for this key
	        templateCache.keyString.set(key, template$$1);
	    }
	    // Cache all future queries for this TemplateStringsArray
	    templateCache.stringsArray.set(result.strings, template$$1);
	    return template$$1;
	}
	function default_1(templateResult, option) {
	    var fragment = option.templateClone(templateFactory(templateResult)); //缓存优化
	    return walkNode(fragment, templateResult, 0, option);
	}
	exports.default = default_1;
	});

	unwrapExports(templateProcessor);
	var templateProcessor_1 = templateProcessor.walkNode;

	var render_1 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	var parts = new WeakMap();
	function shadowRender(result, container, options) {
	    var part$$1 = parts.get(container);
	    if (part$$1 === undefined) {
	        dom.removeNodes(container, container.firstChild);
	        parts.set(container, part$$1 = new part.NodePart(__assign({ templateProcessor: templateProcessor.default, templateClone: dom.clone }, options)));
	        part$$1.appendInto(container);
	    }
	    part$$1.setValue(result);
	    part$$1.commit();
	    return part$$1;
	}
	exports.shadowRender = shadowRender;
	function render(result, container, options) {
	    return shadowRender(result, container, __assign({}, options, { notInWebComponent: true }));
	}
	exports.render = render;
	});

	unwrapExports(render_1);
	var render_2 = render_1.shadowRender;
	var render_3 = render_1.render;

	var webcomponent = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
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
	// const descriptorFromPrototype = (name: string, proto: WebComponent) => {
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
	var STATE_IN_UPDATING = 1;
	var MOUNTED = 1 << 2;
	var STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
	var STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
	var WebComponent = /** @class */ (function (_super) {
	    __extends(WebComponent, _super);
	    function WebComponent() {
	        var _this = _super.call(this) || this;
	        _this._reflectingProperties = undefined;
	        // private _instanceProperties : PropertyValues | undefined = undefined; //存储实例属性值 待完善
	        // private _changedProperties: PropertyValues = new WMap();
	        _this._pendProps = {};
	        _this._updatePromise = Promise.resolve(true);
	        _this._stateFlags = 0;
	        _this.__props = {};
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
	            var _this = this;
	            // note: piggy backing on this to ensure we're _finalized.
	            this._finalize();
	            var attributes = [];
	            if (this._classProperties) {
	                this._classProperties._each(function (p, v) {
	                    var attr = _this._attributeNameForProperty(p, v);
	                    if (attr !== undefined) {
	                        _this._attributeToPropertyMap.set(attr, p);
	                        attributes.push(attr);
	                    }
	                });
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
	        this._attributeToPropertyMap = new map.default();
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
	    Object.defineProperty(WebComponent.prototype, "props", {
	        get: function () {
	            return this.__props;
	        },
	        set: function (val) { },
	        enumerable: true,
	        configurable: true
	    });
	    WebComponent.createProperty = function (name, options) {
	        var _this = this;
	        if (options === void 0) { options = defaultPropertyDeclaration; }
	        if (!this.hasOwnProperty('_classProperties')) {
	            this._classProperties = new map.default();
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
	                    // this._pendProps[name] = value;
	                    var oldValue = this[key_1];
	                    this[key_1] = value;
	                    this.requestUpdate(name, oldValue);
	                },
	                configurable: true,
	                enumerable: true
	            });
	        }
	    };
	    WebComponent.prototype._markFlag = function (flag) {
	        this._stateFlags = this._stateFlags | flag;
	    };
	    WebComponent.prototype._clearFlag = function (flag) {
	        this._stateFlags = this._stateFlags & ~flag;
	    };
	    WebComponent.prototype._hasFlag = function (flag) {
	        return this._stateFlags & flag;
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
	    WebComponent.prototype.requestUpdate = function (name, oldValue, callback) {
	        var shouldRequestUpdate = true;
	        // if we have a property key, perform property update steps.
	        // if (name !== undefined && !this._changedProperties.has(name)) {
	        if (name !== undefined && !this._pendProps.hasOwnProperty(name)) {
	            var ctor = this.constructor;
	            var options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
	            if ((options.hasChanged || exports.notEqual)(this[name], oldValue)) {
	                // track old value when changing.
	                this._pendProps[name] = this[name];
	                // this._changedProperties.set(name, oldValue);
	                // add to reflecting properties set
	                if (options.reflect === true && !this._hasFlag(STATE_IS_REFLECTING_TO_PROPERTY)) {
	                    if (this._reflectingProperties === undefined) {
	                        this._reflectingProperties = new map.default();
	                    }
	                    this._reflectingProperties.set(name, options);
	                }
	                // abort the request if the property should not be considered changed.
	            }
	            else {
	                shouldRequestUpdate = false;
	            }
	        }
	        if (!this._hasFlag(STATE_IN_UPDATING) && shouldRequestUpdate) { //防止多次重复更新
	            this._enqueueUpdate(callback);
	        }
	        else {
	            callback && callback();
	        }
	        // return this.updateComplete;
	    };
	    WebComponent.prototype.__updateThisProps = function () {
	        this.__props = Object.assign({}, this.props, this._pendProps);
	        // console.log('__props :',this._pendProps);
	        Object.freeze(this.__props);
	    };
	    WebComponent.prototype.performUpdate = function () {
	        // if (this._instanceProperties) {
	        //     //@ts-ignore
	        //     for (const [p, v] of this._instanceProperties!) {
	        //         (this as any)[p] = v;
	        //       }
	        //       this._instanceProperties = undefined;
	        // }
	        // const changedProperties = this._changedProperties;
	        var newState = Object.assign({}, this.state || {}, this._alternalState || {});
	        //@ts-ignore
	        var getDerivedStateFromProps = (this.constructor).getDerivedStateFromProps;
	        if (getDerivedStateFromProps) {
	            var result = getDerivedStateFromProps.call(this.constructor, this._pendProps, newState);
	            if (result) {
	                newState = Object.assign({}, newState, result);
	            }
	        }
	        //getDerivedStateFromProps
	        if (!this._hasFlag(MOUNTED)) {
	            this.__updateThisProps();
	            // if(this._hasFlag(INNER_STATE_CHANGED)){
	            //   this.state = Object.assign({},this.state || {},this._alternalState)
	            // }
	            this.state = newState;
	            this.componentWillMount();
	            this.update();
	            // this._mountFlag = true;
	            this._markFlag(MOUNTED);
	            this.componentDidMount();
	        }
	        else {
	            // if(this._hasFlag(INNER_STATE_CHANGED)){
	            //   newState = Object.assign({},this.state || {},this._alternalState)
	            // }
	            if (this.shouldComponentUpdate(this._pendProps, newState)) {
	                var prevProps = this.props;
	                var prevState = this.state;
	                this.__updateThisProps();
	                this.state = newState;
	                var snapShot = void 0;
	                if (this.getSnapshotBeforeUpdate) {
	                    snapShot = this.getSnapshotBeforeUpdate(prevProps, prevState);
	                }
	                this.update();
	                this.componentDidUpdate(prevProps, prevState, snapShot);
	            }
	            else {
	                this.__updateThisProps();
	                this.state = newState;
	            }
	        }
	        this._markUpdated();
	    };
	    WebComponent.prototype._markUpdated = function () {
	        // this._changedProperties = new WMap();
	        this._pendProps = {};
	        this._clearFlag(STATE_IN_UPDATING);
	        // this._clearFlag(INNER_STATE_CHANGED)
	        this._alternalState = null;
	    };
	    WebComponent.prototype._enqueueUpdate = function (callback) {
	        return __awaiter(this, void 0, void 0, function () {
	            var resolve, previousUpdatePromise, result;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        // Mark state updating...
	                        this._markFlag(STATE_IN_UPDATING);
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
	                        callback && callback();
	                        resolve(true);
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    WebComponent.prototype.update = function () {
	        var _this = this;
	        try {
	            if (this._reflectingProperties !== undefined &&
	                this._reflectingProperties.size > 0) {
	                // this._reflectingProperties.
	                this._reflectingProperties._each(function (k, v) {
	                    _this._propertyToAttribute(k, _this[k], v);
	                });
	                this._reflectingProperties = undefined;
	            }
	            this.__part = render_1.shadowRender(this.render(), this.shadowRoot, { eventContext: this });
	        }
	        catch (e) {
	            if (this.componentDidCatch) {
	                this.componentDidCatch(e);
	            }
	            else {
	                throw new Error(e);
	            }
	        }
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
	            this._markFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE);
	            if (attrValue == null) {
	                this.removeAttribute(attr);
	            }
	            else {
	                this.setAttribute(attr, attrValue);
	            }
	            this._clearFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE);
	        }
	    };
	    WebComponent.prototype._attributeToProperty = function (name, value) {
	        // Use tracking info to avoid deserializing attribute value if it was
	        // just set from a property setter.
	        if (this._hasFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE)) {
	            return;
	        }
	        var ctor = this.constructor;
	        if (ctor._attributeToPropertyMap == null)
	            return;
	        var propName = ctor._attributeToPropertyMap.get(name);
	        if (propName === undefined)
	            return;
	        var options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
	        // mark state reflecting
	        // this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
	        this._markFlag(STATE_IS_REFLECTING_TO_PROPERTY);
	        this[propName] =
	            ctor._propertyValueFromAttribute(value, options);
	        this._clearFlag(STATE_IS_REFLECTING_TO_PROPERTY);
	        // mark state not reflecting
	        // this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
	    };
	    WebComponent.prototype.attributeChangedCallback = function (name, old, value) {
	        if (old !== value) {
	            this._attributeToProperty(name, value);
	        }
	    };
	    WebComponent.prototype.disconnectedCallback = function () {
	        this.componentWillUnmount();
	        if (this.__part) {
	            this.__part.destroy();
	        }
	    };
	    WebComponent.prototype.componentWillReceiveProps = function (nextProps) { };
	    WebComponent.prototype.componentDidMount = function () { };
	    WebComponent.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) { };
	    WebComponent.prototype.componentWillUnmount = function () { };
	    WebComponent.prototype.componentWillMount = function () { };
	    WebComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
	        return true;
	    };
	    WebComponent.prototype.forceUpdate = function (callback) {
	        this.setState(null, callback);
	    };
	    WebComponent.prototype.setState = function (partialState, callback) {
	        if (partialState) {
	            // this._markFlag(INNER_STATE_CHANGED)
	            this._alternalState = Object.assign({}, this._alternalState, partialState);
	        }
	        this.requestUpdate(undefined, undefined, callback);
	    };
	    WebComponent._finalized = true;
	    WebComponent.properties = {};
	    return WebComponent;
	}(HTMLElement));
	exports.WebComponent = WebComponent;
	function defineWebComponent(name, componentClz) {
	    customElements.define(name, componentClz);
	}
	exports.defineWebComponent = defineWebComponent;
	var INVALID_PROPS_NAME = {
	    props: true,
	    state: true
	};
	exports.property = function (options) { return function (proto, name) {
	    if (INVALID_PROPS_NAME[name])
	        return;
	    proto.constructor.createProperty(name, options);
	}; };
	});

	unwrapExports(webcomponent);
	var webcomponent_1 = webcomponent.notEqual;
	var webcomponent_2 = webcomponent.WebComponent;
	var webcomponent_3 = webcomponent.defineWebComponent;
	var webcomponent_4 = webcomponent.property;

	var component = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var componentId = 1;
	var Component = /** @class */ (function () {
	    function Component(props) {
	        this._mountFlag = false;
	        this.props = props;
	        this.id = "" + componentId++;
	    }
	    Component.prototype.componentWillReceiveProps = function (nextProps) { };
	    Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
	        return true;
	    };
	    Component.prototype.componentDidMount = function () { };
	    Component.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) { };
	    Component.prototype.componentWillUnmount = function () { };
	    Component.prototype.componentWillMount = function () { };
	    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
	    // constructor(props) {
	    //     this.props = props;
	    // }
	    Component.prototype._doRender = function () {
	        //eventContext 和 slots覆盖传入的eventContext和slots
	        try {
	            this.part = render_1.render(this.render(), this.fragment, __assign({}, this.renderOption, { eventContext: this, slots: this._slots }));
	        }
	        catch (e) {
	            if (this.componentDidCatch) {
	                this.componentDidCatch(e);
	            }
	            else {
	                throw new Error(e);
	            }
	        }
	    };
	    Component.prototype._firstCommit = function () {
	        // this.componentWillMount();
	        this._doRender();
	        this._mount(this.fragment);
	        this._mountFlag = true;
	        this.componentDidMount();
	    };
	    Component.prototype._commit = function (prevProps, prevState, snapshot) {
	        this._doRender();
	        this.componentDidUpdate(prevProps, prevState, snapshot);
	    };
	    Component.prototype.forceUpdate = function (callback) {
	        // this.setState(null,callback,true)
	        updater.default.enqueueSetState(this, null, callback, true);
	    };
	    Component.prototype.setState = function (partialState, callback) {
	        // debugger;
	        updater.default.enqueueSetState(this, partialState || {}, callback, false);
	        // this.state = Object.assign({},this.state || {},partialState || {});
	        // this._commit();
	        // this._pendingState = Object.assign({},this.state || {},this._pendingState);
	        // this._updatePromise = new Promise((resolve,reject)=>{
	        //     if(this._updatePromise.then(()=>{
	        //     }))
	        //     this.state = this._pendingState;
	        //     this._commit();
	        // })
	    };
	    return Component;
	}());
	exports.Component = Component;
	});

	unwrapExports(component);
	var component_1 = component.Component;

	var lib = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	exports.defineWebComponent = webcomponent.defineWebComponent;
	exports.WebComponent = webcomponent.WebComponent;
	exports.property = webcomponent.property;

	exports.Component = component.Component;

	exports.defineComponent = componentRegistry.defineComponent;

	exports.render = render_1.shadowRender;
	function html(strings) {
	    var values = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        values[_i - 1] = arguments[_i];
	    }
	    return new templateResult.TemplateResult(strings, values, 'html');
	}
	exports.html = html;
	function svg(strings) {
	    var values = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        values[_i - 1] = arguments[_i];
	    }
	    return new templateResult.SVGTemplateResult(strings, values, 'svg');
	}
	exports.svg = svg;
	// export function render(){
	// }
	});

	var index = unwrapExports(lib);
	var lib_1 = lib.defineWebComponent;
	var lib_2 = lib.WebComponent;
	var lib_3 = lib.property;
	var lib_4 = lib.Component;
	var lib_5 = lib.defineComponent;
	var lib_6 = lib.render;
	var lib_7 = lib.html;
	var lib_8 = lib.svg;

	exports.default = index;
	exports.defineWebComponent = lib_1;
	exports.WebComponent = lib_2;
	exports.property = lib_3;
	exports.Component = lib_4;
	exports.defineComponent = lib_5;
	exports.render = lib_6;
	exports.html = lib_7;
	exports.svg = lib_8;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
