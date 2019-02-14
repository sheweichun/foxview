


// import {TemplateResult} from './template-result'


// import {Template} from './template';

export interface ComponentProp{
    [key:string]:any
}

export interface ComponentPropSchema{
    name:string,
    index?:number,
    value?:any
}



// export type ComponentSlotSchema = {
//     name?:string,
//     node:Element | DocumentFragment
// }
export type ComponentSlotSchema = {
    [name:string]:Array<Element>
}

export interface IComponent{
    _commit():void
    props:ComponentProp
    part:Peon
    _slots?:ComponentSlotSchema;
    componentWillReceiveProps(nextProps:ComponentProp):void
    componentDidMount():void
    componentDidUpdate():void
    componentWillUnmount():void
    render() : ITemplateResult
    fragment:DocumentFragment
    renderOption:RenderOptions
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

    destroy():void;

}
// export type TemplateFactory = (result: TemplateResult) => Template;

export type ProcessResult = {
    fragment:DocumentFragment,
    partIndex:number,
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
    eventContext?: any;
    slots?:ComponentSlotSchema;
    templateProcessor:TemplateProcessor;
    templateClone:(template:HTMLTemplateElement)=>DocumentFragment
  }