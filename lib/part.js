"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_result_1 = require("./template-result");
var template_instance_1 = require("./template-instance");
var template_1 = require("./template");
var dom_1 = require("./dom");
var is_1 = require("./util/is");
var ComponentPart = /** @class */ (function () {
    function ComponentPart(options) {
        this._pendingValue = undefined;
        this._valueIndex = undefined;
        this._markCleared = false;
        this.options = options;
    }
    ComponentPart.prototype.appendInto = function (container) {
        this.startNode = container.appendChild(template_1.createMarker());
        this.endNode = container.appendChild(template_1.createMarker());
    };
    ComponentPart.prototype.setValue = function (value) {
    };
    ComponentPart.prototype.commit = function () {
    };
    return ComponentPart;
}());
exports.ComponentPart = ComponentPart;
var NodePart = /** @class */ (function () {
    function NodePart(options) {
        this._pendingValue = undefined;
        this._valueIndex = undefined;
        this._markCleared = false;
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
        ref._insert(this.startNode = template_1.createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    };
    NodePart.prototype.setValue = function (value) {
        var newValue;
        if (this.options && this._valueIndex != null) {
            newValue = value[this._valueIndex];
        }
        else {
            newValue = value;
        }
        if (Array.isArray(newValue)) {
            this._setIterableValue(newValue);
        }
        else if (newValue instanceof template_result_1.TemplateResult) {
            this._setTemplateResultValue(newValue);
        }
        this._pendingValue = newValue;
    };
    NodePart.prototype._insert = function (node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
        this._node = node;
    };
    NodePart.prototype._clear = function (startNode) {
        if (startNode === void 0) { startNode = this.startNode; }
        dom_1.removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    };
    NodePart.prototype._clearAllMarker = function () {
        if (this.startNode && this.startNode.parentNode) {
            this.startNode.parentNode.removeChild(this.startNode);
        }
        if (this.endNode && this.endNode.parentNode) {
            this.endNode.parentNode.removeChild(this.endNode);
        }
        this.startNode = null;
        this.endNode = null;
        this._markCleared = true;
    };
    NodePart.prototype._setTemplateResultValue = function (value) {
        if (this.value && this.value.isSameTemplate(value)) {
            this.value.setValue(value);
        }
        else {
            var instance = new template_instance_1.TemplateInstance(this.options);
            instance.setValue(value);
            this._insert(instance.fragment);
            this.value = instance;
        }
    };
    NodePart.prototype._commitTemplateResult = function () {
        var instance = this.value;
        instance.commit();
        if (!instance.mounted) {
            this._insert(instance.fragment);
            instance.mounted = true;
        }
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
            itemPart.setValue(item);
            partIndex++;
        }
        this.value = itemParts;
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this._clear(itemPart && itemPart.endNode);
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
    // private _commitNode(value: Node): void {
    //   if (this.value === value) {
    //     return;
    //   }
    //   this._clear();
    //   this._insert(value);
    //   this.value = value;
    // }
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
        if (value instanceof template_result_1.TemplateResult) {
            this._commitTemplateResult();
        }
        else if (Array.isArray(value)) {
            this._commitIterable();
        }
        else if (is_1.isPrimitive(value)) {
            this._commitText(value);
        }
        if (!this._markCleared) {
            this._clearAllMarker();
        }
    };
    return NodePart;
}());
exports.NodePart = NodePart;
