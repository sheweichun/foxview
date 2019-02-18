import {RenderOptions,Peon,IComponentConstructor,ComponentPropSchema,IComponent,ComponentProp,ComponentSlotSchema} from './type';
import {TemplateResult} from './template-result';
import {TemplateInstance} from './template-instance';
import {createMarker} from './template';
import {removeNodes,removeAllNodes} from './dom';
// import {isPrimitive} from './util/is'




export class ComponentPart implements Peon{
  fragment:DocumentFragment;
  // startNode!: Node;
  endNode!: Node;
  // _moutFlag:boolean = false;
  // _updateFlag:boolean = false;
  value: any;
  options: RenderOptions;
  _slots:ComponentSlotSchema;
  _componentClass:IComponentConstructor;
  _propsSchemas:Array<ComponentPropSchema>;
  _componentInstance:IComponent;
  _pendingValue: any = undefined;
  _valueIndex:number = undefined;
  // _markCleared:boolean = false;
  constructor(componentClass:IComponentConstructor,propsSchemas:Array<ComponentPropSchema>,slots:ComponentSlotSchema,options: RenderOptions) {
    this._componentClass = componentClass;
    this._propsSchemas = propsSchemas;
    this._slots = slots;
    this.options = options;
  }
  insertBeforeNode(container:Node){
    const parentNode = container.parentNode;
    this.fragment = document.createDocumentFragment();
    // this.startNode = parentNode.insertBefore(createMarker(),container);
    this.endNode = parentNode.insertBefore(createMarker(),container);
  }
  setValue(values:any){
    const newProps:ComponentProp = this._propsSchemas.reduce((ret,item)=>{
      ret[item.name] = item.index != null ? values[item.index] : item.value;
      return ret;
    },{})
    Object.freeze(newProps);
    let instance = this._componentInstance;
    if(!instance){
      instance = new this._componentClass(newProps)
      // instance._parentPart = this;
      instance._mount = this._insert.bind(this);
      instance.props = newProps;
      instance._pendProps = newProps;
      instance.fragment = this.fragment;
      instance.renderOption = this.options;
      instance._slots = this._slots;
      this._componentInstance = instance;
      // this._updateFlag = true;
    }else{
      // instance.componentWillReceiveProps(newProps)
      // this._updateFlag = instance.shouldComponentUpdate(newProps,instance.state);
      instance._pendProps = newProps;
    }
  }
  _insert(node: Node|DocumentFragment) {
    this.endNode.parentNode!.insertBefore(node, this.endNode);
  }
  destroy(){
    const instance = this._componentInstance;
    instance.componentWillUnmount();
    instance._mount = null;
    if(instance.part){
      instance.part.destroy();
    }
    this._slots = null;
    this.endNode = null;
    this.fragment = null;
  }
  commit(){
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

enum NodePartValueType {
  TemplateResult,
  ArrayResult,
  NodeValue,
  Node,
  None
}

export class NodePart implements Peon {
    startNode!: Node;
    endNode!: Node;
    // _node:Node;
    value: any;
    options: RenderOptions;
    _valueType:NodePartValueType = NodePartValueType.None;
    _pendingValue: any = undefined;
    _valueIndex:number = undefined;
    _valueHandleMap = {
      [NodePartValueType.TemplateResult]:this._setTemplateResultValue.bind(this),
      [NodePartValueType.ArrayResult]:this._setIterableValue.bind(this)
    }
    // _markCleared:boolean = false;
    _textValue:any;
    constructor(options: RenderOptions) {
      this.options = options;
    }
    appendInto(container:Node){
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    // insertAfterNode(ref: Node) {
    //   this.startNode = ref;
    //   this.endNode = ref.nextSibling!;
    // }
    attachNode(ref: Node){
      this.startNode = createMarker();
      this.endNode = createMarker();
      const parentNode = ref.parentNode;
      parentNode.insertBefore(this.endNode,ref);
      parentNode.insertBefore(this.startNode,this.endNode);
    }
    setValueIndex(valueIndex:number){
      this._valueIndex = valueIndex;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part: NodePart) {
      part._insert(this.startNode = createMarker());
      part._insert(this.endNode = createMarker());
    }
  
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref: NodePart) {
      const tmpMarker = createMarker();
      ref._insert(tmpMarker);
      this.endNode = ref.endNode;
      ref.endNode = tmpMarker;
      this._insert(this.startNode = createMarker());
    }
    setValue(value:any){
      let newValue:any;
      if(this._valueIndex != null ){
        newValue = value[this._valueIndex];
      }else{
        newValue = value; 
      }
      let newValueType:NodePartValueType;
      if(newValue instanceof TemplateResult){
        newValueType = NodePartValueType.TemplateResult;
      }else if (Array.isArray(newValue)) {
        newValueType = NodePartValueType.ArrayResult;
      }else if(newValue instanceof Node){
        newValueType = NodePartValueType.Node;
      }else {
        newValueType = NodePartValueType.NodeValue;
      }
      if(this._valueType !== NodePartValueType.None && this._valueType !== newValueType){
        this._clear(); //当值类型发生了变化，清楚上一次的渲染结果
      }
      this._valueType = newValueType;
      const handle = this._valueHandleMap[this._valueType];
      if(handle){
        handle(newValue)
      }
      this._pendingValue = newValue;
    }
    destroy(){
      switch(this._valueType){
        case NodePartValueType.TemplateResult:
          this.value._destroy();
          break;
        case NodePartValueType.ArrayResult:
          this.value.forEach((np:NodePart)=>{
            np.destroy();
          })
          break;
      }
      this.value = null;
      removeAllNodes(
        this.startNode.parentNode!, this.startNode, this.endNode);
      this.startNode = null;
      this.endNode = null;
      // this._node = null;
    }
    private _clearDOM(startNode: Node = this.startNode){
      removeNodes(
        this.startNode.parentNode!, startNode.nextSibling!, this.endNode);
    }
    private _clear() {
      switch(this._valueType){
        case NodePartValueType.TemplateResult:
          this.value._destroy();
          break;
        case NodePartValueType.ArrayResult:
          this.value.forEach((np:NodePart)=>{
            np.destroy();
          })
          break;
      }
      this.value = null;  //清除原有的value
      this._clearDOM(this.startNode);
    }
    private _insert(node: Node) {
      this.endNode.parentNode!.insertBefore(node, this.endNode);
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
    private _setTemplateResultValue(value:TemplateResult){
      if(this.value && this.value.isSameTemplate(value)){
        this.value.setValue(value);
      }else{
        if(this.value){
          this.value._destroy();
        }
        this._clearDOM();
        const instance = new TemplateInstance(this.options);
        instance.setValue(value);
        this._insert(instance.fragment);
        this.value = instance;
      }
    }
    private _commitTemplateResult(){
      const instance = this.value;
      instance.commit();
    }
    private _setIterableValue(value:any):void{
      const itemParts = this.value as NodePart[] || [];
      let partIndex = 0;
      let itemPart: NodePart|undefined;
  
      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex];
  
        // If no existing part, create a new one
        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts[partIndex] = itemPart;
          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
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
        
        for(let i = partIndex; i < prevLen; i++){
          const removeItemPart = itemParts[i];
          removeItemPart && removeItemPart.destroy();
        }
        itemParts.length = partIndex;
        
        // this._clearDOM(itemPart && itemPart!.endNode);
      }
    }
    private _commitIterable(): void {
      // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render
      const itemParts = this.value as NodePart[] || [];
      // let itemPart: NodePart|undefined;
      for (const itemPart of itemParts) {
        itemPart.commit();
      }
    }
    private _commitNode(value: Node): void {
      if (this.value === value) {
        return;
      }
      this._clearDOM();
      this._insert(value);
      this.value = value;
    }
    private _commitText(value: string): void {
      value = value == null ? '' : value;
      if(this.value){
        if(this._textValue === value) return;
        this.value.nodeValue = value;
        this._textValue = value;
      }else{
        this.value = document.createTextNode(
          typeof value === 'string' ? value : String(value))
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
    commit(){
      const value = this._pendingValue;
      switch(this._valueType){
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

