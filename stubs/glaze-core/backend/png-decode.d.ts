export interface DecodedBitmap {
    width: number;
    height: number;
    /** 8-bit RGBA, alpha-premultiplied, row-major top-to-bottom. */
    data: Buffer;
}
export declare function decodePngToPremultipliedRGBA(buffer: Buffer): DecodedBitmap | null;
