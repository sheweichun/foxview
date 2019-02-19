import { IComponent, ComponentProp } from './type';
declare type SetStateMapItem = {
    partialState: Partial<ComponentProp>;
    flushed?: boolean;
    instance: IComponent;
};
interface IUpdater {
    isInBatchUpdating: boolean;
    isInClosingUpdating: boolean;
    enqueueSetState: (instance: IComponent, partialState: Partial<ComponentProp>, callback: () => void, isForce: boolean) => void;
    closeBatchUpdating: () => void;
    performUpdate: (item: SetStateMapItem) => void;
}
declare const Updater: IUpdater;
export default Updater;
