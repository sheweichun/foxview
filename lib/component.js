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
var updater_1 = require("./updater");
var componentId = 1;
var Component = /** @class */ (function () {
    function Component(props) {
        this._mountFlag = false;
        this.props = props;
        this.id = "" + componentId++;
    }
    Component.prototype.componentWillReceiveProps = function (nextProps) { };
    Component.prototype.componentShouldUpdate = function (nextProps, nextState) {
        return true;
    };
    Component.prototype.componentDidMount = function () { };
    Component.prototype.componentDidUpdate = function () { };
    Component.prototype.componentWillUnmount = function () { };
    Component.prototype.componentWillMount = function () { };
    // private _updatePromise: Promise<unknown> = Promise.resolve(true);
    // constructor(props) {
    //     this.props = props;
    // }
    Component.prototype._doRender = function () {
        //eventContext 和 slots覆盖传入的eventContext和slots
        this.part = render_1.render(this.render(), this.fragment, __assign({}, this.renderOption, { eventContext: this, slots: this._slots }));
    };
    Component.prototype._firstCommit = function () {
        // this.componentWillMount();
        this._doRender();
        this._mount(this.fragment);
        this._mountFlag = true;
        this.componentDidMount();
    };
    Component.prototype._commit = function () {
        this._doRender();
        this.componentDidUpdate();
        // if(!this._mountFlag){
        //     this._firstCommit();
        // }else{
        //     this._doRender();
        //     this.componentDidUpdate();
        // }
    };
    Component.prototype.forceUpdate = function (callback) {
        // this.setState(null,callback,true)
        updater_1.default.enqueueSetState(this, null, callback, true);
    };
    Component.prototype.setState = function (partialState, callback) {
        // debugger;
        updater_1.default.enqueueSetState(this, partialState || {}, callback, false);
        // this.state = Object.assign({},this.state || {},partialState || {});
        // this._commit();
        // this._pendingState = Object.assign({},this.state || {},this._pendingState);
        // this._updatePromise = new Promise((resolve,reject)=>{
        //     if(this._updatePromise.then(()=>{
        //     }))
        //     this.state = this._pendingState;
        //     this._commit();
        // })
    };
    return Component;
}());
exports.Component = Component;
