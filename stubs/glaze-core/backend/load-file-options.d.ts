export interface LoadFileOptions {
    query?: Record<string, string>;
    search?: string;
    hash?: string;
}
export declare function formatLoadFileURL(filePath: string, options?: LoadFileOptions, appPath?: string): string;
