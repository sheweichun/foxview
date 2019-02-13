


export function isString(val){
    return typeof val === 'string'
}

export const isPrimitive = (value: any) =>
    (value === null ||
     !(typeof value === 'object' || typeof value === 'function'));