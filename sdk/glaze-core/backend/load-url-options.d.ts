export type ReferrerPolicy = "default" | "unsafe-url" | "no-referrer-when-downgrade" | "no-referrer" | "origin" | "strict-origin-when-cross-origin" | "same-origin" | "strict-origin";
export interface Referrer {
    url: string;
    policy: ReferrerPolicy;
}
export interface UploadRawData {
    type: "rawData";
    bytes: Uint8Array | ArrayBuffer | readonly number[];
}
export interface UploadFile {
    type: "file";
    filePath: string;
    offset?: number;
    length?: number;
    modificationTime?: number;
}
export interface LoadURLOptions {
    httpReferrer?: string | Referrer;
    userAgent?: string;
    extraHeaders?: string;
    postData?: Array<UploadRawData | UploadFile>;
    baseURLForDataURL?: string;
}
type NativeLoadURLOptions = {
    httpReferrer?: string;
    referrerPolicy?: ReferrerPolicy;
    userAgent?: string;
    extraHeaders?: string;
    postData?: Array<{
        type: "rawData";
        bytes: string;
    } | UploadFile>;
    baseURLForDataURL?: string;
};
export declare function normalizeLoadURLOptions(options?: LoadURLOptions): NativeLoadURLOptions | undefined;
export {};
