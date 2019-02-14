import { RenderOptions, Peon, IComponentConstructor, ComponentPropSchema, IComponent, ComponentSlotSchema } from './type';
export declare class ComponentPart implements Peon {
    fragment: DocumentFragment;
    endNode: Node;
    _moutFlag: boolean;
    value: any;
    options: RenderOptions;
    _slots: ComponentSlotSchema;
    _componentClass: IComponentConstructor;
    _propsSchemas: Array<ComponentPropSchema>;
    _componentInstance: IComponent;
    _pendingValue: any;
    _valueIndex: number;
    constructor(componentClass: IComponentConstructor, propsSchemas: Array<ComponentPropSchema>, slots: ComponentSlotSchema, options: RenderOptions);
    insertBeforeNode(container: Node): void;
    setValue(values: any): void;
    private _insert;
    destroy(): void;
    commit(): void;
}
declare enum NodePartValueType {
    TemplateResult = 0,
    ArrayResult = 1,
    NodeValue = 2,
    Node = 3,
    None = 4
}
export declare class NodePart implements Peon {
    startNode: Node;
    endNode: Node;
    value: any;
    options: RenderOptions;
    _valueType: NodePartValueType;
    _pendingValue: any;
    _valueIndex: number;
    _valueHandleMap: {
        [NodePartValueType.TemplateResult]: any;
        [NodePartValueType.ArrayResult]: any;
    };
    _textValue: any;
    constructor(options: RenderOptions);
    appendInto(container: Node): void;
    attachNode(ref: Node): void;
    setValueIndex(valueIndex: number): void;
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part: NodePart): void;
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref: NodePart): void;
    setValue(value: any): void;
    destroy(): void;
    private _clearDOM;
    private _clear;
    private _insert;
    private _setTemplateResultValue;
    private _commitTemplateResult;
    private _setIterableValue;
    private _commitIterable;
    private _commitNode;
    private _commitText;
    commit(): void;
}
export {};
