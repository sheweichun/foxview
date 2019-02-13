import { Peon } from './type';
export declare enum PeonType {
    Attribute = 0,
    Property = 1,
    Content = 2,
    Event = 3,
    BooleanAttribute = 4
}
export declare type PeonConstruct = {
    startIndex: number;
    name?: string;
    node: Element | Node;
    eventContext?: EventTarget;
    strings: Array<string> | string;
};
declare class AttributePeon implements Peon {
    startIndex: number;
    name: string;
    node: Element;
    _shouldUpdate: boolean;
    _pendingValue: string;
    strings: Array<string>;
    constructor(option: PeonConstruct);
    setValue(values: any): void;
    commit(): void;
}
declare class ContentPeon implements Peon {
    startIndex: number;
    strings: Array<string>;
    _shouldUpdate: boolean;
    _pendingValue: string;
    node: Node;
    constructor(option: PeonConstruct);
    setValue(values: any): void;
    commit(): void;
}
declare class EventPeon implements Peon {
    node: Element;
    name: string;
    startIndex: number;
    eventContext?: EventTarget;
    value: any;
    _options?: AddEventListenerOptions;
    _pendingValue: any;
    _boundHandleEvent: (event: Event) => void;
    constructor(option: PeonConstruct);
    static getOptions(o: any): any;
    setValue(values: any): void;
    commit(): void;
    handleEvent(event: Event): void;
}
export declare function createPeon(type: PeonType, option: PeonConstruct): AttributePeon | ContentPeon | EventPeon;
export {};
