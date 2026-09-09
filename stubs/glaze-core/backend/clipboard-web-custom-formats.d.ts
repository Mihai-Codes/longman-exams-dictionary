type ClipboardBuffer = ArrayBufferView;
/**
 * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
 */
type ClipboardLegacyArrayBuffer = ArrayBuffer;
type ClipboardBinaryValue = ClipboardBuffer | ClipboardLegacyArrayBuffer;
type ClipboardCustomValue = string | ClipboardBinaryValue;
export declare function encodeWebCustomFormats(formats: Record<string, ClipboardCustomValue>): Uint8Array;
export declare function decodeWebCustomFormats(buffer: Uint8Array | ArrayBuffer): Record<string, string>;
export {};
