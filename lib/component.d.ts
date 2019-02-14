import { IComponent, ITemplateResult, ComponentProp, RenderOptions, Peon, ComponentSlotSchema } from './type';
export declare abstract class Component implements IComponent {
    private _mountFlag;
    state: ComponentProp;
    id: string;
    props: ComponentProp;
    fragment: DocumentFragment;
    part: Peon;
    _slots: ComponentSlotSchema;
    renderOption: RenderOptions;
    constructor(props: any);
    componentWillReceiveProps(nextProps: ComponentProp): void;
    componentShouldUpdate(nextProps: ComponentProp): boolean;
    abstract render(): ITemplateResult;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    _commit(): void;
    forceUpdate(callback?: () => void): void;
    setState(partialState?: Partial<ComponentProp>, callback?: () => void, isForce?: boolean): void;
}
