const ComponentCenter = new Map();
export function defineComponent(name, ComponentProto) {
    ComponentCenter.set(name, ComponentProto);
}
export function getCom(name) {
    return ComponentCenter.get(name);
}
