import { IComponent, ITemplateResult, ComponentProp, RenderOptions, Peon, ComponentSlotSchema } from './type';
export declare abstract class Component implements IComponent {
    _mountFlag: boolean;
    state: ComponentProp;
    id: string;
    getSnapshotBeforeUpdate?(prevProps: ComponentProp, prevState: ComponentProp): any;
    _mount: (node: Element | DocumentFragment) => void;
    _parentPart: Peon;
    _pendProps: ComponentProp;
    props: ComponentProp;
    fragment: DocumentFragment;
    part: Peon;
    _slots: ComponentSlotSchema;
    renderOption: RenderOptions;
    constructor(props: any);
    /**
     * state的最新值取getDerivedStateFromProps的返回值
     * **/
    componentDidCatch?: (e: Error) => void;
    componentWillReceiveProps(nextProps: ComponentProp): void;
    shouldComponentUpdate(nextProps: ComponentProp, nextState: ComponentProp): boolean;
    abstract render(): ITemplateResult;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ComponentProp, prevState: ComponentProp, snapshot?: any): void;
    componentWillUnmount(): void;
    componentWillMount(): void;
    private _doRender;
    _firstCommit(): void;
    _commit(prevProps: ComponentProp, prevState: ComponentProp, snapshot?: any): void;
    forceUpdate(callback?: () => void): void;
    setState(partialState?: Partial<ComponentProp>, callback?: () => void): void;
}
