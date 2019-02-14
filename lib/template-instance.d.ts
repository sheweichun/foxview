import { RenderOptions, ITemplateResult } from './type';
export declare class TemplateInstance {
    private _peons;
    template: ITemplateResult;
    options: RenderOptions;
    fragment: DocumentFragment;
    mounted: boolean;
    constructor(options: RenderOptions);
    private _prepareFrament;
    setValue(newTemplate: ITemplateResult): void;
    commit(): void;
    _destroy(): void;
    isSameTemplate(newTemplate: ITemplateResult): boolean;
}
