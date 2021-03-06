import { IComponentConstructor, IComponentFunc } from './type';
import VMap from './util/map'

const ComponentCenter = new VMap<IComponentConstructor | IComponentFunc>();

export function defineComponent(
  name: string,
  ComponentProto: IComponentConstructor
) {
  if (ComponentCenter.get(name)) {
    throw new Error(`${name} is defined`);
  }
  if (ComponentProto == null) {
    return function(proto: IComponentConstructor) {
      ComponentCenter.set(name, proto);
    };
  }
  ComponentCenter.set(name, ComponentProto);
}

export function getCom(name: string): IComponentConstructor | IComponentFunc {
  return ComponentCenter.get(name);
}
