import { ITemplateResult } from './type';
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
declare type PropertyValues = Map<PropertyKey, unknown>;
export interface HasChanged {
    (value: unknown, old: unknown): boolean;
}
export declare const notEqual: HasChanged;
export declare abstract class WebComponent extends HTMLElement {
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
    private _instanceProperties;
    private _changedProperties;
    private _updatePromise;
    static createProperty(name: PropertyKey, options?: PropertyDeclaration): void;
    constructor();
    initialize(): void;
    requestUpdate(name?: PropertyKey, oldValue?: any): void;
    protected shouldUpdate(_changedProperties: PropertyValues): boolean;
    protected performUpdate(): void | Promise<unknown>;
    private _markUpdated;
    private _enqueueUpdate;
    protected update(changedProperties: PropertyValues): void;
    abstract render(): ITemplateResult;
    private _propertyToAttribute;
    private _attributeToProperty;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    protected updated(_changedProperties: PropertyValues): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
}
export declare function defineWebComponent(name: string, componentClz: typeof WebComponent): void;
export declare const property: (options?: PropertyDeclaration<any, any>) => (proto: Object, name: string | number | symbol) => void;
export {};
