import { IComponent, ITemplateResult, ComponentProp, RenderOptions, Peon, ComponentSlotSchema } from './type';
export declare abstract class Component implements IComponent {
    private _mountFlag;
    state: ComponentProp;
    props: ComponentProp;
    fragment: DocumentFragment;
    part: Peon;
    _slots: ComponentSlotSchema;
    renderOption: RenderOptions;
    componentWillReceiveProps(nextProps: ComponentProp): void;
    abstract render(): ITemplateResult;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    _commit(): void;
    setState(partialState: ComponentProp): void;
}
