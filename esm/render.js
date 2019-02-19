import { NodePart } from './part';
import { removeNodes, clone } from './dom';
import templateProcessor from './template-processor';
const parts = new WeakMap();
export function shadowRender(result, container, options) {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateProcessor, templateClone: clone }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
    return part;
}
export function render(result, container, options) {
    return shadowRender(result, container, Object.assign({}, options, { notInWebComponent: true }));
}
