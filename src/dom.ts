export const isCEPolyfill = window.customElements !== undefined &&
    (window.customElements as any).polyfillWrapFlushCallback !== undefined;



export function clone(template:HTMLTemplateElement){
    return isCEPolyfill ?
    template.content.cloneNode(true) as DocumentFragment :
    document.importNode(template.content, true);
}

export const reparentNodes =
    (container: Node,
     start: Node|null,
     end: Node|null = null,
     before: Node|null = null): void => {
      let node = start;
      while (node !== end) {
        const n = node!.nextSibling;
        container.insertBefore(node!, before as Node);
        node = n;
      }
    };

/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
export function removeNode(node:Node){
  const parentNode = node.parentNode;
  if(parentNode){
    parentNode.removeChild(node);
  }
}

// export const removeAllNodes = (container: Node, startNode: Node|null, endNode: Node|null = null):void =>{
//   let node = startNode;
//   while (node !== endNode) {
//     const n = node!.nextSibling;
//     container.removeChild(node!);
//     node = n;
//   }
//   endNode && container.removeChild(endNode!);
// }

export const removeNodes = (container: Node, startNode: Node|null, endNode: Node|null = null,removeAll:boolean=false):void => {
  let node = startNode;
  while (node !== endNode) {
    const n = node!.nextSibling;
    container.removeChild(node!);
    node = n;
  }
  (removeAll && endNode) && container.removeChild(endNode!);
};

export function removeAttributes(node:Element,toRemoveAttributes:string[]){
  for(let i = 0;i < toRemoveAttributes.length; i++){
    node.removeAttribute(toRemoveAttributes[i])
  }
}