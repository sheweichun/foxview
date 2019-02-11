export declare const isCEPolyfill: boolean;
export declare function clone(template: HTMLTemplateElement): DocumentFragment;
export declare const reparentNodes: (container: Node, start: Node, end?: Node, before?: Node) => void;
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
export declare const removeNodes: (container: Node, startNode: Node, endNode?: Node) => void;
