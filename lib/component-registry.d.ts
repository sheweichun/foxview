import { IComponentConstructor } from './type';
export declare function defineComponent(name: string, ComponentProto: IComponentConstructor): void;
export declare function getComponentByName(name: string): IComponentConstructor;
