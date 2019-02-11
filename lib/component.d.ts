import { TemplateResult } from './templateResult';
export declare abstract class Component extends HTMLElement {
    constructor();
    abstract render(): TemplateResult;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
}
export declare function defineComponent(name: string, componentClz: typeof Component): void;
