import { EventEmitter } from "events";
import { type SaveDialogOptions } from "./dialog.js";
export type DownloadItemUpdateState = "progressing" | "interrupted";
export type DownloadItemDoneState = "completed" | "cancelled" | "interrupted";
export type DownloadItemState = DownloadItemUpdateState | DownloadItemDoneState;
export interface DownloadItemEvents {
    updated: (event: Event, state: DownloadItemUpdateState) => void;
    done: (event: Event, state: DownloadItemDoneState) => void;
}
export interface DownloadItemMetadata {
    url: string;
    urlChain?: string[];
    filename: string;
    mimeType?: string;
    contentDisposition?: string;
    totalBytes?: number;
    receivedBytes?: number;
    lastModifiedTime?: string;
    eTag?: string;
    hasUserGesture?: boolean;
    startTime?: number;
    initialState?: DownloadItemState;
    canResume?: boolean;
}
export declare class DownloadItem extends EventEmitter {
    private abortController;
    private state;
    private destroyed;
    private savePathMutable;
    private paused;
    private savePathValue;
    private saveDialogOptions;
    private resumeHandler;
    private resumeStarted;
    private receivedBytes;
    private totalBytes;
    private readonly startTime;
    private endTime;
    private currentBytesPerSecond;
    private speedWindowStartedAt;
    private speedWindowBytes;
    private pauseWaiters;
    private readonly url;
    private readonly urlChain;
    private readonly filename;
    private readonly mimeType;
    private readonly contentDisposition;
    private readonly lastModifiedTime;
    private readonly eTag;
    private readonly userGesture;
    private readonly resumable;
    constructor(metadata: DownloadItemMetadata);
    get savePath(): string;
    set savePath(path: string);
    setSavePath(path: string): void;
    getSavePath(): string;
    setSaveDialogOptions(options: SaveDialogOptions): void;
    getSaveDialogOptions(): SaveDialogOptions;
    pause(): void;
    isPaused(): boolean;
    resume(): void;
    canResume(): boolean;
    cancel(): void;
    getURL(): string;
    getMimeType(): string;
    hasUserGesture(): boolean;
    getFilename(): string;
    getCurrentBytesPerSecond(): number;
    getTotalBytes(): number;
    getReceivedBytes(): number;
    getPercentComplete(): number;
    getContentDisposition(): string;
    getState(): DownloadItemState;
    getURLChain(): string[];
    getLastModifiedTime(): string;
    getETag(): string;
    getStartTime(): number;
    getEndTime(): number;
    on<K extends keyof DownloadItemEvents>(event: K, listener: DownloadItemEvents[K]): this;
    once<K extends keyof DownloadItemEvents>(event: K, listener: DownloadItemEvents[K]): this;
    off<K extends keyof DownloadItemEvents>(event: K, listener: DownloadItemEvents[K]): this;
    emit<K extends keyof DownloadItemEvents>(event: K, ...args: Parameters<DownloadItemEvents[K]>): boolean;
    /** @internal */
    _setAbortController(abortController: AbortController): void;
    /** @internal */
    _setResumeHandler(handler: () => Promise<void> | void): void;
    /** @internal */
    _setTransferProgress(receivedBytes: number, totalBytes?: number): void;
    /** @internal */
    _setDefaultSavePath(path: string): void;
    /** @internal */
    _setChosenSavePath(path: string): void;
    /** @internal */
    _finishWillDownloadCallback(): void;
    /** @internal */
    _cancelFromPreventDefault(): void;
    /** @internal */
    _interrupt(): void;
    /** @internal */
    _downloadResponse(response: Response, options?: {
        append?: boolean;
    }): Promise<void>;
    /** @internal */
    _downloadFile(sourcePath: string): Promise<void>;
    private writeReader;
    private writeNodeStream;
    private writeChunks;
    private writeChunk;
    private waitWhilePaused;
    private resolvePauseWaiters;
    private updateCurrentSpeed;
    private finish;
    private isTerminal;
    private checkAlive;
    private checkSavePathMutable;
}
