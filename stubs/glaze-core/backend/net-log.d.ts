export type NetLogCaptureMode = "default" | "includeSensitive" | "everything";
export interface NetLogStartLoggingOptions {
    captureMode?: NetLogCaptureMode;
    maxFileSize?: number;
}
export interface NetLogLike {
    readonly currentlyLogging: boolean;
    startLogging(path: string, options?: NetLogStartLoggingOptions): Promise<void>;
    stopLogging(): Promise<void>;
}
type NetLogState = {
    path: string;
    options: Required<Pick<NetLogStartLoggingOptions, "captureMode">> & Pick<NetLogStartLoggingOptions, "maxFileSize">;
    startedAt: string;
};
export declare class NetLog implements NetLogLike {
    private state;
    get currentlyLogging(): boolean;
    startLogging(path: string, options?: NetLogStartLoggingOptions): Promise<void>;
    private startLoggingWithState;
    stopLogging(): Promise<void>;
    /** @internal */
    _getState(): NetLogState | null;
}
export {};
