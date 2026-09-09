/**
 * Page-world nativeImage API
 *
 * Reuses createNativeImageAPI from the preload module, but calls it from the
 * page world with window.glazeAPI.glaze.ipc.invoke. This means NativeImageImpl
 * instances are created IN the page world — they never cross the serialization
 * boundary, so class methods survive.
 */
import { type NativeImage, type NativeImageAPI, type NativeImageCreateFromBitmapOptions, type NativeImageCreateFromBufferOptions, type NativeImageResizeOptions, type NativeImageToPNGOptions, type NativeImageToBitmapOptions, type NativeImageToDataURLOptions, type NativeImageAddRepresentationOptions, type Size, type Rectangle } from "../preload/native-image.js";
export type { NativeImage, NativeImageAPI, NativeImageCreateFromBitmapOptions, NativeImageCreateFromBufferOptions, NativeImageResizeOptions, NativeImageToPNGOptions, NativeImageToBitmapOptions, NativeImageToDataURLOptions, NativeImageAddRepresentationOptions, Size as NativeImageSize, Rectangle as NativeImageRectangle, };
/**
 * Module-level factory for creating and transforming native images.
 *
 * @example
 * ```ts
 * import { nativeImage } from "@glaze/core/utils";
 * const image = await nativeImage.createFromPath("/path/to/file.png");
 * console.log(image.isEmpty(), image.toDataURL(), image.getSize());
 * ```
 */
export declare const nativeImage: NativeImageAPI;
