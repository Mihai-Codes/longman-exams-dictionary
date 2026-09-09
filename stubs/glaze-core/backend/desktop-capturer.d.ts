/**
 * desktopCapturer - screen and window source enumeration.
 *
 * Provides Electron-shaped source metadata for desktop capture flows.
 */
import { type NativeImage, type Size } from "./native-image.js";
export type DesktopCapturerSourceType = "screen" | "window";
export interface SourcesOptions {
    types: DesktopCapturerSourceType[];
    thumbnailSize?: Size;
    fetchWindowIcons?: boolean;
}
export interface DesktopCapturerSource {
    id: string;
    name: string;
    thumbnail: NativeImage;
    display_id: string;
    appIcon: NativeImage | null;
}
declare function getSources(options: SourcesOptions): Promise<DesktopCapturerSource[]>;
export declare const desktopCapturer: {
    getSources: typeof getSources;
};
export {};
