import { ITemplateResult, ProcessResult, RenderOptions } from './type';
export declare function walkNode(fragment: DocumentFragment, templateResult: ITemplateResult, partIndex: number, option: RenderOptions): ProcessResult;
export declare type templateCache = {
    stringsArray: WeakMap<TemplateStringsArray, HTMLTemplateElement>;
    keyString: Map<string, HTMLTemplateElement>;
};
export default function (templateResult: ITemplateResult, option: RenderOptions): ProcessResult;
