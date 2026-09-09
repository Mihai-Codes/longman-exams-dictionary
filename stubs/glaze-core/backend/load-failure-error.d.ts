export declare function createLoadFailureError(errorCode: number, errorDescription: string, url: string): Error;
export declare function createInvalidLoadURLError(url: string): Error;
export declare function isInvalidLoadURL(url: string): boolean;
export declare function isValidLoadURL(url: string): boolean;
export declare function normalizeLoadFailure(errorCode: number, errorDescription: string): {
    errno: number;
    code: string;
};
