"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./util/map");
var callbackList = [];
var setStateMap = new map_1.default();
var Updater = {
    isInBatchUpdating: false,
    isInClosingUpdating: false,
    performUpdate: function (item) {
        var instance = item.instance;
        if (!instance._mountFlag) {
            instance.componentWillMount();
            /**
             * 如果在componentWillUnmount调用了setState,此处会更新state,但不会触发二次渲染
             * 即便在componentWillMount中setState,此处item.partialState拿到也是最新的partialState
             * **/
            instance.state = Object.assign({}, instance.state || {}, item.partialState);
            instance._firstCommit();
            return;
        }
        var newState = Object.assign({}, instance.state || {}, item.partialState);
        if (instance.componentShouldUpdate(instance._pendProps, newState)) {
            instance.props = instance._pendProps;
            instance.state = newState;
            instance._commit();
        }
        else {
            instance.props = instance._pendProps;
            instance.state = newState;
        }
    },
    enqueueSetState: function (instance, partialState, callback, isForce) {
        if (Updater.isInBatchUpdating && !isForce) {
            var item = setStateMap.get(instance.id);
            if (item) {
                /**
                 * flushed表示已经更新过了 直接忽略
                 * 默认带partialState的都已记录到了setStateMap
                 * 此次是为了过滤掉closeBatchUpdating instant._commit导致的无状态变更的二次更新
                 * **/
                if (item.flushed)
                    return;
                item.partialState = Object.assign({}, item.partialState, partialState);
                callback && callbackList.push(callback);
            }
            else {
                var newItem = {
                    partialState: partialState,
                    instance: instance,
                    flushed: false
                };
                if (Updater.isInClosingUpdating) {
                    Updater.performUpdate(newItem);
                    callback && callback();
                    return;
                }
                setStateMap.set(instance.id, newItem);
                callback && callbackList.push(callback);
            }
            return;
        }
        Updater.performUpdate({
            instance: instance,
            partialState: partialState
        });
        callback && callback();
    },
    closeBatchUpdating: function () {
        Updater.isInClosingUpdating = true;
        setStateMap._each(function (id, item) {
            // const {instance,partialState} = item;
            Updater.performUpdate(item);
            item.flushed = true;
        });
        // Object.keys(setStateMap).forEach()
        // for(let [instance,item] of setStateMap){
        //     instance.state = Object.assign({},item.partialState,item.partialState);
        //     instance._commit()
        //     item.flushed = true;
        // }
        setStateMap.clear();
        Updater.isInClosingUpdating = false;
        Updater.isInBatchUpdating = false;
        var callbackLen = callbackList.length;
        for (var i = 0; i < callbackLen; i++) {
            callbackList[i]();
        }
        callbackList.splice(0, callbackLen);
    }
};
exports.default = Updater;
