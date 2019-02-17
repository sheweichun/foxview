import { ITemplateResult, IComponentLifeCycle, ComponentProp } from './type';
import WMap from './util/map';
export interface ComplexAttributeConverter<Type = any, TypeHint = any> {
    /**
     * Function called to convert an attribute value to a property
     * value.
     */
    fromAttribute?(value: string, type?: TypeHint): Type;
    /**
     * Function called to convert a property value to an attribute
     * value.
     */
    toAttribute?(value: Type, type?: TypeHint): string | null;
}
declare type AttributeConverter<Type = any, TypeHint = any> = ComplexAttributeConverter<Type> | ((value: string, type?: TypeHint) => Type);
export interface PropertyDeclaration<Type = any, TypeHint = any> {
    attribute?: boolean | string;
    type?: TypeHint;
    converter?: AttributeConverter<Type, TypeHint>;
    reflect?: boolean;
    hasChanged?(value: Type, oldValue: Type): boolean;
    noAccessor?: boolean;
}
export interface PropertyDeclarations {
    [key: string]: PropertyDeclaration;
}
declare type PropertyValues = WMap<unknown>;
export interface HasChanged {
    (value: unknown, old: unknown): boolean;
}
export declare const notEqual: HasChanged;
export declare abstract class WebComponent extends HTMLElement implements IComponentLifeCycle {
    private static _attributeToPropertyMap;
    private static _classProperties;
    private static _finalized;
    static properties: PropertyDeclarations;
    private static _propertyValueFromAttribute;
    private static _attributeNameForProperty;
    private static _propertyValueToAttribute;
    static readonly observedAttributes: any[];
    private static _finalize;
    private _reflectingProperties;
    private _changedProperties;
    private _updatePromise;
    private _stateFlags;
    private _alternalState;
    state?: ComponentProp;
    props: ComponentProp;
    static createProperty(name: string, options?: PropertyDeclaration): void;
    constructor();
    private _markFlag;
    private _clearFlag;
    private _hasFlag;
    initialize(): void;
    requestUpdate(name?: string, oldValue?: any, callback?: () => void): void;
    protected performUpdate(): void | Promise<unknown>;
    private _markUpdated;
    private _enqueueUpdate;
    protected update(changedProperties: PropertyValues): void;
    abstract render(): ITemplateResult;
    private _propertyToAttribute;
    private _attributeToProperty;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    disconnectedCallback(): void;
    componentWillReceiveProps(nextProps: ComponentProp): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    componentWillMount(): void;
    componentShouldUpdate(_changedProperties: PropertyValues, nextState: ComponentProp): boolean;
    forceUpdate(callback?: () => void): void;
    setState(partialState?: Partial<ComponentProp>, callback?: () => void): void;
}
export declare function defineWebComponent(name: string, componentClz: typeof WebComponent): void;
export declare const property: (options?: PropertyDeclaration<any, any>) => (proto: Object, name: string) => void;
export {};
