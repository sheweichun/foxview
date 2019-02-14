import { IComponent, ComponentProp } from './type';
interface IUpdater {
    isInBatchUpdating: boolean;
    enqueueSetState: (instance: IComponent, partialState: Partial<ComponentProp>, callback: () => void, isForce: boolean) => void;
    closeBatchUpdating: () => void;
}
declare const Updater: IUpdater;
export default Updater;
