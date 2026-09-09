export declare class WindowLoadAbortedError extends Error {
    readonly errno = -3;
    readonly code = "ERR_ABORTED";
    readonly url: string;
    readonly cancellationReason = "window_destroyed";
    constructor(url: string);
}
export declare function isWindowLoadAbortedError(error: unknown): error is WindowLoadAbortedError;
