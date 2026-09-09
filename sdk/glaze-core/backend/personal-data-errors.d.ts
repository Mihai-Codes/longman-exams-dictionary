export type PersonalDataErrorCode = "CAPABILITY_NOT_DECLARED" | "OPERATION_NOT_DECLARED" | "PERMISSION_LEVEL_NOT_DECLARED" | "USAGE_DESCRIPTION_NOT_DECLARED" | "PERMISSION_NOT_DETERMINED" | "PERMISSION_DENIED" | "FULL_ACCESS_REQUIRED" | "INVALID_RANGE" | "INVALID_FIELD" | "INVALID_REFERENCE" | "INVALID_CURSOR" | "NOT_FOUND" | "READ_ONLY_CALENDAR" | "VALIDATION_FAILED" | "SAVE_FAILED" | "SERIALIZATION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_PLATFORM" | "UNKNOWN";
export declare class PersonalDataError extends Error {
    readonly code: PersonalDataErrorCode;
    constructor(code: PersonalDataErrorCode, message: string, cause?: unknown);
}
export declare function mapPersonalDataError(error: unknown): PersonalDataError;
export declare function callPersonalDataNative<T>(operation: Promise<unknown>): Promise<T>;
