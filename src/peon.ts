import {Peon} from './type';
export enum PeonType {
  Attribute,
  Property,
  Content,
  Event,
  BooleanAttribute
  // Comment
}

export type PeonConstruct = {
  startIndex: number 
  name?: string 
  node: Element | Node 
  eventContext?: EventTarget 
  strings: Array < string > | string
}

function injectValue2Strings(startIndex : number, strings : string[], values : any[]) {
  let result = '';
  const lastIndex = strings.length - 1;
  for (let i = 0; i < lastIndex; i++) {
    result += strings[i] + values[startIndex + i];
  }
  result += strings[lastIndex]
  return result;
}

class AttributePeon implements Peon {
  startIndex : number
  name : string
  node : Element
  _shouldUpdate : boolean = false
  _pendingValue : string
  strings : Array <string> 
  constructor(option : PeonConstruct) {
    this.startIndex = option.startIndex;
    this.name = option.name;
    this.node = option.node as Element;
    this.strings = option.strings as Array < string >;
  }
  setValue(values) {
    const newValue = injectValue2Strings(this.startIndex, this.strings, values);
    if (newValue !== this._pendingValue) {
      this._shouldUpdate = true
    }
    this._pendingValue = newValue;
  }
  commit() {
    if (!this._shouldUpdate) 
      return;
    this
      .node
      .setAttribute(this.name, this._pendingValue);
    this._shouldUpdate = false;
  }
}

class ContentPeon implements Peon {
  startIndex : number
  strings : Array <string> 
  _shouldUpdate : boolean = false
  _pendingValue : string
  node : Node
  constructor(option : PeonConstruct) {
    this.startIndex = option.startIndex;
    this.node = option.node as Node;
    this.strings = option.strings as Array < string >;
  }
  setValue(values) {
    const newValue = injectValue2Strings(this.startIndex, this.strings, values);
    if (newValue !== this._pendingValue) {
      this._shouldUpdate = true
    }
    this._pendingValue = injectValue2Strings(this.startIndex, this.strings, values);
  }
  commit() {
    if (!this._shouldUpdate) 
      return;
    this.node.nodeValue = this._pendingValue;
    this._shouldUpdate = false;
  }
}

let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }
  };
  window.addEventListener('test', options as any, options);
  window.removeEventListener('test', options as any, options);
} catch (_e) {}

class EventPeon implements Peon {
  node : Element;
  name : string;
  startIndex:number;
  eventContext?: EventTarget;
  value : any = undefined;
  _options?: AddEventListenerOptions;
  _pendingValue : any = undefined;
  _boundHandleEvent : (event : Event) => void;

  constructor(option : PeonConstruct) {
    this.node = option.node as Element;
    this.name = option.name;
    this.startIndex = option.startIndex;
    this.eventContext = option.eventContext;
    this._boundHandleEvent = (e) => this.handleEvent(e);
  }
  static getOptions(o : any) {
    return o && (eventOptionsSupported
      ? {
        capture: o.capture,
        passive: o.passive,
        once: o.once
      }
      : o.capture)
  }
  setValue(values : any) : void {
    this._pendingValue = values[this.startIndex];
  }

  commit() {
    const newListener = this._pendingValue;
    const oldListener = this.value;
    const element = this.node;
    const shouldRemoveListener = newListener == null 
    || oldListener != null 
    && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      element.removeEventListener(this.name, this._boundHandleEvent, this._options);
    }
    if (shouldAddListener) {
      this._options = EventPeon.getOptions(newListener);
      element.addEventListener(this.name, this._boundHandleEvent, this._options);
    }
    this.value = newListener;
    // this._pendingValue = noChange;
  }

  handleEvent(event : Event) {
    if (typeof this.value === 'function') {
      this
        .value
        .call(this.eventContext || this.node, event);
    } else {
      this
        .value
        .handleEvent(event);
    }
  }
}

class BooleanAttributePeon extends AttributePeon {
  single: boolean;
  constructor(option : PeonConstruct) {
    super(option);
    if (this.strings.length !== 2 || this.strings[0] !== '' || this.strings[1] !== '') {
      throw new Error(
          'Boolean attributes can only contain a single expression');
    }
  }
  setValue(values:any[]) {
    let newValue:any = values[this.startIndex];
    if (newValue !== this._pendingValue) {
      this._shouldUpdate = true
    }
    this._pendingValue = newValue;
  }
  commit() {
    if (!this._shouldUpdate) 
      return;
    const value = this._pendingValue;
    if (value) {
      this.node.setAttribute(this.name, '');
    } else {
      this.node.removeAttribute(this.name);
    }
    this._shouldUpdate = false;
  }
}

class PropertyPeon extends AttributePeon {
  single: boolean;
  constructor(option : PeonConstruct) {
    super(option);
    this.single =
        (this.strings.length === 2 && this.strings[0] === '' && this.strings[1] === '');
  }
  setValue(values:any[]) {
    let newValue:any;
    if(this.single){
      newValue = values[this.startIndex];
    }else{
      newValue = injectValue2Strings(this.startIndex, this.strings, values);
    }
    if (newValue !== this._pendingValue) {
      this._shouldUpdate = true
    }
    this._pendingValue = newValue;
  }
  commit() {
    if (!this._shouldUpdate) 
      return;
    this
      .node[this.name] = this._pendingValue;
    this._shouldUpdate = false;
  }
}

export function createPeon(type : PeonType, option : PeonConstruct) {
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
