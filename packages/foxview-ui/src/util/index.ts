import {Ref,WebComponent} from 'foxview';

export type INodeMap = {
    [name:string]:boolean
}


export function list2Map(list:Array<string>):INodeMap{
    if(list == null) return {};
    return list.reduce((ret,val)=>{
        ret[val] = true;
        return ret;
    },{})
}

export function map2List(map:INodeMap):Array<string>{
    if(map == null) return [];
    return Object.keys(map).filter((name)=>{
        return map[name]
    });
}

export function dispatchCustomEvent(context:HTMLElement,name:string,data?:any){
    const event = new CustomEvent(name,{
        detail:data
    });
    context.dispatchEvent(event);
}


// export function createSlotMap(childNodes:NodeList):INodeMap{
//     const slotMap = {default:false}
//     for(let i = 0; i < childNodes.length; i++){
//         const childNode = childNodes[i] as Element;
//         if(childNode == null) return;
//         const {slot} = childNode;
//         if(slot){
//             slotMap[slot] = true;
//         }else if(!slotMap.default){
//             slotMap.default = true; 
//         }
//     }
//     return slotMap;
// }


export class Focusable {
    com:WebComponent
    ref:Ref
    // focused:boolean = false
    constructor(com:WebComponent){
        this.com = com;
    }
    onFocus=()=>{
        this.com.setState({
            focused:true
        })
        // dispatchCustomEvent(this.com,'focus')
    }
    onBlur=()=>{
        this.com.setState({
            focused:false
        })
        // dispatchCustomEvent(this.com,'blue')
    }
    enable(ref:Ref){
        const {current} = ref;
        if(current == null) return;
        current.addEventListener('focus',this.onFocus);
        current.addEventListener('blur',this.onBlur);
        this.ref = ref;
    }
    destroy(){
        const {current} = this.ref;
        if(current == null){ return }
        current.removeEventListener('focus',this.onFocus);
        current.removeEventListener('blur',this.onBlur);
    }
}