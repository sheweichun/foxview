import {shadowRender} from './render';
import {ITemplateResult,IComponentLifeCycle,ComponentProp, Peon,Constructor} from './type';
import WMap from './util/map';
import assign from './util/assign';

export interface ComplexAttributeConverter < Type = any,TypeHint = any > {

    /**
     * Function called to convert an attribute value to a property
     * value.
     */
    fromAttribute? (value : string, type?: TypeHint): Type;

    /**
     * Function called to convert a property value to an attribute
     * value.
     */
    toAttribute? (value : Type, type?: TypeHint): string | null;
}

type AttributeConverter < Type = any,TypeHint = any > = ComplexAttributeConverter < Type >| ((value : string, type?: TypeHint) => Type);
export interface PropertyDeclaration < Type = any,TypeHint = any > {
    attribute?: boolean | string;

    type?: TypeHint;

    converter?: AttributeConverter < Type,TypeHint >;

    reflect?: boolean;

    hasChanged? (value : Type, oldValue : Type): boolean;

    noAccessor?: boolean;
}

export interface PropertyDeclarations {
    [key : string] : PropertyDeclaration;
}

type PropertyDeclarationMap = WMap <PropertyDeclaration >;

type AttributeMap = WMap < string >;
type PropertyValues = WMap < unknown >;

const defaultConverter : ComplexAttributeConverter = {

    toAttribute(value : any, type?: any) {
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

    fromAttribute(value : any, type?: any) {
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
export interface HasChanged {
    (value : unknown, old : unknown) : boolean;
}

export const notEqual : HasChanged = (value : unknown, old : unknown) : boolean => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration : PropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
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

const STATE_IN_UPDATING = 1;
const MOUNTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const INNER_STATE_CHANGED = 1 << 5;
// const STATE_UPDATE_REQUESTED = 1 << 2;
// const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
// const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
// const STATE_HAS_CONNECTED = 1 << 5;
type UpdateState = typeof STATE_IN_UPDATING | typeof MOUNTED | typeof STATE_IS_REFLECTING_TO_ATTRIBUTE | typeof STATE_IS_REFLECTING_TO_PROPERTY | typeof INNER_STATE_CHANGED

export abstract class WebComponent extends HTMLElement implements IComponentLifeCycle{
    getSnapshotBeforeUpdate?(prevProps:ComponentProp, prevState:ComponentProp):any
    private static _attributeToPropertyMap : AttributeMap;
    private static _classProperties : PropertyDeclarationMap;
    private static _finalized = true;
    static properties: PropertyDeclarations = {};
    private static _propertyValueFromAttribute(value: string,
        options: PropertyDeclaration) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    private static _attributeNameForProperty(name: string,
        options: PropertyDeclaration) {
        const attribute = options.attribute;
        return attribute === false ? undefined
            : (typeof attribute === 'string' ? attribute
                : (typeof name === 'string' ? name.toLowerCase()
                        : undefined));
    }
    private static _propertyValueToAttribute(value: unknown,
        options: PropertyDeclaration) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute =converter && (converter as ComplexAttributeConverter).toAttribute || defaultConverter.toAttribute;
        return toAttribute!(value, type);
    }
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're _finalized.
        this._finalize();
        const attributes = [];
        if(this._classProperties){
            this._classProperties._each((p,v)=>{
              const attr = this._attributeNameForProperty(p, v);
              if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
              }
            })
        }
        return attributes;
    }
    private static _finalize() {
        if (this.hasOwnProperty('_finalized') && this._finalized) {
          return;
        }
        const superCtor = Object.getPrototypeOf(this);
        if (typeof superCtor._finalize === 'function') {
          superCtor._finalize();
        }
        this._finalized = true;
        this._attributeToPropertyMap = new WMap();
        if (this.hasOwnProperty('properties')) {
          const props = this.properties;
          // support symbols in properties (IE11 does not support this)
          const propKeys = [
            ...Object.getOwnPropertyNames(props),
            ...(typeof Object.getOwnPropertySymbols === 'function')
                ? Object.getOwnPropertySymbols(props)
                : []
          ];
          for (const p of propKeys) {
            // note, use of `any` is due to TypeSript lack of support for symbol in
            // index types
            this.createProperty(p as string, (props as any)[p]);
          }
        }
      }
    private _reflectingProperties: WMap<PropertyDeclaration>|undefined = undefined;
    // private _instanceProperties : PropertyValues | undefined = undefined; //存储实例属性值 待完善
    // private _changedProperties: PropertyValues = new WMap();
    private _pendProps:ComponentProp = {};
    private _updatePromise: Promise<unknown> = Promise.resolve(true);
    private _stateFlags:UpdateState = 0
    private _alternalState:ComponentProp
    private __part:Peon
    componentDidCatch?(e:Error):void
    state?:ComponentProp
    __props:ComponentProp={}
    get props(){
      return this.__props;
    }
    set props(val){}
    //todo 会污染HTMLElement里
    static createProperty(name : PropertyKey, options : PropertyDeclaration = defaultPropertyDeclaration) {
        if (!this.hasOwnProperty('_classProperties')) {
            this._classProperties = new WMap();
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v : any, k : string) => this._classProperties.set(k, v));
            }
        }
        this._classProperties.set(name as string, options);
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
          return;
        }
        if (!options.noAccessor) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            Object.defineProperty(this.prototype, name, {
                get() {
                    return this[key];
                },
                set(value : any) {
                    // this._pendProps[name] = value;
                    const oldValue = this[key];
                    this[key] = value;
                    this.requestUpdate(name, oldValue);
                },
                configurable: true,
                enumerable: true
            });
        }
    }
    constructor() {
        super();
        this.initialize();
    }
    private _markFlag(flag:UpdateState){
      this._stateFlags = this._stateFlags | flag;
    }
    
    private _clearFlag(flag:UpdateState){
      this._stateFlags = this._stateFlags & ~flag;
    }
    private _hasFlag(flag:UpdateState){
      return this._stateFlags & flag;
    }
    initialize() {
      this.attachShadow({mode: 'open'});
      // this._saveInstanceProperties();
      this.requestUpdate();
    }
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
    requestUpdate(name?: string, oldValue?: any,callback?:()=>void) {
        let shouldRequestUpdate = true;
        // if we have a property key, perform property update steps.
        // if (name !== undefined && !this._changedProperties.has(name)) {
        if (name !== undefined && !this._pendProps.hasOwnProperty(name)) {
          const ctor = this.constructor as typeof WebComponent;
          const options =
              ctor._classProperties.get(name) || defaultPropertyDeclaration;
          if ((options.hasChanged || notEqual)(this[name as keyof this], oldValue)) {
            // track old value when changing.
            this._pendProps[name] = this[name];
            // this._changedProperties.set(name, oldValue);
            // add to reflecting properties set
            if (options.reflect === true && !this._hasFlag(STATE_IS_REFLECTING_TO_PROPERTY)) {
              if (this._reflectingProperties === undefined) {
                this._reflectingProperties = new WMap();
              }
              this._reflectingProperties.set(name, options);
            }
            // abort the request if the property should not be considered changed.
          } else {
            shouldRequestUpdate = false;
          }
        }
        if (!this._hasFlag(STATE_IN_UPDATING) && shouldRequestUpdate) { //防止多次重复更新
          this._enqueueUpdate(callback);
        }else{
          callback && callback();
        }
        // return this.updateComplete;
    }
    private __updateThisProps(){
      this.__props = assign({},this.props,this._pendProps);
      // console.log('__props :',this._pendProps);
      Object.freeze(this.__props);
      
    }
    protected performUpdate(): void|Promise<unknown> {
        // if (this._instanceProperties) {
        //     //@ts-ignore
        //     for (const [p, v] of this._instanceProperties!) {
        //         (this as any)[p] = v;
        //       }
        //       this._instanceProperties = undefined;
        // }
        // const changedProperties = this._changedProperties;
        let  newState = assign({},this.state || {},this._alternalState || {})
        //@ts-ignore
        const getDerivedStateFromProps = (this.constructor).getDerivedStateFromProps;
        if(getDerivedStateFromProps){
            const result = getDerivedStateFromProps.call(this.constructor,this._pendProps,newState);
            if(result){
                newState = assign({},newState,result)
            }
        }
        //getDerivedStateFromProps
        if(!this._hasFlag(MOUNTED)){
          this.__updateThisProps();
          // if(this._hasFlag(INNER_STATE_CHANGED)){
          //   this.state = assign({},this.state || {},this._alternalState)
          // }
          this.state = newState;
          this.componentWillMount();
          this.update();
          // this._mountFlag = true;
          this._markFlag(MOUNTED);
          this.componentDidMount();
        }else{
          // if(this._hasFlag(INNER_STATE_CHANGED)){
          //   newState = assign({},this.state || {},this._alternalState)
          // }
          if (this.shouldComponentUpdate(this._pendProps,newState)) {
            const prevProps = this.props;
            const prevState = this.state;
            this.__updateThisProps();
            this.state = newState;
            let snapShot:any;
            if(this.getSnapshotBeforeUpdate){
              snapShot = this.getSnapshotBeforeUpdate(prevProps,prevState);
            }
            this.update();
            this.componentDidUpdate(prevProps,prevState,snapShot);
          }else{
            this.__updateThisProps();
            this.state = newState;
          }
        }
        this._markUpdated();
    }
    private _markUpdated() {
        // this._changedProperties = new WMap();
        this._pendProps = {}; 
        this._clearFlag(STATE_IN_UPDATING);
        // this._clearFlag(INNER_STATE_CHANGED)
        this._alternalState = null;
      }
    private async _enqueueUpdate(callback?:()=>void) {
        // Mark state updating...
        this._markFlag(STATE_IN_UPDATING);
        let resolve: (r: boolean) => void;
        const previousUpdatePromise = this._updatePromise;
        this._updatePromise = new Promise((res) => resolve = res);
        
        await previousUpdatePromise;
        // if (!this._hasConnected) {
        //   await new Promise((res) => this._hasConnectedResolver = res);
        // }
        
        const result = this.performUpdate();
        // Note, this is to avoid delaying an additional microtask unless we need
        // to.
        if (result != null &&
            typeof (result as PromiseLike<unknown>).then === 'function') {
          await result;
        }
        callback && callback();
        resolve!(true);
    }
    protected update() {
        try{
          if (this._reflectingProperties !== undefined &&
              this._reflectingProperties.size > 0) {
            // this._reflectingProperties.
            this._reflectingProperties._each((k,v)=>{
              this._propertyToAttribute(k, this[k as keyof this], v);
            })
            this._reflectingProperties = undefined;
          }
          this.__part = shadowRender(this.render(), this.shadowRoot, {eventContext: this})
        }catch(e){
          if(this.componentDidCatch){
              this.componentDidCatch(e);
          }else{
              throw new Error(e)
          }
        }
    }
    abstract render() : ITemplateResult
    // connectedCallback(){ }
    private _propertyToAttribute(
        name: string, value: unknown,
        options: PropertyDeclaration = defaultPropertyDeclaration) {
      const ctor = (this.constructor as typeof WebComponent);
      const attr = ctor._attributeNameForProperty(name, options);
      if (attr !== undefined) {
        const attrValue = ctor._propertyValueToAttribute(value, options);
        // an undefined value does not change the attribute.
        if (attrValue === undefined) {
          return;
        }
        this._markFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE);
        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
        this._clearFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE);
      }
    }
    private _attributeToProperty(name: string, value: string) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._hasFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE)) {
          return;
        }
        const ctor = (this.constructor as typeof WebComponent);
        if(ctor._attributeToPropertyMap == null) return;
        const propName = ctor._attributeToPropertyMap.get(name);
        if(propName === undefined) return;
        const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
        // mark state reflecting
        // this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this._markFlag(STATE_IS_REFLECTING_TO_PROPERTY);
        this[propName as keyof this] =
            ctor._propertyValueFromAttribute(value, options);
        this._clearFlag(STATE_IS_REFLECTING_TO_PROPERTY)
        // mark state not reflecting
        // this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    protected attributeChangedCallback(name : string, old : string | null, value : string | null) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    disconnectedCallback(){
      this.componentWillUnmount();
      if(this.__part){
        this.__part.destroy();
      }
    }
    componentWillReceiveProps(nextProps:ComponentProp):void{}
    componentDidMount():void{}
    componentDidUpdate(prevProps:ComponentProp, prevState:ComponentProp,snapshot?:any):void{}
    componentWillUnmount():void{}
    componentWillMount():void{}
    shouldComponentUpdate(nextProps: ComponentProp,nextState:ComponentProp):boolean{
      return true;
    }
    forceUpdate(callback?:()=>void){
      this.setState(null,callback)
    }
    setState(partialState?:Partial<ComponentProp>,callback?:()=>void){
      if(partialState){
        // this._markFlag(INNER_STATE_CHANGED)
        this._alternalState = assign({},this._alternalState,partialState);
      }
      this.requestUpdate(undefined,undefined,callback);
    }
}




export function defineWebComponent(name : string, componentClz : typeof WebComponent) {
  window.customElements && window.customElements.define(name, componentClz)
}

interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

const legacyCustomElement =
    (tagName: string, clazz: Constructor<HTMLElement>) => {
      window.customElements && window.customElements.define(tagName, clazz);
      // Cast as any because TS doesn't recognize the return type as being a
      // subtype of the decorated class when clazz is typed as
      // `Constructor<HTMLElement>` for some reason.
      // `Constructor<HTMLElement>` is helpful to make sure the decorator is
      // applied to elements however.
      // tslint:disable-next-line:no-any
      return clazz as any;
    };

const standardCustomElement =
    (tagName: string, descriptor: ClassDescriptor) => {
      const {kind, elements} = descriptor;
      return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz: Constructor<HTMLElement>) {
          window.customElements && window.customElements.define(tagName, clazz);
        }
      };
    };

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 */
export const customElement = (tagName: string) =>
    (classOrDescriptor: Constructor<HTMLElement>|ClassDescriptor) =>
        (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(
        tagName, classOrDescriptor as Constructor<HTMLElement>) :
    standardCustomElement(tagName, classOrDescriptor as ClassDescriptor);

const INVALID_PROPS_NAME = {
  props:true,
  state:true
};

interface ClassElement {
  kind: 'field'|'method';
  key: PropertyKey;
  placement: 'static'|'prototype'|'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

const standardProperty =
    (options: PropertyDeclaration, element: ClassElement) => {
      // When decorating an accessor, pass it through and add property metadata.
      // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
      // stomp over the user's accessor.
      if (element.kind === 'method' && element.descriptor &&
          !('value' in element.descriptor)) {
        return {
          ...element,
          finisher(clazz: typeof WebComponent) {
            clazz.createProperty(element.key, options);
          }
        };
      } else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
          kind: 'field',
          key: Symbol(),
          placement: 'own',
          descriptor: {},
          // When @babel/plugin-proposal-decorators implements initializers,
          // do this instead of the initializer below. See:
          // https://github.com/babel/babel/issues/9260 extras: [
          //   {
          //     kind: 'initializer',
          //     placement: 'own',
          //     initializer: descriptor.initializer,
          //   }
          // ],
          // tslint:disable-next-line:no-any decorator
          initializer(this: any) {
            if (typeof element.initializer === 'function') {
              this[element.key] = element.initializer!.call(this);
            }
          },
          finisher(clazz: typeof WebComponent) {
            clazz.createProperty(element.key, options);
          }
        };
      }
    };

const legacyProperty =
    (options: PropertyDeclaration, proto: Object, name: PropertyKey) => {
      (proto.constructor as typeof WebComponent)
          .createProperty(name!, options);
    };

/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * @ExportDecoratedItems
 */
export function property(options?: PropertyDeclaration) {
  // tslint:disable-next-line:no-any decorator
  if(INVALID_PROPS_NAME[name]) return;
  return (protoOrDescriptor: Object|ClassElement, name?: PropertyKey): any =>
             (name !== undefined) ?
      legacyProperty(options!, protoOrDescriptor as Object, name) :
      standardProperty(options!, protoOrDescriptor as ClassElement);
}

// export const property = (options?: PropertyDeclaration) => (
//     proto: Object, name: string) => {
//   if(INVALID_PROPS_NAME[name]) return;
//   (proto.constructor as typeof WebComponent).createProperty(name, options);
// };
