import { type NativeImage, type Size } from "./native-image.js";
export interface SerializedNativeImage {
    isEmpty: boolean;
    dataURL: string;
    size: Size;
    representations: Array<{
        dataURL: string;
        scaleFactor: number;
        size: Size;
    }>;
    scaleFactors: number[];
    isTemplate: boolean;
}
export declare function serializeNativeImageForIPC(image: NativeImage): SerializedNativeImage;
