import { RenderOptions, Peon } from './type';
export declare class ComponentPart implements Peon {
    startNode: Node;
    endNode: Node;
    _node: Node;
    value: any;
    options: RenderOptions;
    _pendingValue: any;
    _valueIndex: number;
    _markCleared: boolean;
    constructor(options: RenderOptions);
    appendInto(container: Node): void;
    setValue(value: any): void;
    commit(): void;
}
export declare class NodePart implements Peon {
    startNode: Node;
    endNode: Node;
    _node: Node;
    value: any;
    options: RenderOptions;
    _pendingValue: any;
    _valueIndex: number;
    _markCleared: boolean;
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
    private _insert;
    private _clear;
    private _clearAllMarker;
    private _setTemplateResultValue;
    private _commitTemplateResult;
    private _setIterableValue;
    private _commitIterable;
    private _commitText;
    commit(): void;
}
