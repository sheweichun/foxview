"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var callbackList = [];
var setStateMap = {};
var Updater = {
    isInBatchUpdating: false,
    enqueueSetState: function (instance, partialState, callback, isForce) {
        if (Updater.isInBatchUpdating && !isForce) {
            var item = setStateMap[instance.id];
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
                setStateMap[instance.id] = {
                    partialState: partialState,
                    instance: instance,
                    flushed: false
                };
                callback && callbackList.push(callback);
            }
            return;
        }
        instance.state = Object.assign({}, this.state || {}, partialState);
        callback && callback();
    },
    closeBatchUpdating: function () {
        Object.keys(setStateMap).forEach(function (id) {
            var item = setStateMap[id];
            var instance = item.instance, partialState = item.partialState;
            instance.state = Object.assign({}, instance.state, partialState);
            instance._commit();
            item.flushed = true;
        });
        // for(let [instance,item] of setStateMap){
        //     instance.state = Object.assign({},item.partialState,item.partialState);
        //     instance._commit()
        //     item.flushed = true;
        // }
        setStateMap = {};
        Updater.isInBatchUpdating = false;
        var callbackLen = callbackList.length;
        for (var i = 0; i < callbackLen; i++) {
            callbackList[i]();
        }
        callbackList.splice(0, callbackLen);
    }
};
exports.default = Updater;
