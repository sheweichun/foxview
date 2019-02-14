export declare const isCEPolyfill: boolean;
export declare function clone(template: HTMLTemplateElement): DocumentFragment;
export declare const reparentNodes: (container: Node, start: Node, end?: Node, before?: Node) => void;
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
export declare function removeNode(node: Node): void;
export declare const removeAllNodes: (container: Node, startNode: Node, endNode?: Node) => void;
export declare const removeNodes: (container: Node, startNode: Node, endNode?: Node) => void;
export declare function removeAttributes(node: Element, toRemoveAttributes: string[]): void;
