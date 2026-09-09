import { type CPUUsage } from "./app.js";
export interface ProcessHeapStatistics {
    totalHeapSize: number;
    totalHeapSizeExecutable: number;
    totalPhysicalSize: number;
    totalAvailableSize: number;
    usedHeapSize: number;
    heapSizeLimit: number;
    mallocedMemory: number;
    peakMallocedMemory: number;
    doesZapGarbage: boolean;
}
export interface BlinkMemoryInfo {
    allocated: number;
    total: number;
}
export interface ProcessMemoryInfo {
    residentSet?: number;
    private: number;
    shared: number;
}
export interface SystemMemoryInfo {
    total: number;
    free: number;
    fileBacked?: number;
    purgeable?: number;
    swapTotal?: number;
    swapFree?: number;
}
declare global {
    namespace NodeJS {
        interface Process {
            readonly defaultApp: boolean | undefined;
            readonly mas: boolean | undefined;
            noAsar: boolean;
            readonly parentPort: null;
            readonly resourcesPath: string;
            readonly type: "browser";
            readonly windowsStore: boolean | undefined;
            crash(): void;
            hang(): void;
            getCreationTime(): number | null;
            getCPUUsage(): CPUUsage;
            getHeapStatistics(): ProcessHeapStatistics;
            getBlinkMemoryInfo(): BlinkMemoryInfo;
            getProcessMemoryInfo(): Promise<ProcessMemoryInfo>;
            getSystemMemoryInfo(): SystemMemoryInfo;
            getSystemVersion(): string;
            takeHeapSnapshot(filePath: string): boolean;
            addListener(event: "loaded", listener: () => void): this;
            addListener(event: string | symbol, listener: (...args: any[]) => void): this;
            emit(event: "loaded"): boolean;
            emit(event: string | symbol, ...args: any[]): boolean;
            off(event: "loaded", listener: () => void): this;
            off(event: string | symbol, listener: (...args: any[]) => void): this;
            on(event: "loaded", listener: () => void): this;
            on(event: string | symbol, listener: (...args: any[]) => void): this;
            once(event: "loaded", listener: () => void): this;
            once(event: string | symbol, listener: (...args: any[]) => void): this;
            prependListener(event: "loaded", listener: () => void): this;
            prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
            prependOnceListener(event: "loaded", listener: () => void): this;
            prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
            removeListener(event: "loaded", listener: () => void): this;
            removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
        }
    }
}
export declare function installProcessExtensions(): void;
