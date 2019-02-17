import { IComponent, ITemplateResult, ComponentProp, RenderOptions, Peon, ComponentSlotSchema } from './type';
export declare abstract class Component implements IComponent {
    _mountFlag: boolean;
    state: ComponentProp;
    id: string;
    _mount: (node: Element | DocumentFragment) => void;
    _parentPart: Peon;
    _pendProps: ComponentProp;
    props: ComponentProp;
    fragment: DocumentFragment;
    part: Peon;
    _slots: ComponentSlotSchema;
    renderOption: RenderOptions;
    constructor(props: any);
    componentWillReceiveProps(nextProps: ComponentProp): void;
    componentShouldUpdate(nextProps: ComponentProp, nextState: ComponentProp): boolean;
    abstract render(): ITemplateResult;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    componentWillMount(): void;
    private _doRender;
    _firstCommit(): void;
    _commit(): void;
    forceUpdate(callback?: () => void): void;
    setState(partialState?: Partial<ComponentProp>, callback?: () => void): void;
}
