/**
 * NativeTheme - theme detection API
 *
 * Exposes theme state and update events from the native host.
 */
import { EventEmitter } from "events";
import { type NativeThemeInfo, type SystemPreferencesEffectiveAppearance } from "../ipc/native-api.js";
export type NativeThemeSource = "system" | "light" | "dark";
declare class NativeTheme extends EventEmitter {
    private _shouldUseDarkColors;
    private _themeSource;
    private _accentColor;
    private _shouldUseHighContrastColors;
    private _shouldUseDarkColorsForSystemIntegratedUI;
    private _shouldUseInvertedColorScheme;
    private _inForcedColorsMode;
    private _prefersReducedTransparency;
    private _shouldDifferentiateWithoutColor;
    private _initialized;
    private _nativeEventListenersSetup;
    constructor();
    /**
     * Initialize the native theme state
     * Called internally when the backend is ready
     */
    _initialize(): Promise<void>;
    private _setupNativeThemeListener;
    private _isThemeSource;
    private _validateThemeSource;
    private _applyThemeInfo;
    private _queueUpdated;
    private _queueUpdatedIfThemeChanged;
    private _snapshotThemeInfo;
    /**
     * Whether the system is currently in dark mode
     * @readonly
     */
    get shouldUseDarkColors(): boolean;
    /**
     * The system accent color as a hex string (e.g., "#007aff"), or `null`
     * when macOS is set to "Multicolour" — the frontend then falls back to
     * the active theme's accent.
     * @readonly
     */
    get accentColor(): string | null;
    /**
     * Whether high contrast colors should be used
     * @readonly
     */
    get shouldUseHighContrastColors(): boolean;
    /**
     * Whether system-integrated UI should use dark colors
     * @readonly
     */
    get shouldUseDarkColorsForSystemIntegratedUI(): boolean;
    /**
     * Whether inverted colors should be used
     * @readonly
     */
    get shouldUseInvertedColorScheme(): boolean;
    /**
     * Whether forced colors mode is active
     * @readonly
     */
    get inForcedColorsMode(): boolean;
    /**
     * Whether reduced transparency is preferred
     * @readonly
     */
    get prefersReducedTransparency(): boolean;
    /**
     * Whether UI should differentiate without color
     * @readonly
     */
    get shouldDifferentiateWithoutColor(): boolean;
    /**
     * The current theme source setting
     * Can be 'system', 'light', or 'dark'
     */
    get themeSource(): NativeThemeSource;
    /**
     * Set the theme source to override system settings
     */
    set themeSource(source: NativeThemeSource);
    private _setThemeSource;
    private _applyThemeSourceOverride;
    /**
     * Called by the native layer when the system theme changes
     * @internal
     */
    _onThemeUpdated(info: NativeThemeInfo): void;
    _getEffectiveAppearanceForSystemPreferences(): SystemPreferencesEffectiveAppearance;
}
/**
 * nativeTheme singleton
 */
export declare const nativeTheme: NativeTheme;
export {};
