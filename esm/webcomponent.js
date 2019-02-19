import { shadowRender } from './render';
import WMap from './util/map';
const defaultConverter = {
    toAttribute(value, type) {
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
    fromAttribute(value, type) {
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
export const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
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
export class WebComponent extends HTMLElement {
    constructor() {
        super();
        this._reflectingProperties = undefined;
        // private _instanceProperties : PropertyValues | undefined = undefined; //存储实例属性值 待完善
        // private _changedProperties: PropertyValues = new WMap();
        this._pendProps = {};
        this._updatePromise = Promise.resolve(true);
        this._stateFlags = 0;
        this.__props = {};
        this.initialize();
    }
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ? undefined
            : (typeof attribute === 'string' ? attribute
                : (typeof name === 'string' ? name.toLowerCase()
                    : undefined));
    }
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're _finalized.
        this._finalize();
        const attributes = [];
        if (this._classProperties) {
            this._classProperties._each((p, v) => {
                const attr = this._attributeNameForProperty(p, v);
                if (attr !== undefined) {
                    this._attributeToPropertyMap.set(attr, p);
                    attributes.push(attr);
                }
            });
        }
        return attributes;
    }
    static _finalize() {
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
                this.createProperty(p, props[p]);
            }
        }
    }
    get props() {
        return this.__props;
    }
    set props(val) { }
    static createProperty(name, options = defaultPropertyDeclaration) {
        if (!this.hasOwnProperty('_classProperties')) {
            this._classProperties = new WMap();
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
        this._classProperties.set(name, options);
        if (!options.noAccessor) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            Object.defineProperty(this.prototype, name, {
                get() {
                    return this[key];
                },
                set(value) {
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
    _markFlag(flag) {
        this._stateFlags = this._stateFlags | flag;
    }
    _clearFlag(flag) {
        this._stateFlags = this._stateFlags & ~flag;
    }
    _hasFlag(flag) {
        return this._stateFlags & flag;
    }
    initialize() {
        this.attachShadow({ mode: 'open' });
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
    requestUpdate(name, oldValue, callback) {
        let shouldRequestUpdate = true;
        // if we have a property key, perform property update steps.
        // if (name !== undefined && !this._changedProperties.has(name)) {
        if (name !== undefined && !this._pendProps.hasOwnProperty(name)) {
            const ctor = this.constructor;
            const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
            if ((options.hasChanged || notEqual)(this[name], oldValue)) {
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
    }
    __updateThisProps() {
        this.__props = Object.assign({}, this.props, this._pendProps);
        // console.log('__props :',this._pendProps);
        Object.freeze(this.__props);
    }
    performUpdate() {
        // if (this._instanceProperties) {
        //     //@ts-ignore
        //     for (const [p, v] of this._instanceProperties!) {
        //         (this as any)[p] = v;
        //       }
        //       this._instanceProperties = undefined;
        // }
        // const changedProperties = this._changedProperties;
        let newState = Object.assign({}, this.state || {}, this._alternalState || {});
        //@ts-ignore
        const getDerivedStateFromProps = (this.constructor).getDerivedStateFromProps;
        if (getDerivedStateFromProps) {
            const result = getDerivedStateFromProps.call(this.constructor, this._pendProps, newState);
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
                const prevProps = this.props;
                const prevState = this.state;
                this.__updateThisProps();
                this.state = newState;
                let snapShot;
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
    }
    _markUpdated() {
        // this._changedProperties = new WMap();
        this._pendProps = {};
        this._clearFlag(STATE_IN_UPDATING);
        // this._clearFlag(INNER_STATE_CHANGED)
        this._alternalState = null;
    }
    async _enqueueUpdate(callback) {
        // Mark state updating...
        this._markFlag(STATE_IN_UPDATING);
        let resolve;
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
            typeof result.then === 'function') {
            await result;
        }
        callback && callback();
        resolve(true);
    }
    update() {
        try {
            if (this._reflectingProperties !== undefined &&
                this._reflectingProperties.size > 0) {
                // this._reflectingProperties.
                this._reflectingProperties._each((k, v) => {
                    this._propertyToAttribute(k, this[k], v);
                });
                this._reflectingProperties = undefined;
            }
            this.__part = shadowRender(this.render(), this.shadowRoot, { eventContext: this });
        }
        catch (e) {
            if (this.componentDidCatch) {
                this.componentDidCatch(e);
            }
            else {
                throw new Error(e);
            }
        }
    }
    // connectedCallback(){ }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
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
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            this._clearFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE);
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._hasFlag(STATE_IS_REFLECTING_TO_ATTRIBUTE)) {
            return;
        }
        const ctor = this.constructor;
        if (ctor._attributeToPropertyMap == null)
            return;
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName === undefined)
            return;
        const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
        // mark state reflecting
        // this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this._markFlag(STATE_IS_REFLECTING_TO_PROPERTY);
        this[propName] =
            ctor._propertyValueFromAttribute(value, options);
        this._clearFlag(STATE_IS_REFLECTING_TO_PROPERTY);
        // mark state not reflecting
        // this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    disconnectedCallback() {
        this.componentWillUnmount();
        if (this.__part) {
            this.__part.destroy();
        }
    }
    componentWillReceiveProps(nextProps) { }
    componentDidMount() { }
    componentDidUpdate(prevProps, prevState, snapshot) { }
    componentWillUnmount() { }
    componentWillMount() { }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    forceUpdate(callback) {
        this.setState(null, callback);
    }
    setState(partialState, callback) {
        if (partialState) {
            // this._markFlag(INNER_STATE_CHANGED)
            this._alternalState = Object.assign({}, this._alternalState, partialState);
        }
        this.requestUpdate(undefined, undefined, callback);
    }
}
WebComponent._finalized = true;
WebComponent.properties = {};
export function defineWebComponent(name, componentClz) {
    customElements.define(name, componentClz);
}
const INVALID_PROPS_NAME = {
    props: true,
    state: true
};
export const property = (options) => (proto, name) => {
    if (INVALID_PROPS_NAME[name])
        return;
    proto.constructor.createProperty(name, options);
};
