"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_result_1 = require("./template-result");
var template_instance_1 = require("./template-instance");
var template_1 = require("./template");
var dom_1 = require("./dom");
// import {isPrimitive} from './util/is'
var ComponentPart = /** @class */ (function () {
    // _markCleared:boolean = false;
    function ComponentPart(componentClass, propsSchemas, slots, options) {
        this._moutFlag = false;
        this._updateFlag = false;
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
        this.endNode = parentNode.insertBefore(template_1.createMarker(), container);
    };
    ComponentPart.prototype.setValue = function (values) {
        var newProps = this._propsSchemas.reduce(function (ret, item) {
            ret[item.name] = item.index != null ? values[item.index] : item.value;
            return ret;
        }, {});
        var instance = this._componentInstance;
        if (!instance) {
            instance = new this._componentClass(newProps);
            instance.props = newProps;
            instance.fragment = this.fragment;
            instance.renderOption = this.options;
            instance._slots = this._slots;
            this._componentInstance = instance;
            this._updateFlag = true;
        }
        else {
            instance.componentWillReceiveProps(newProps);
            this._updateFlag = instance.componentShouldUpdate(newProps);
            instance.props = newProps;
        }
    };
    ComponentPart.prototype._insert = function (node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    };
    ComponentPart.prototype.destroy = function () {
        var instance = this._componentInstance;
        instance.componentWillUnmount();
        if (instance.part) {
            instance.part.destroy();
        }
        this._slots = null;
        this.endNode = null;
        this.fragment = null;
    };
    ComponentPart.prototype.commit = function () {
        var _this = this;
        var instance = this._componentInstance;
        if (!this._updateFlag)
            return;
        if (!this._moutFlag) {
            instance._commit();
            this._insert(this.fragment);
            this._moutFlag = true;
            instance.componentDidMount();
        }
        else {
            instance.setState(null, function () {
                _this._componentInstance.componentDidUpdate();
            });
        }
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
        this.startNode = container.appendChild(template_1.createMarker());
        this.endNode = container.appendChild(template_1.createMarker());
    };
    // insertAfterNode(ref: Node) {
    //   this.startNode = ref;
    //   this.endNode = ref.nextSibling!;
    // }
    NodePart.prototype.attachNode = function (ref) {
        this.startNode = template_1.createMarker();
        this.endNode = template_1.createMarker();
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
        part._insert(this.startNode = template_1.createMarker());
        part._insert(this.endNode = template_1.createMarker());
    };
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    NodePart.prototype.insertAfterPart = function (ref) {
        var tmpMarker = template_1.createMarker();
        ref._insert(tmpMarker);
        this.endNode = ref.endNode;
        ref.endNode = tmpMarker;
        this._insert(this.startNode = template_1.createMarker());
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
        if (newValue instanceof template_result_1.TemplateResult) {
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
        dom_1.removeAllNodes(this.startNode.parentNode, this.startNode, this.endNode);
        this.startNode = null;
        this.endNode = null;
        // this._node = null;
    };
    NodePart.prototype._clearDOM = function (startNode) {
        if (startNode === void 0) { startNode = this.startNode; }
        dom_1.removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
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
            var instance = new template_instance_1.TemplateInstance(this.options);
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
