export interface ComponentProp {
    [key: string]: any;
}
export interface IComponent {
    render(): ITemplateResult;
}
export interface IComponentConstructor {
    new (props: ComponentProp): IComponent;
}
export interface Peon {
    setValue(value: any): void;
    /**
     * Commits the current part value, cause it to actually be written to the DOM.
     */
    commit(): void;
}
export declare type ProcessResult = {
    fragment: DocumentFragment;
    peons: Array<Peon>;
};
export declare type TemplateProcessor = (templateResult: ITemplateResult, option: RenderOptions) => ProcessResult;
export interface TemplateStringsArray extends ReadonlyArray<string> {
    readonly raw: ReadonlyArray<string>;
}
export interface ITemplateResult {
    strings: TemplateStringsArray;
    values: any[];
    type: string;
    getHTML: () => string;
    getTemplateElement: () => HTMLTemplateElement;
}
export interface ComponentPrototype {
    render: () => string[];
}
export interface RenderOptions {
    eventContext?: EventTarget;
    templateProcessor: TemplateProcessor;
    templateClone: (template: HTMLTemplateElement) => DocumentFragment;
}
