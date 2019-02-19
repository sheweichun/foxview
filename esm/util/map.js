export default class MapPolyfill {
    constructor() {
        this._cache = {};
    }
    _each(iterator) {
        const cache = this._cache;
        Object.keys(cache).forEach((name) => {
            iterator(name, cache[name]);
        });
    }
    clear() {
        this._cache = {};
    }
    has(name) {
        return this._cache.hasOwnProperty(name);
    }
    get(name) {
        return this._cache[name];
    }
    set(name, value) {
        this._cache[name] = value;
    }
    get size() {
        return Object.keys(this._cache).length;
    }
}
