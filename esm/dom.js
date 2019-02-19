export const isCEPolyfill = window.customElements !== undefined &&
    window.customElements.polyfillWrapFlushCallback !== undefined;
export function clone(template) {
    return isCEPolyfill ?
        template.content.cloneNode(true) :
        document.importNode(template.content, true);
}
export const reparentNodes = (container, start, end = null, before = null) => {
    let node = start;
    while (node !== end) {
        const n = node.nextSibling;
        container.insertBefore(node, before);
        node = n;
    }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
export function removeNode(node) {
    const parentNode = node.parentNode;
    if (parentNode) {
        parentNode.removeChild(node);
    }
}
export const removeAllNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
    endNode && container.removeChild(endNode);
};
export const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};
export function removeAttributes(node, toRemoveAttributes) {
    for (let i = 0; i < toRemoveAttributes.length; i++) {
        node.removeAttribute(toRemoveAttributes[i]);
    }
}
