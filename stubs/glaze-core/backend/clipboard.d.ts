/**
 * Clipboard - clipboard API
 *
 * Clipboard operations including text, HTML, RTF, images, bookmarks, and raw pasteboard formats.
 */
import { Buffer } from "node:buffer";
import { type NativeImage } from "./native-image.js";
export type ClipboardPasteboardType = "clipboard" | "selection" | "general" | "find" | "drag" | "ruler" | "font" | (string & {});
export type ClipboardBuffer = ArrayBufferView;
/**
 * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView
 * instead for Electron-compatible clipboard.writeBuffer() behavior.
 */
export type ClipboardLegacyArrayBuffer = ArrayBuffer;
export type ClipboardBinaryValue = ClipboardBuffer | ClipboardLegacyArrayBuffer;
export type ClipboardCustomValue = string | ClipboardBinaryValue;
/**
 * NativeImage representation for clipboard operations
 * This is a simplified NativeImage representation used across the bridge.
 */
export interface ClipboardImage {
    /** Whether the image is empty */
    isEmpty: boolean;
    /** Data URL representation (data:image/png;base64,...) */
    toDataURL(): string;
    /** Get image size */
    getSize(): {
        width: number;
        height: number;
    };
}
export type ClipboardImageInput = ClipboardImage | NativeImage;
export interface ClipboardImageWriteOptions {
    formats?: Array<"png" | "tiff" | "pdf">;
    type?: ClipboardPasteboardType;
}
/**
 * Bookmark data (title + URL)
 */
export interface ClipboardBookmark {
    title: string;
    url: string;
}
/**
 * Data for clipboard.write() - write multiple formats at once
 */
export interface ClipboardWriteData {
    text?: string;
    html?: string;
    rtf?: string;
    bookmark?: string;
    image?: ClipboardImageInput | string | null;
    custom?: Record<string, ClipboardCustomValue>;
}
export interface ClipboardItemInfo {
    types: string[];
    name?: string;
}
export interface ClipboardChangeOptions {
    type?: ClipboardPasteboardType;
    intervalMs?: number;
}
export interface ClipboardPasteboard {
    readText(): string;
    readTextAsync(): Promise<string>;
    writeText(text: string): void;
    writeTextAsync(text: string): Promise<void>;
    readHTML(): string;
    readHTMLAsync(): Promise<string>;
    writeHTML(markup: string, text?: string): void;
    writeHTMLAsync(markup: string, text?: string): Promise<void>;
    readImage(): NativeImage;
    readImageAsync(): Promise<NativeImage>;
    writeImage(image: ClipboardImageInput | string | null, optionsOrType?: ClipboardImageWriteOptions | ClipboardPasteboardType): void;
    writeImageAsync(image: ClipboardImageInput | string | null, optionsOrType?: ClipboardImageWriteOptions | ClipboardPasteboardType): Promise<void>;
    readRTF(): string;
    readRTFAsync(): Promise<string>;
    writeRTF(text: string): void;
    writeRTFAsync(text: string): Promise<void>;
    readBookmark(): ClipboardBookmark;
    readBookmarkAsync(): Promise<ClipboardBookmark>;
    writeBookmark(title: string, url: string): void;
    writeBookmarkAsync(title: string, url: string): Promise<void>;
    clear(): void;
    clearAsync(): Promise<void>;
    availableFormats(): string[];
    availableFormatsAsync(): Promise<string[]>;
    has(format: string): boolean;
    hasAsync(format: string): Promise<boolean>;
    read(format: string): string;
    readAsync(format: string): Promise<string>;
    readBuffer(format: string): Buffer;
    readBufferAsync(format: string): Promise<Buffer>;
    writeBuffer(format: string, buffer: ClipboardBuffer): void;
    /**
     * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
     */
    writeBuffer(format: string, buffer: ClipboardLegacyArrayBuffer): void;
    writeBufferAsync(format: string, buffer: ClipboardBuffer): Promise<void>;
    /**
     * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
     */
    writeBufferAsync(format: string, buffer: ClipboardLegacyArrayBuffer): Promise<void>;
    write(data: ClipboardWriteData): void;
    writeAsync(data: ClipboardWriteData): Promise<void>;
    writeWebCustomFormats(formats: Record<string, ClipboardCustomValue>): Promise<void>;
    readWebCustomFormats(): Promise<Record<string, string>>;
    readFilePaths(): Promise<string[]>;
    writeFilePaths(paths: string[]): Promise<void>;
    changeCount(): Promise<number>;
    items(): Promise<ClipboardItemInfo[]>;
    onChange(listener: (formats: string[]) => void, options?: Omit<ClipboardChangeOptions, "type">): () => void;
}
declare function readText(type?: ClipboardPasteboardType): string;
declare function readTextAsync(type?: ClipboardPasteboardType): Promise<string>;
declare function writeText(text: string, type?: ClipboardPasteboardType): void;
declare function writeTextAsync(text: string, type?: ClipboardPasteboardType): Promise<void>;
declare function readHTML(type?: ClipboardPasteboardType): string;
declare function readHTMLAsync(type?: ClipboardPasteboardType): Promise<string>;
declare function writeHTML(markup: string, textOrType?: string, type?: ClipboardPasteboardType): void;
declare function writeHTMLAsync(markup: string, textOrType?: string, type?: ClipboardPasteboardType): Promise<void>;
declare function readRTF(type?: ClipboardPasteboardType): string;
declare function readRTFAsync(type?: ClipboardPasteboardType): Promise<string>;
declare function writeRTF(text: string, type?: ClipboardPasteboardType): void;
declare function writeRTFAsync(text: string, type?: ClipboardPasteboardType): Promise<void>;
declare function readImage(type?: ClipboardPasteboardType): NativeImage;
declare function readImageAsync(type?: ClipboardPasteboardType): Promise<NativeImage>;
declare function writeImage(image: ClipboardImageInput | string | null, optionsOrType?: ClipboardImageWriteOptions | ClipboardPasteboardType): void;
declare function writeImageAsync(image: ClipboardImageInput | string | null, optionsOrType?: ClipboardImageWriteOptions | ClipboardPasteboardType): Promise<void>;
declare function readBookmark(type?: ClipboardPasteboardType): ClipboardBookmark;
declare function readBookmarkAsync(type?: ClipboardPasteboardType): Promise<ClipboardBookmark>;
declare function writeBookmark(title: string, url: string, type?: ClipboardPasteboardType): void;
declare function writeBookmarkAsync(title: string, url: string, type?: ClipboardPasteboardType): Promise<void>;
declare function readFindText(): string;
declare function readFindTextAsync(): Promise<string>;
declare function writeFindText(text: string): void;
declare function writeFindTextAsync(text: string): Promise<void>;
declare function clear(type?: ClipboardPasteboardType): void;
declare function clearAsync(type?: ClipboardPasteboardType): Promise<void>;
declare function availableFormats(type?: ClipboardPasteboardType): string[];
declare function availableFormatsAsync(type?: ClipboardPasteboardType): Promise<string[]>;
declare function has(format: string, type?: ClipboardPasteboardType): boolean;
declare function hasAsync(format: string, type?: ClipboardPasteboardType): Promise<boolean>;
declare function read(format: string, type?: ClipboardPasteboardType): string;
declare function readAsync(format: string, type?: ClipboardPasteboardType): Promise<string>;
declare function readBuffer(format: string, type?: ClipboardPasteboardType): Buffer;
declare function readBufferAsync(format: string, type?: ClipboardPasteboardType): Promise<Buffer>;
declare function writeBuffer(format: string, buffer: ClipboardBuffer, type?: ClipboardPasteboardType): void;
/**
 * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
 */
declare function writeBuffer(format: string, buffer: ClipboardLegacyArrayBuffer, type?: ClipboardPasteboardType): void;
declare function writeBuffer(format: string, buffer: ClipboardBinaryValue, type?: ClipboardPasteboardType): void;
declare function writeBufferAsync(format: string, buffer: ClipboardBuffer, type?: ClipboardPasteboardType): Promise<void>;
/**
 * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
 */
declare function writeBufferAsync(format: string, buffer: ClipboardLegacyArrayBuffer, type?: ClipboardPasteboardType): Promise<void>;
declare function writeBufferAsync(format: string, buffer: ClipboardBinaryValue, type?: ClipboardPasteboardType): Promise<void>;
declare function write(data: ClipboardWriteData, type?: ClipboardPasteboardType): void;
declare function writeAsync(data: ClipboardWriteData, type?: ClipboardPasteboardType): Promise<void>;
declare function writeWebCustomFormats(formats: Record<string, ClipboardCustomValue>, type?: ClipboardPasteboardType): Promise<void>;
declare function readWebCustomFormats(type?: ClipboardPasteboardType): Promise<Record<string, string>>;
declare function readFilePaths(type?: ClipboardPasteboardType): Promise<string[]>;
declare function writeFilePaths(paths: string[], type?: ClipboardPasteboardType): Promise<void>;
declare function changeCount(type?: ClipboardPasteboardType): Promise<number>;
declare function items(type?: ClipboardPasteboardType): Promise<ClipboardItemInfo[]>;
declare function onChange(listener: (formats: string[]) => void, options?: ClipboardChangeOptions): () => void;
declare function pasteboard(type: ClipboardPasteboardType): ClipboardPasteboard;
export declare const clipboard: {
    readText: typeof readText;
    readTextAsync: typeof readTextAsync;
    writeText: typeof writeText;
    writeTextAsync: typeof writeTextAsync;
    readHTML: typeof readHTML;
    readHTMLAsync: typeof readHTMLAsync;
    writeHTML: typeof writeHTML;
    writeHTMLAsync: typeof writeHTMLAsync;
    readImage: typeof readImage;
    readImageAsync: typeof readImageAsync;
    writeImage: typeof writeImage;
    writeImageAsync: typeof writeImageAsync;
    readRTF: typeof readRTF;
    readRTFAsync: typeof readRTFAsync;
    writeRTF: typeof writeRTF;
    writeRTFAsync: typeof writeRTFAsync;
    readBookmark: typeof readBookmark;
    readBookmarkAsync: typeof readBookmarkAsync;
    writeBookmark: typeof writeBookmark;
    writeBookmarkAsync: typeof writeBookmarkAsync;
    readFindText: typeof readFindText;
    readFindTextAsync: typeof readFindTextAsync;
    writeFindText: typeof writeFindText;
    writeFindTextAsync: typeof writeFindTextAsync;
    clear: typeof clear;
    clearAsync: typeof clearAsync;
    availableFormats: typeof availableFormats;
    availableFormatsAsync: typeof availableFormatsAsync;
    has: typeof has;
    hasAsync: typeof hasAsync;
    read: typeof read;
    readAsync: typeof readAsync;
    readBuffer: typeof readBuffer;
    readBufferAsync: typeof readBufferAsync;
    writeBuffer: typeof writeBuffer;
    writeBufferAsync: typeof writeBufferAsync;
    write: typeof write;
    writeAsync: typeof writeAsync;
    writeWebCustomFormats: typeof writeWebCustomFormats;
    readWebCustomFormats: typeof readWebCustomFormats;
    readFilePaths: typeof readFilePaths;
    writeFilePaths: typeof writeFilePaths;
    changeCount: typeof changeCount;
    items: typeof items;
    onChange: typeof onChange;
    pasteboard: typeof pasteboard;
};
export {};
