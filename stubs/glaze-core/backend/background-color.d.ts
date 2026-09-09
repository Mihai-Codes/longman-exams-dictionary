export interface NormalizedBackgroundColor {
    readonly rgbHex: string;
    readonly nativeHex: string;
}
export declare function normalizeBackgroundColor(color: unknown): NormalizedBackgroundColor;
export declare function normalizeOptionalBackgroundColor(color: unknown): NormalizedBackgroundColor | undefined;
