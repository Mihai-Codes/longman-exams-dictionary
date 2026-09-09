import { EventEmitter } from "node:events";
export interface Extension {
    id: string;
    manifest: unknown;
    name: string;
    path: string;
    version: string;
    url: string;
}
export interface LoadExtensionOptions {
    allowFileAccess?: boolean;
}
export interface ExtensionsEvents {
    "extension-loaded": (event: Event, extension: Extension) => void;
    "extension-unloaded": (event: Event, extension: Extension) => void;
    "extension-ready": (event: Event, extension: Extension) => void;
}
type ExtensionEventName = keyof ExtensionsEvents;
type SessionExtensionEmitter = (eventName: ExtensionEventName, extension: Extension) => void;
export declare class Extensions extends EventEmitter {
    private readonly emitSessionEvent?;
    private extensions;
    constructor(emitSessionEvent?: SessionExtensionEmitter | undefined);
    loadExtension(path: string, options?: LoadExtensionOptions): Promise<Extension>;
    removeExtension(extensionId: string): void;
    getExtension(extensionId: string): Extension | null;
    getAllExtensions(): Extension[];
    on<K extends keyof ExtensionsEvents>(event: K, listener: ExtensionsEvents[K]): this;
    once<K extends keyof ExtensionsEvents>(event: K, listener: ExtensionsEvents[K]): this;
    off<K extends keyof ExtensionsEvents>(event: K, listener: ExtensionsEvents[K]): this;
    emit<K extends keyof ExtensionsEvents>(event: K, ...args: Parameters<ExtensionsEvents[K]>): boolean;
    /** @internal */
    _registerExtension(extension: Extension): void;
    /** @internal */
    _clearExtensions(): void;
    private emitExtensionEvent;
}
export {};
