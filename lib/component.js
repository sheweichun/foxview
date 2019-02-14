"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = require("./render");
var Component = /** @class */ (function () {
    function Component() {
        this._mountFlag = false;
    }
    Component.prototype.componentWillReceiveProps = function (nextProps) { };
    Component.prototype.componentDidMount = function () { };
    Component.prototype.componentDidUpdate = function () { };
    Component.prototype.componentWillUnmount = function () { };
    // constructor(props) {
    //     this.props = props;
    // }
    Component.prototype._commit = function () {
        //eventContext 和 slots覆盖传入的eventContext和slots
        this.part = render_1.shadowRender(this.render(), this.fragment, __assign({}, this.renderOption, { eventContext: this, slots: this._slots }));
    };
    Component.prototype.setState = function (partialState) {
        this.state = Object.assign({}, this.state || {}, partialState);
        this._commit();
    };
    return Component;
}());
exports.Component = Component;
