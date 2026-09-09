export declare const textVariantConfig: {
    readonly heading1: {
        readonly size: 24;
        readonly lineHeight: 30;
        readonly weight: 600;
        readonly letterSpacing: -0.17;
    };
    readonly heading2: {
        readonly size: 18;
        readonly lineHeight: 24;
        readonly weight: 600;
        readonly letterSpacing: -0.12;
    };
    readonly "extra-large": {
        readonly size: 18;
        readonly lineHeight: 24;
        readonly weight: 400;
        readonly letterSpacing: -0.1;
    };
    readonly "extra-large-strong": {
        readonly size: 18;
        readonly lineHeight: 24;
        readonly weight: 500;
        readonly letterSpacing: -0.11;
    };
    readonly large: {
        readonly size: 16;
        readonly lineHeight: 22;
        readonly weight: 400;
        readonly letterSpacing: 0;
    };
    readonly "large-strong": {
        readonly size: 16;
        readonly lineHeight: 22;
        readonly weight: 500;
        readonly letterSpacing: 0.01;
    };
    readonly regular: {
        readonly size: 13;
        readonly lineHeight: 18;
        readonly weight: 400;
        readonly letterSpacing: 0.1;
    };
    readonly strong: {
        readonly size: 13;
        readonly lineHeight: 18;
        readonly weight: 500;
        readonly letterSpacing: 0.11;
    };
    readonly small: {
        readonly size: 11;
        readonly lineHeight: 14;
        readonly weight: 400;
        readonly letterSpacing: 0.1;
    };
    readonly "small-strong": {
        readonly size: 11;
        readonly lineHeight: 14;
        readonly weight: 500;
        readonly letterSpacing: 0.11;
    };
    readonly mini: {
        readonly size: 8;
        readonly lineHeight: 10;
        readonly weight: 400;
        readonly letterSpacing: 0.1;
    };
    readonly "mini-strong": {
        readonly size: 8;
        readonly lineHeight: 10;
        readonly weight: 500;
        readonly letterSpacing: 0.11;
    };
    readonly mono: {
        readonly size: 13;
        readonly lineHeight: 18;
        readonly weight: 400;
        readonly mono: true;
    };
    readonly "mono-strong": {
        readonly size: 13;
        readonly lineHeight: 18;
        readonly weight: 600;
        readonly mono: true;
    };
    readonly "small-mono": {
        readonly size: 11;
        readonly lineHeight: 14;
        readonly weight: 400;
        readonly mono: true;
    };
};
export type TextVariantName = keyof typeof textVariantConfig;
/** Class form of each variant (mono variants add the font family alongside the bundled utility). */
export declare const textVariantClasses: Record<TextVariantName, string>;
/** Font size per variant — drives the playground scale table. */
export declare const textVariantSizes: { [K in TextVariantName]: (typeof textVariantConfig)[K]["size"]; };
/** Font-size token names (numeric and variant forms) — registered in `cn`'s tailwind-merge config. */
export declare const TEXT_FONT_SIZE_TOKENS: readonly string[];
