import { TemplateResult } from './template-result';
import { TemplateInstance } from './template-instance';
import { createMarker } from './template';
import { removeNodes, removeAllNodes } from './dom';
// import {isPrimitive} from './util/is'
export class ComponentPart {
    // _markCleared:boolean = false;
    constructor(componentClass, propsSchemas, slots, options) {
        this._pendingValue = undefined;
        this._valueIndex = undefined;
        this._componentClass = componentClass;
        this._propsSchemas = propsSchemas;
        this._slots = slots;
        this.options = options;
    }
    insertBeforeNode(container) {
        const parentNode = container.parentNode;
        this.fragment = document.createDocumentFragment();
        // this.startNode = parentNode.insertBefore(createMarker(),container);
        this.endNode = parentNode.insertBefore(createMarker(), container);
    }
    setValue(values) {
        const newProps = this._propsSchemas.reduce((ret, item) => {
            ret[item.name] = item.index != null ? values[item.index] : item.value;
            return ret;
        }, {});
        Object.freeze(newProps);
        let instance = this._componentInstance;
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
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    destroy() {
        const instance = this._componentInstance;
        instance.componentWillUnmount();
        instance._mount = null;
        if (instance.part) {
            instance.part.destroy();
        }
        this._slots = null;
        this.endNode = null;
        this.fragment = null;
    }
    commit() {
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
    }
}
var NodePartValueType;
(function (NodePartValueType) {
    NodePartValueType[NodePartValueType["TemplateResult"] = 0] = "TemplateResult";
    NodePartValueType[NodePartValueType["ArrayResult"] = 1] = "ArrayResult";
    NodePartValueType[NodePartValueType["NodeValue"] = 2] = "NodeValue";
    NodePartValueType[NodePartValueType["Node"] = 3] = "Node";
    NodePartValueType[NodePartValueType["None"] = 4] = "None";
})(NodePartValueType || (NodePartValueType = {}));
export class NodePart {
    constructor(options) {
        this._valueType = NodePartValueType.None;
        this._pendingValue = undefined;
        this._valueIndex = undefined;
        this._valueHandleMap = {
            [NodePartValueType.TemplateResult]: this._setTemplateResultValue.bind(this),
            [NodePartValueType.ArrayResult]: this._setIterableValue.bind(this)
        };
        this.options = options;
    }
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    // insertAfterNode(ref: Node) {
    //   this.startNode = ref;
    //   this.endNode = ref.nextSibling!;
    // }
    attachNode(ref) {
        this.startNode = createMarker();
        this.endNode = createMarker();
        const parentNode = ref.parentNode;
        parentNode.insertBefore(this.endNode, ref);
        parentNode.insertBefore(this.startNode, this.endNode);
    }
    setValueIndex(valueIndex) {
        this._valueIndex = valueIndex;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part._insert(this.startNode = createMarker());
        part._insert(this.endNode = createMarker());
    }
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        const tmpMarker = createMarker();
        ref._insert(tmpMarker);
        this.endNode = ref.endNode;
        ref.endNode = tmpMarker;
        this._insert(this.startNode = createMarker());
    }
    setValue(value) {
        let newValue;
        if (this._valueIndex != null) {
            newValue = value[this._valueIndex];
        }
        else {
            newValue = value;
        }
        let newValueType;
        if (newValue instanceof TemplateResult) {
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
        const handle = this._valueHandleMap[this._valueType];
        if (handle) {
            handle(newValue);
        }
        this._pendingValue = newValue;
    }
    destroy() {
        switch (this._valueType) {
            case NodePartValueType.TemplateResult:
                this.value._destroy();
                break;
            case NodePartValueType.ArrayResult:
                this.value.forEach((np) => {
                    np.destroy();
                });
                break;
        }
        this.value = null;
        removeAllNodes(this.startNode.parentNode, this.startNode, this.endNode);
        this.startNode = null;
        this.endNode = null;
        // this._node = null;
    }
    _clearDOM(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
    _clear() {
        switch (this._valueType) {
            case NodePartValueType.TemplateResult:
                this.value._destroy();
                break;
            case NodePartValueType.ArrayResult:
                this.value.forEach((np) => {
                    np.destroy();
                });
                break;
        }
        this.value = null; //清除原有的value
        this._clearDOM(this.startNode);
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
        // this._node = node;
    }
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
    _setTemplateResultValue(value) {
        if (this.value && this.value.isSameTemplate(value)) {
            this.value.setValue(value);
        }
        else {
            if (this.value) {
                this.value._destroy();
            }
            this._clearDOM();
            const instance = new TemplateInstance(this.options);
            instance.setValue(value);
            this._insert(instance.fragment);
            this.value = instance;
        }
    }
    _commitTemplateResult() {
        const instance = this.value;
        instance.commit();
    }
    _setIterableValue(value) {
        const itemParts = this.value || [];
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
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
        const prevLen = itemParts.length;
        if (partIndex < prevLen) {
            itemPart = itemParts[partIndex];
            // Truncate the parts array so _value reflects the current state
            for (let i = partIndex; i < prevLen; i++) {
                const removeItemPart = itemParts[i];
                removeItemPart && removeItemPart.destroy();
            }
            itemParts.length = partIndex;
            // this._clearDOM(itemPart && itemPart!.endNode);
        }
    }
    _commitIterable() {
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value || [];
        // let itemPart: NodePart|undefined;
        for (const itemPart of itemParts) {
            itemPart.commit();
        }
    }
    _commitNode(value) {
        if (this.value === value) {
            return;
        }
        this._clearDOM();
        this._insert(value);
        this.value = value;
    }
    _commitText(value) {
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
    }
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
    commit() {
        const value = this._pendingValue;
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
    }
}
