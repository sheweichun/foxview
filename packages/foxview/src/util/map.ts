

export default class MapPolyfill<V>{
    private _cache:{
        [key:string]:V
    } = {}
    _each(iterator:(name:string,val:V)=>any){
        const cache = this._cache;
        Object.keys(cache).forEach((name:string)=>{
            iterator(name,cache[name]);
        })
    }
    clear(){
        this._cache = {}
    }
    has(name:string){
        return this._cache.hasOwnProperty(name);
    }
    get(name:string):V|undefined{
        return this._cache[name]
    }
    set(name:string,value:V){
        this._cache[name] = value
    }
    get size(){
        return Object.keys(this._cache).length
    }
}