export default class MapPolyfill<V> {
    private _cache;
    _each(iterator: (name: string, val: V) => any): void;
    clear(): void;
    has(name: string): boolean;
    get(name: string): V | undefined;
    set(name: string, value: V): void;
    readonly size: number;
}
