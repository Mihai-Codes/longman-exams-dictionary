import { type ClipboardAPI, type ClipboardPasteboardType } from "../ipc/native-api.js";
export type { ClipboardAPI, ClipboardBinaryValue, ClipboardBookmark, ClipboardBuffer, ClipboardChangeOptions, ClipboardCustomValue, ClipboardImage, ClipboardImageInput, ClipboardImageWriteOptions, ClipboardItemInfo, ClipboardLegacyArrayBuffer, ClipboardPasteboardType, ClipboardWriteData, } from "../ipc/native-api.js";
export type ClipboardInvoke = (channel: string, ...args: any[]) => Promise<any>;
export declare function createClipboardAPI(invoke: ClipboardInvoke, type?: ClipboardPasteboardType): ClipboardAPI;
