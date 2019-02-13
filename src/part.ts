import {RenderOptions,Peon} from './type';
import {TemplateResult} from './template-result';
import {TemplateInstance} from './template-instance';
import {createMarker} from './template';
import {removeNodes} from './dom';
import {isPrimitive} from './util/is'




export class ComponentPart implements Peon{
  startNode!: Node;
  endNode!: Node;
  _node:Node;
  value: any;
  options: RenderOptions;
  _pendingValue: any = undefined;
  _valueIndex:number = undefined;
  _markCleared:boolean = false;
  constructor(options: RenderOptions) {
    this.options = options;
  }
  appendInto(container:Node){
    this.startNode = container.appendChild(createMarker());
    this.endNode = container.appendChild(createMarker());
  }
  setValue(value:any){

  }
  commit(){

  }
}



export class NodePart implements Peon {
    startNode!: Node;
    endNode!: Node;
    _node:Node;
    value: any;
    options: RenderOptions;
    _pendingValue: any = undefined;
    _valueIndex:number = undefined;
    _markCleared:boolean = false;
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
      ref._insert(this.startNode = createMarker());
      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }
  
    setValue(value:any){
      let newValue;
      if(this.options && this._valueIndex != null ){
        newValue = value[this._valueIndex];
      }else{
        newValue = value; 
      }
      if (Array.isArray(newValue)) {
        this._setIterableValue(newValue);
      }else if(newValue instanceof TemplateResult){
        this._setTemplateResultValue(newValue);
      }
      this._pendingValue = newValue;
    }
    private _insert(node: Node) {
      this.endNode.parentNode!.insertBefore(node, this.endNode);
      this._node = node;
    }
    private _clear(startNode: Node = this.startNode) {
      removeNodes(
          this.startNode.parentNode!, startNode.nextSibling!, this.endNode);
    }
    private _clearAllMarker(){
      if(this.startNode && this.startNode.parentNode){
        this.startNode.parentNode.removeChild(this.startNode)
      }
      if(this.endNode && this.endNode.parentNode){
        this.endNode.parentNode.removeChild(this.endNode)
      }
      this.startNode = null;
      this.endNode = null;
      this._markCleared = true;
    }
    private _setTemplateResultValue(value:TemplateResult){
      if(this.value && this.value.isSameTemplate(value)){
        this.value.setValue(value);
      }else{
        const instance = new TemplateInstance(this.options);
        instance.setValue(value);
        this._insert(instance.fragment);
        this.value = instance;
      }
    }
    private _commitTemplateResult(){
      const instance = this.value;
      instance.commit();
      if(!instance.mounted){
        this._insert(instance.fragment);
        instance.mounted = true;
      }
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
        itemPart.setValue(item);
        partIndex++;
      }
      this.value = itemParts;
      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this._clear(itemPart && itemPart!.endNode);
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
    // private _commitNode(value: Node): void {
    //   if (this.value === value) {
    //     return;
    //   }
    //   this._clear();
    //   this._insert(value);
    //   this.value = value;
    // }
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
      if(value instanceof TemplateResult){
        this._commitTemplateResult();
      } else if (Array.isArray(value)) {
        this._commitIterable();
      } else if(isPrimitive(value)){
        this._commitText(value)
      }
      if(!this._markCleared){
        this._clearAllMarker();
      }
    }
}