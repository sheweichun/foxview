import {typeOf} from './object';

export function hyphenate(str) {
    const strType = typeOf(str);
    if (strType !== 'String') {
        // warning(
        //     '[ hyphenate(str: string): string ] ' +
        //         `Expected arguments[0] to be a string but get a ${strType}.` +
        //         'It will return an empty string without any processing.'
        // );
        return '';
    }
    return str.replace(/([A-Z])/g, $0 => `-${$0.toLowerCase()}`);
}

export function camelcase(str) {
    if (!/-/.test(str)) {
        return str || '';
    }
    return str.toLowerCase().replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase());
}