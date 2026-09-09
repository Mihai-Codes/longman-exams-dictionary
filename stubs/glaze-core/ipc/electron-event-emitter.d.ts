export type ElectronEventName = string | symbol;
export type ElectronEventListener = (...args: any[]) => void;
export declare class ElectronEventEmitter {
    private emitterEvents;
    private warnedEvents;
    private maxListeners;
    on(eventName: ElectronEventName, listener: ElectronEventListener): this;
    addListener(eventName: ElectronEventName, listener: ElectronEventListener): this;
    once(eventName: ElectronEventName, listener: ElectronEventListener): this;
    prependListener(eventName: ElectronEventName, listener: ElectronEventListener): this;
    prependOnceListener(eventName: ElectronEventName, listener: ElectronEventListener): this;
    off(eventName: ElectronEventName, listener: ElectronEventListener): this;
    removeListener(eventName: ElectronEventName, listener: ElectronEventListener): this;
    removeAllListeners(eventName?: ElectronEventName): this;
    emit(eventName: ElectronEventName, ...args: any[]): boolean;
    listeners(eventName: ElectronEventName): ElectronEventListener[];
    rawListeners(eventName: ElectronEventName): ElectronEventListener[];
    listenerCount(eventName: ElectronEventName, listener?: ElectronEventListener): number;
    eventNames(): ElectronEventName[];
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    private addEntry;
    private assertListener;
    private emitNewListener;
    private emitRemoveListener;
    private maybeEmitMaxListenersWarning;
    private formatReceived;
}
