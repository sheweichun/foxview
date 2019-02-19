import Updater from './updater';
export var PeonType;
(function (PeonType) {
    PeonType[PeonType["Attribute"] = 0] = "Attribute";
    PeonType[PeonType["Property"] = 1] = "Property";
    PeonType[PeonType["Content"] = 2] = "Content";
    PeonType[PeonType["Event"] = 3] = "Event";
    PeonType[PeonType["BooleanAttribute"] = 4] = "BooleanAttribute";
    // Comment
})(PeonType || (PeonType = {}));
function injectValue2Strings(startIndex, strings, values) {
    let result = '';
    const lastIndex = strings.length - 1;
    for (let i = 0; i < lastIndex; i++) {
        result += strings[i] + values[startIndex + i];
    }
    result += strings[lastIndex];
    return result;
}
class AttributePeon {
    constructor(option) {
        this._shouldUpdate = false;
        this.startIndex = option.startIndex;
        this.name = option.name;
        this.node = option.node;
        this.strings = option.strings;
    }
    setValue(values) {
        const newValue = injectValue2Strings(this.startIndex, this.strings, values);
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    }
    commit() {
        if (!this._shouldUpdate)
            return;
        this
            .node
            .setAttribute(this.name, this._pendingValue);
        this._shouldUpdate = false;
    }
    destroy() { }
}
class ContentPeon {
    constructor(option) {
        this._shouldUpdate = false;
        this.startIndex = option.startIndex;
        this.node = option.node;
        this.strings = option.strings;
    }
    setValue(values) {
        const newValue = injectValue2Strings(this.startIndex, this.strings, values);
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = injectValue2Strings(this.startIndex, this.strings, values);
    }
    destroy() { }
    commit() {
        if (!this._shouldUpdate)
            return;
        this.node.nodeValue = this._pendingValue;
        this._shouldUpdate = false;
    }
}
let eventOptionsSupported = false;
try {
    const options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
}
catch (_e) { }
class EventPeon {
    constructor(option) {
        this.value = undefined;
        this._pendingValue = undefined;
        this.node = option.node;
        this.name = option.name;
        this.notInWebComponent = option.notInWebComponent;
        this.startIndex = option.startIndex;
        this.eventContext = option.eventContext;
        this._boundHandleEvent = (e) => this.handleEvent(e);
    }
    static getOptions(o) {
        return o && (eventOptionsSupported
            ? {
                capture: o.capture,
                passive: o.passive,
                once: o.once
            }
            : o.capture);
    }
    setValue(values) {
        this._pendingValue = values[this.startIndex];
    }
    destroy() {
        this.node && this.node.removeEventListener(this.name, this._boundHandleEvent, this._options);
    }
    commit() {
        const newListener = this._pendingValue;
        const oldListener = this.value;
        const element = this.node;
        const shouldRemoveListener = newListener == null
            || oldListener != null
                && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            element.removeEventListener(this.name, this._boundHandleEvent, this._options);
        }
        if (shouldAddListener) {
            this._options = EventPeon.getOptions(newListener);
            element.addEventListener(this.name, this._boundHandleEvent, this._options);
        }
        this.value = newListener;
        // this._pendingValue = noChange;
    }
    handleEvent(event) {
        if (this.notInWebComponent) {
            Updater.isInBatchUpdating = true;
        }
        if (typeof this.value === 'function') {
            this
                .value
                .call(this.eventContext || this.node, event);
        }
        else {
            this
                .value
                .handleEvent(event);
        }
        if (this.notInWebComponent) {
            Updater.closeBatchUpdating();
        }
    }
}
class BooleanAttributePeon extends AttributePeon {
    constructor(option) {
        super(option);
        if (this.strings.length !== 2 || this.strings[0] !== '' || this.strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
    }
    setValue(values) {
        let newValue = values[this.startIndex];
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    }
    commit() {
        if (!this._shouldUpdate)
            return;
        const value = this._pendingValue;
        if (value) {
            this.node.setAttribute(this.name, '');
        }
        else {
            this.node.removeAttribute(this.name);
        }
        this._shouldUpdate = false;
    }
}
class PropertyPeon extends AttributePeon {
    constructor(option) {
        super(option);
        this.single =
            (this.strings.length === 2 && this.strings[0] === '' && this.strings[1] === '');
    }
    setValue(values) {
        let newValue;
        if (this.single) {
            newValue = values[this.startIndex];
        }
        else {
            newValue = injectValue2Strings(this.startIndex, this.strings, values);
        }
        if (newValue !== this._pendingValue) {
            this._shouldUpdate = true;
        }
        this._pendingValue = newValue;
    }
    commit() {
        if (!this._shouldUpdate)
            return;
        this
            .node[this.name] = this._pendingValue;
        this._shouldUpdate = false;
    }
}
export function createPeon(type, option) {
    switch (type) {
        case PeonType.Attribute:
            return new AttributePeon(option);
        case PeonType.Content:
            return new ContentPeon(option);
        case PeonType.Event:
            return new EventPeon(option);
        case PeonType.Property:
            return new PropertyPeon(option);
        case PeonType.BooleanAttribute:
            return new BooleanAttributePeon(option);
    }
}
