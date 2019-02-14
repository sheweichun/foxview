import { RenderOptions, ITemplateResult } from './type';
import { NodePart } from './part';
export declare function shadowRender(result: ITemplateResult, container: Element | DocumentFragment, options?: Partial<RenderOptions>): NodePart;
export declare function render(): void;
