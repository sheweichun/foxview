
import {INameToValue} from './type'

export interface ElementMutation{
    [key:string]:{
        name?:string,
        value:any
    }
}

export interface Element{
    tagName:string,
    props:INameToValue,
    children:Array<string | Element> | string,
    mutation:ElementMutation
}



export function createElement(tagName:string,props:INameToValue,children:Array<string | Element> | string,mutation:ElementMutation):Element{
    return {
        tagName,
        props,
        children,
        mutation
    }
}