export interface FileImageSize {
    width: number;
    height: number;
}
export interface FileImageOptions {
    /**
     * Logical CSS size. A number produces a square image. Each dimension must be
     * greater than 0 and no greater than 1024. Defaults to 32 for icon helpers
     * and 128 for thumbnails.
     */
    size?: number | FileImageSize;
    /**
     * Pixel density, greater than 0 and no greater than 4. Defaults to the
     * current display density, or 2 outside a renderer.
     */
    scaleFactor?: number;
}
export interface FileThumbnailOptions extends FileImageOptions {
    /** Use the native file icon when a preview is unavailable. Defaults to `"icon"`. */
    fallback?: "icon" | "none";
}
/**
 * Returns a renderer-safe URL for the native icon associated with a local file,
 * folder, or application bundle.
 * Use it directly as an `<img src>` instead of transferring base64 image data over IPC.
 * Existing files without custom artwork receive the system-associated file icon. A
 * missing path or image-generation failure rejects the image load and fires `onError`.
 * Use {@link getFileThumbnailUrl} for a Quick Look preview instead.
 *
 * @example Application icon
 * ```tsx
 * <img
 *   key={`${app.path}:${iconSize}`}
 *   src={getFileIconUrl(app.path, { size: iconSize })}
 *   width={iconSize}
 *   height={iconSize}
 *   className="object-contain"
 *   loading="lazy"
 *   decoding="async"
 *   draggable={false}
 *   onContextMenu={(event) => event.preventDefault()}
 * />
 * ```
 */
export declare function getFileIconUrl(filePath: string, options?: FileImageOptions): string;
/**
 * Returns a renderer-safe URL for a Quick Look preview of a local file.
 * The native file icon is returned when no preview exists unless `fallback` is `"none"`.
 * A missing path or unavailable preview with `fallback: "none"` rejects the image load
 * and fires `onError`.
 */
export declare function getFileThumbnailUrl(filePath: string, options?: FileThumbnailOptions): string;
