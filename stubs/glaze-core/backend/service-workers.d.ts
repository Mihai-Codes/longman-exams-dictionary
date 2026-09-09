import { EventEmitter } from "node:events";
export type ServiceWorkerConsoleMessageSource = "javascript" | "xml" | "network" | "console-api" | "storage" | "rendering" | "security" | "deprecation" | "worker" | "violation" | "intervention" | "recommendation" | "other";
export type ServiceWorkerRunningStatus = "starting" | "running" | "stopping" | "stopped";
export interface ServiceWorkerInfo {
    scriptUrl: string;
    scope: string;
    renderProcessId: number;
    versionId: number;
}
export interface ServiceWorkerConsoleMessageDetails {
    message: string;
    versionId: number;
    source: ServiceWorkerConsoleMessageSource;
    level: number;
    sourceUrl: string;
    lineNumber: number;
}
export interface ServiceWorkerRegistrationCompletedDetails {
    scope: string;
}
export interface ServiceWorkerRunningStatusChangedDetails {
    versionId: number;
    runningStatus: ServiceWorkerRunningStatus;
}
export interface ServiceWorkerTask {
    end(): void;
}
export interface ServiceWorkersEvents {
    "console-message": (event: Event, messageDetails: ServiceWorkerConsoleMessageDetails) => void;
    "registration-completed": (event: Event, details: ServiceWorkerRegistrationCompletedDetails) => void;
    "running-status-changed": (details: ServiceWorkerRunningStatusChangedDetails) => void;
}
export declare class ServiceWorkerMain {
    private readonly info;
    private destroyed;
    private activeTasks;
    constructor(info: ServiceWorkerInfo);
    get scope(): string;
    get scriptURL(): string;
    get versionId(): number;
    get ipc(): null;
    isDestroyed(): boolean;
    send(channel: string, ..._args: unknown[]): void;
    startTask(): ServiceWorkerTask;
    /** @internal */
    _getInfo(): ServiceWorkerInfo;
    /** @internal */
    _getActiveTaskCount(): number;
    /** @internal */
    _destroy(): void;
}
export declare class ServiceWorkers extends EventEmitter {
    private workers;
    getAllRunning(): Record<number, ServiceWorkerInfo>;
    getInfoFromVersionID(versionId: number): ServiceWorkerInfo;
    getWorkerFromVersionID(versionId: number): ServiceWorkerMain | undefined;
    startWorkerForScope(scope: string): Promise<ServiceWorkerMain>;
    on<K extends keyof ServiceWorkersEvents>(event: K, listener: ServiceWorkersEvents[K]): this;
    once<K extends keyof ServiceWorkersEvents>(event: K, listener: ServiceWorkersEvents[K]): this;
    off<K extends keyof ServiceWorkersEvents>(event: K, listener: ServiceWorkersEvents[K]): this;
    emit<K extends keyof ServiceWorkersEvents>(event: K, ...args: Parameters<ServiceWorkersEvents[K]>): boolean;
    /** @internal */
    _registerWorker(info: ServiceWorkerInfo): ServiceWorkerMain;
    /** @internal */
    _clearWorkers(): void;
}
