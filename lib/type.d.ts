export interface TemplateStringsArray extends ReadonlyArray<string> {
    readonly raw: ReadonlyArray<string>;
}
export interface ComponentPrototype {
    render: () => string[];
}
