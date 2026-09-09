/**
 * NativeImage preload helper
 *
 * Provides a renderer-safe nativeImage wrapper powered by ipcRenderer.invoke().
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
    buffer?: Uint8Array | ArrayBuffer;
    dataURL?: string;
}
export interface NativeImage {
    isEmpty(): boolean;
    getSize(scaleFactor?: number): Size;
    getAspectRatio(scaleFactor?: number): number;
    getScaleFactors(): number[];
    toDataURL(options?: NativeImageToDataURLOptions): string;
    toPNG(options?: NativeImageToPNGOptions): Promise<Uint8Array>;
    toJPEG(quality: number): Promise<Uint8Array>;
    toBitmap(options?: NativeImageToBitmapOptions): Promise<Uint8Array>;
    getBitmap(options?: NativeImageToBitmapOptions): Promise<Uint8Array>;
    getNativeHandle(): Promise<Uint8Array>;
    setTemplateImage(option: boolean): void;
    isTemplateImage(): boolean;
    isMacTemplateImage: boolean;
    crop(rect: Rectangle): Promise<NativeImage>;
    resize(options: NativeImageResizeOptions): Promise<NativeImage>;
    addRepresentation(options: NativeImageAddRepresentationOptions): Promise<void>;
}
export interface NativeImageAPI {
    createEmpty(): NativeImage;
    createThumbnailFromPath(path: string, size: Size): Promise<NativeImage>;
    createFromPath(path: string): Promise<NativeImage>;
    createFromBitmap(buffer: Uint8Array | ArrayBuffer, options: NativeImageCreateFromBitmapOptions): Promise<NativeImage>;
    createFromBuffer(buffer: Uint8Array | ArrayBuffer, options?: NativeImageCreateFromBufferOptions): Promise<NativeImage>;
    createFromDataURL(dataURL: string): Promise<NativeImage>;
    createFromNamedImage(imageName: string, hslShift?: number[]): Promise<NativeImage>;
}
export type NativeImageInvoke = <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
interface NativeImageRepresentation {
    scaleFactor: number;
    dataURL: string;
    size: Size;
}
/**
 * Builds a full preload `NativeImage` from a clipboard/native serialized result
 * (`{ isEmpty, dataURL/data, size }`). Used so renderer `clipboard.readImage()`
 * returns a real NativeImage (toPNG/toBitmap/resize/crop) rather than a minimal
 * shape — matching Electron. Returns an empty NativeImage when the result is
 * empty or missing a dataURL.
 */
export declare function createNativeImageFromSerialized(result: {
    isEmpty?: boolean;
    dataURL?: string;
    data?: string;
    size?: Size;
    representations?: NativeImageRepresentation[];
    isTemplate?: boolean;
} | null | undefined, invoke: NativeImageInvoke): NativeImage;
export declare function createNativeImageAPI(invoke: NativeImageInvoke): NativeImageAPI;
export {};
