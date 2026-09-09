/**
 * safeStorage - secure storage API
 *
 * Provides simple encrypt/decrypt helpers backed by the native runtime storage backend.
 */
export type SafeStorageDecryptionResult = {
    result: string;
    shouldReEncrypt: boolean;
};
declare function isEncryptionAvailable(): Promise<boolean>;
declare function isAsyncEncryptionAvailable(): Promise<boolean>;
declare function encryptString(plainText: string): Promise<Buffer>;
declare function encryptStringAsync(plainText: string): Promise<Buffer>;
declare function decryptString(encrypted: Buffer): Promise<string>;
declare function decryptStringAsync(encrypted: Buffer): Promise<SafeStorageDecryptionResult>;
declare function setUsePlainTextEncryption(usePlainText: boolean): Promise<void>;
declare function getSelectedStorageBackend(): Promise<string>;
export declare const safeStorage: {
    isEncryptionAvailable: typeof isEncryptionAvailable;
    isAsyncEncryptionAvailable: typeof isAsyncEncryptionAvailable;
    encryptString: typeof encryptString;
    encryptStringAsync: typeof encryptStringAsync;
    decryptString: typeof decryptString;
    decryptStringAsync: typeof decryptStringAsync;
    setUsePlainTextEncryption: typeof setUsePlainTextEncryption;
    getSelectedStorageBackend: typeof getSelectedStorageBackend;
};
export {};
