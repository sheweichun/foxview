import {shadowRender} from './render';
import {ITemplateResult} from './type';


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

type PropertyDeclarationMap = Map < PropertyKey,PropertyDeclaration >;

type AttributeMap = Map < string,PropertyKey >;
type PropertyValues = Map < PropertyKey,unknown >;

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
export abstract class WebComponent extends HTMLElement {

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
    private static _attributeNameForProperty(name: PropertyKey,
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
            //@ts-ignore
            for (const [p, v] of this._classProperties) { 
                const attr = this._attributeNameForProperty(p, v);
                if (attr !== undefined) {
                  this._attributeToPropertyMap.set(attr, p);
                  attributes.push(attr);
                }
            }
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
        this._attributeToPropertyMap = new Map();
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
            this.createProperty(p, (props as any)[p]);
          }
        }
      }
    private _reflectingProperties: Map<PropertyKey, PropertyDeclaration>|undefined = undefined;
    private _instanceProperties : PropertyValues | undefined = undefined;
    private _changedProperties: PropertyValues = new Map();
    private _updatePromise: Promise<unknown> = Promise.resolve(true);
    static createProperty(name : PropertyKey, options : PropertyDeclaration = defaultPropertyDeclaration) {
        if (!this.hasOwnProperty('_classProperties')) {
            this._classProperties = new Map();
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v : any, k : PropertyKey) => this._classProperties.set(k, v));
            }
        }
        this._classProperties.set(name, options);
        if (!options.noAccessor) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            Object.defineProperty(this.prototype, name, {
                get() {
                    return this[key];
                },
                set(value : any) {
                    const oldValue = this[name];
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
    requestUpdate(name?: PropertyKey, oldValue?: any) {
        let shouldRequestUpdate = true;
        // if we have a property key, perform property update steps.
        if (name !== undefined && !this._changedProperties.has(name)) {
          const ctor = this.constructor as typeof WebComponent;
          const options =
              ctor._classProperties.get(name) || defaultPropertyDeclaration;
          if ((options.hasChanged || notEqual)(this[name as keyof this], oldValue)) {
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
          } else {
            shouldRequestUpdate = false;
          }
        }
        if (shouldRequestUpdate) {
          this._enqueueUpdate();
        }
        // return this.updateComplete;
    }
    protected shouldUpdate(_changedProperties: PropertyValues): boolean {
        return true;
    }
    protected performUpdate(): void|Promise<unknown> {
        if (this._instanceProperties) {
            //@ts-ignore
            for (const [p, v] of this._instanceProperties!) {
                (this as any)[p] = v;
              }
              this._instanceProperties = undefined;
        }
        if (this.shouldUpdate(this._changedProperties)) {
          const changedProperties = this._changedProperties;
          this.update(changedProperties);
          this._markUpdated();
        //   if (!(this._updateState & STATE_HAS_UPDATED)) {
        //     this._updateState = this._updateState | STATE_HAS_UPDATED;
        //     this.firstUpdated(changedProperties);
        //   }
        //   this.firstUpdated(changedProperties);
          this.updated(changedProperties);
        } else {
          this._markUpdated();
        }
    }
    private _markUpdated() {
        this._changedProperties = new Map();
      }
    private async _enqueueUpdate() {
        // Mark state updating...
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
        resolve!(true);
    }
    protected update(changedProperties: PropertyValues) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
          //@ts-ignore
          for (const [k, v] of this._reflectingProperties) {
            this._propertyToAttribute(k, this[k as keyof this], v);
          }
          this._reflectingProperties = undefined;
        }
        shadowRender(this.render(), this.shadowRoot, {eventContext: this})
      }
    abstract render() : ITemplateResult
    // connectedCallback(){ }
    private _propertyToAttribute(
        name: PropertyKey, value: unknown,
        options: PropertyDeclaration = defaultPropertyDeclaration) {
      const ctor = (this.constructor as typeof WebComponent);
      const attr = ctor._attributeNameForProperty(name, options);
      if (attr !== undefined) {
        const attrValue = ctor._propertyValueToAttribute(value, options);
        // an undefined value does not change the attribute.
        if (attrValue === undefined) {
          return;
        }
        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
      }
    }
    private _attributeToProperty(name: string, value: string) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        // if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        //   return;
        // }
        const ctor = (this.constructor as typeof WebComponent);
        if(ctor._attributeToPropertyMap == null) return;
        const propName = ctor._attributeToPropertyMap.get(name);
        if(propName === undefined) return;
        const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
        // mark state reflecting
        // this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName as keyof this] =
            ctor._propertyValueFromAttribute(value, options);
        // mark state not reflecting
        // this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    protected attributeChangedCallback(name : string, old : string | null, value : string | null) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    protected updated(_changedProperties: PropertyValues) {}
    protected firstUpdated(_changedProperties: PropertyValues) {}
}

export function defineWebComponent(name : string, componentClz : typeof WebComponent) {
    customElements.define(name, componentClz)
}

export const property = (options?: PropertyDeclaration) => (
    proto: Object, name: PropertyKey) => {
  (proto.constructor as typeof WebComponent).createProperty(name, options);
};
