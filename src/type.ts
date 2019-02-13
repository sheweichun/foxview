


// import {TemplateResult} from './template-result'


// import {Template} from './template';

export interface ComponentProp{
    [key:string]:any
}

export interface IComponent{
    render() : ITemplateResult
}

export interface IComponentConstructor{
    new(props:ComponentProp) : IComponent
}

export interface Peon{
    // startIndex:number
    // strings:Array<string> | string
    // node:Element | Node
    // update:(values:any[]) => void
    setValue(value: any): void;
  
    /**
     * Commits the current part value, cause it to actually be written to the DOM.
     */
    commit(): void;

}
// export type TemplateFactory = (result: TemplateResult) => Template;

export type ProcessResult = {
    fragment:DocumentFragment,
    peons: Array<Peon>
}

// export interface Part {
  
//     /**
//      * Sets the current part value, but does not write it to the DOM.
//      * @param value The value that will be committed.
//      */
//     setValue(value: any): void;
  
//     /**
//      * Commits the current part value, cause it to actually be written to the DOM.
//      */
//     commit(): void;
// }

export type TemplateProcessor = (templateResult:ITemplateResult,option:RenderOptions)=>ProcessResult

export interface TemplateStringsArray extends ReadonlyArray<string> {
    readonly raw: ReadonlyArray<string>;
}


export interface ITemplateResult{
    strings: TemplateStringsArray;
    values: any[];
    type:string;
    getHTML:()=>string;
    getTemplateElement:()=>HTMLTemplateElement;
}

export interface ComponentPrototype{
    render:()=>string[]
}


export interface RenderOptions {
    eventContext?: EventTarget;
    templateProcessor:TemplateProcessor;
    templateClone:(template:HTMLTemplateElement)=>DocumentFragment
  }