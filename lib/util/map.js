"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapPolyfill = /** @class */ (function () {
    function MapPolyfill() {
        this._cache = {};
    }
    MapPolyfill.prototype._each = function (iterator) {
        var cache = this._cache;
        Object.keys(cache).forEach(function (name) {
            iterator(name, cache[name]);
        });
    };
    MapPolyfill.prototype.clear = function () {
        this._cache = {};
    };
    MapPolyfill.prototype.has = function (name) {
        return this._cache.hasOwnProperty(name);
    };
    MapPolyfill.prototype.get = function (name) {
        return this._cache[name];
    };
    MapPolyfill.prototype.set = function (name, value) {
        this._cache[name] = value;
    };
    Object.defineProperty(MapPolyfill.prototype, "size", {
        get: function () {
            return Object.keys(this._cache).length;
        },
        enumerable: true,
        configurable: true
    });
    return MapPolyfill;
}());
exports.default = MapPolyfill;
