/**
 * nativeImage - image handling API
 *
 * Provides methods for creating, converting, and manipulating images.
 */
export interface Size {
    width: number;
    height: number;
}
export interface Rectangle extends Size {
    x: number;
    y: number;
}
export interface NativeImageCreateFromBitmapOptions {
    width: number;
    height: number;
    scaleFactor?: number;
}
export interface NativeImageCreateFromBufferOptions {
    width?: number;
    height?: number;
    scaleFactor?: number;
}
export interface NativeImageToPNGOptions {
    scaleFactor?: number;
}
export interface NativeImageToBitmapOptions {
    scaleFactor?: number;
}
export interface NativeImageToDataURLOptions {
    scaleFactor?: number;
}
export interface NativeImageResizeOptions {
    width?: number;
    height?: number;
    quality?: "good" | "better" | "best";
}
export interface NativeImageAddRepresentationOptions {
    scaleFactor?: number;
    width?: number;
    height?: number;
    buffer?: Buffer;
    dataURL?: string;
}
interface NativeImageNativeResult {
    dataURL?: string;
    size?: Size;
    representations?: Array<{
        dataURL?: string;
        scaleFactor?: number;
        size?: Size;
    }>;
}
declare class NativeImageImpl {
    private readonly representations;
    private templateImage;
    private constructor();
    static empty(): NativeImageImpl;
    static fromNativeResult(result: NativeImageNativeResult, scaleFactor?: number, templateImage?: boolean, bitmap?: Buffer): NativeImageImpl;
    isEmpty(): boolean;
    getSize(scaleFactor?: number): Size;
    getAspectRatio(scaleFactor?: number): number;
    getScaleFactors(): number[];
    toDataURL(options?: NativeImageToDataURLOptions): string;
    toPNG(options?: NativeImageToPNGOptions): Buffer;
    /**
     * @deprecated Use toPNG(). This preserves the old Glaze Promise shape and native conversion path.
     */
    toPNGAsync(options?: NativeImageToPNGOptions): Promise<Buffer>;
    toJPEG(quality: number): Buffer;
    /**
     * @deprecated Use toJPEG(). This preserves the old Glaze Promise shape and native conversion path.
     */
    toJPEGAsync(quality: number): Promise<Buffer>;
    toBitmap(options?: NativeImageToBitmapOptions): Buffer;
    /**
     * @deprecated Use toBitmap(). This preserves the old Glaze Promise shape and native conversion path.
     */
    toBitmapAsync(options?: NativeImageToBitmapOptions): Promise<Buffer>;
    getBitmap(options?: NativeImageToBitmapOptions): Buffer;
    /**
     * @deprecated Use getBitmap(). This preserves the old Glaze Promise shape and native conversion path.
     */
    getBitmapAsync(options?: NativeImageToBitmapOptions): Promise<Buffer>;
    getNativeHandle(): Promise<Buffer>;
    setTemplateImage(option: boolean): void;
    isTemplateImage(): boolean;
    get isMacTemplateImage(): boolean;
    set isMacTemplateImage(value: boolean);
    crop(rect: Rectangle): Promise<NativeImageImpl>;
    resize(options: NativeImageResizeOptions): Promise<NativeImageImpl>;
    private setRepresentation;
    addRepresentation(options: NativeImageAddRepresentationOptions): void;
    /**
     * @deprecated Use addRepresentation(). This preserves the old Glaze Promise shape for callers that need native decode.
     */
    addRepresentationAsync(options: NativeImageAddRepresentationOptions): Promise<void>;
}
export type NativeImage = NativeImageImpl;
export declare function isNativeImage(value: unknown): value is NativeImage;
export declare function createNativeImageFromNativeResult(result: NativeImageNativeResult, scaleFactor?: number, templateImage?: boolean): NativeImage;
declare function createEmpty(): NativeImage;
declare function createFromPath(path: string): NativeImage;
/**
 * @deprecated Use createFromPath(). This preserves the old Glaze Promise shape for renderer IPC.
 */
declare function createFromPathAsync(path: string): Promise<NativeImage>;
declare function createFromBitmap(buffer: Buffer, options: NativeImageCreateFromBitmapOptions): NativeImage;
/**
 * @deprecated Use createFromBitmap(). This preserves the old Glaze Promise shape for renderer IPC.
 */
declare function createFromBitmapAsync(buffer: Buffer, options: NativeImageCreateFromBitmapOptions): Promise<NativeImage>;
declare function createFromBuffer(buffer: Buffer, options?: NativeImageCreateFromBufferOptions): NativeImage;
/**
 * @deprecated Use createFromBuffer(). This preserves the old Glaze Promise shape for renderer IPC.
 */
declare function createFromBufferAsync(buffer: Buffer, options?: NativeImageCreateFromBufferOptions): Promise<NativeImage>;
declare function createFromDataURL(dataURL: string): NativeImage;
/**
 * @deprecated Use createFromDataURL(). This preserves the old Glaze Promise shape for renderer IPC.
 */
declare function createFromDataURLAsync(dataURL: string): Promise<NativeImage>;
declare function createFromNamedImage(imageName: string, hslShift?: number[]): NativeImage;
/**
 * @deprecated Use createFromNamedImage(). This preserves the old Glaze Promise shape and native bridge path.
 */
declare function createFromNamedImageAsync(imageName: string, hslShift?: number[]): Promise<NativeImage>;
declare function createThumbnailFromPath(path: string, size: Size): Promise<NativeImage>;
export declare const nativeImage: {
    createEmpty: typeof createEmpty;
    createThumbnailFromPath: typeof createThumbnailFromPath;
    createFromPath: typeof createFromPath;
    createFromPathAsync: typeof createFromPathAsync;
    createFromBitmap: typeof createFromBitmap;
    createFromBitmapAsync: typeof createFromBitmapAsync;
    createFromBuffer: typeof createFromBuffer;
    createFromBufferAsync: typeof createFromBufferAsync;
    createFromDataURL: typeof createFromDataURL;
    createFromDataURLAsync: typeof createFromDataURLAsync;
    createFromNamedImage: typeof createFromNamedImage;
    createFromNamedImageAsync: typeof createFromNamedImageAsync;
};
export {};
