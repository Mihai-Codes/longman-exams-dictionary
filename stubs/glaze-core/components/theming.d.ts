/**
 * Theme model and injection.
 *
 * A theme is a flat object of metadata + primary colors + support colors.
 * Applying a theme injects one class-scoped CSS rule that overrides the
 * seed variables (`--bg`, `--fg`, …) everything else derives from. The
 * static `:root`/`.dark` values in styles.css are the default light/dark
 * themes and act as fallbacks when no theme is injected.
 *
 * Accent precedence is a pure CSS fallback chain:
 *   --accent: var(--color-system-accent, var(--theme-accent));
 * Themes write `--theme-accent`; the system accent (when injected) wins,
 * including over an active theme's accent.
 */
export type ColorHex = string;
export type Appearance = "light" | "dark";
export type ThemeMetadata = {
    id: string;
    name: string;
    isBundled?: boolean;
    appearance: Appearance;
};
export type ThemePrimaryColors<C = ColorHex> = {
    background: C;
    backgroundSecondary: C;
    foreground: C;
    accent: C;
    selection: C;
    loader: C;
};
export type PrimaryColorKey = keyof ThemePrimaryColors;
export type ThemeSupportColors<C = ColorHex> = {
    red: C;
    orange: C;
    yellow: C;
    green: C;
    blue: C;
    purple: C;
    magenta: C;
};
export type SupportColorKey = keyof ThemeSupportColors;
export type Theme<C = ColorHex> = ThemeMetadata & ThemePrimaryColors<C> & ThemeSupportColors<C>;
/** Matches the static `:root` seed values in styles.css. */
export declare const DEFAULT_LIGHT_THEME: Theme;
/** Matches the static `.dark` seed values in styles.css. */
export declare const DEFAULT_DARK_THEME: Theme;
export declare function isDefaultTheme(theme: Theme): boolean;
export declare const ACTIVE_THEME_CLASS = "active-theme";
export declare const ACTIVE_THEME_STYLE_ELEMENT_ID = "active-theme";
/** Black for light/yellow accents, white for everything else. */
export declare function computeAccentContrastColor(hex: ColorHex): ColorHex;
/**
 * Builds the seed-variable override rule for a theme. Scoped as
 * `:root.<className>` so it beats the static `:root`/`.dark` defaults
 * regardless of stylesheet order (important for pre-paint injection,
 * where the rule is inserted before the bundled CSS).
 */
export declare function makeThemeCssRule(theme: Theme, className?: string): string;
/**
 * Applies a theme to this window: injects the seed override rule and
 * syncs the `dark` class to the theme's appearance. The caller is
 * responsible for switching the native window appearance (so the
 * material behind the WebView matches) — e.g. via nativeTheme.setThemeSource.
 */
export declare function injectActiveTheme(theme: Theme): void;
/** Removes any injected theme, falling back to the static default light/dark seeds. */
export declare function clearActiveTheme(): void;
/**
 * Injects (or clears) the system accent color. It feeds the `--accent`
 * fallback chain and wins over the active theme's accent.
 */
export declare function applySystemAccentColor(hex: ColorHex | null): void;
/**
 * Re-syncs the inline accent properties to the last known system accent
 * (used after theme injection). Also runs when no accent is known —
 * `null` means macOS "Multicolour" and any stale inline accent (e.g. from
 * a pre-paint script) must be cleared so the theme's accent wins.
 */
export declare function injectSystemAccentColorIfAvailable(): void;
