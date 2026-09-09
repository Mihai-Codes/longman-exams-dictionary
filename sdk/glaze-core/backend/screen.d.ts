/**
 * Screen - display information API
 *
 * Provides information about screen size, displays, cursor position, etc.
 * Matches the screen module API.
 */
import { EventEmitter } from "events";
/**
 * Represents a point on the screen
 */
export interface Point {
    x: number;
    y: number;
}
/**
 * Represents a size
 */
export interface Size {
    width: number;
    height: number;
}
/**
 * Represents a rectangle
 */
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type DisplaySupport = "available" | "unavailable" | "unknown";
/**
 * Represents a display/monitor
 */
export interface Display {
    /**
     * Accelerometer support for this display
     */
    accelerometerSupport: DisplaySupport;
    /**
     * Unique identifier associated with the display
     */
    id: number;
    /**
     * The label of the display
     */
    label: string;
    /**
     * The bounds of the display in DIP points
     */
    bounds: Rectangle;
    /**
     * The work area of the display in DIP points (excludes dock/menubar)
     */
    workArea: Rectangle;
    /**
     * @deprecated Use scaleFactor instead.
     */
    accelerationFactor?: number;
    /**
     * Whether monochrome is detected
     */
    monochrome: boolean;
    /**
     * Color depth
     */
    colorDepth: number;
    /**
     * Color space (e.g., 'sRGB IEC61966-2.1')
     */
    colorSpace: string;
    /**
     * Depth per component
     */
    depthPerComponent: number;
    /**
     * Whether the display is currently detected by the system
     */
    detected: boolean;
    /**
     * Display frequency in Hz
     */
    displayFrequency: number;
    /**
     * Maximum cursor size in native pixels
     */
    maximumCursorSize: Size;
    /**
     * Origin in native pixel coordinates on platforms that expose one
     */
    nativeOrigin: Point;
    /**
     * The size of the display in pixels
     */
    size: Size;
    /**
     * The size of the work area
     */
    workAreaSize: Size;
    /**
     * Output device pixel scale factor
     */
    scaleFactor: number;
    /**
     * Display rotation in degrees (0, 90, 180, 270)
     */
    rotation: number;
    /**
     * Whether this is the internal display (built-in)
     */
    internal: boolean;
    /**
     * Touch support (not applicable on macOS)
     */
    touchSupport: DisplaySupport;
}
/**
 * Events emitted by the screen module
 */
export interface ScreenEvents {
    /**
     * Emitted when a new display has been added
     */
    "display-added": (event: Event, newDisplay: Display) => void;
    /**
     * Emitted when a display has been removed
     */
    "display-removed": (event: Event, oldDisplay: Display) => void;
    /**
     * Emitted when one or more metrics change for a display
     */
    "display-metrics-changed": (event: Event, display: Display, changedMetrics: ("bounds" | "workArea" | "scaleFactor" | "rotation")[]) => void;
}
declare class Screen extends EventEmitter {
    private _displays;
    private _initialized;
    private _nativeEventListenersSetup;
    constructor();
    private _setupNativeEventListeners;
    /**
     * Initialize the screen state
     * Called internally when the backend is ready
     */
    _initialize(): Promise<void>;
    /**
     * Refresh the display list from native
     */
    private _refreshDisplays;
    /**
     * Returns the current absolute position of the mouse pointer
     */
    getCursorScreenPoint(): Point;
    /**
     * @deprecated Use the synchronous `getCursorScreenPoint()` API.
     */
    getCursorScreenPointAsync(): Promise<Point>;
    /**
     * Returns the primary display
     */
    getPrimaryDisplay(): Display;
    /**
     * @deprecated Use the synchronous `getPrimaryDisplay()` API.
     */
    getPrimaryDisplayAsync(): Promise<Display>;
    /**
     * Returns an array of displays that are currently available
     */
    getAllDisplays(): Display[];
    /**
     * @deprecated Use the synchronous `getAllDisplays()` API.
     */
    getAllDisplaysAsync(): Promise<Display[]>;
    /**
     * Returns the display nearest the specified point
     */
    getDisplayNearestPoint(point: Point): Display;
    /**
     * @deprecated Use the synchronous `getDisplayNearestPoint()` API.
     */
    getDisplayNearestPointAsync(point: Point): Promise<Display>;
    /**
     * Returns the display that most closely intersects the provided bounds
     */
    getDisplayMatching(rect: Rectangle): Display;
    /**
     * @deprecated Use the synchronous `getDisplayMatching()` API.
     */
    getDisplayMatchingAsync(rect: Rectangle): Promise<Display>;
    /**
     * Called by the native layer when displays change
     * @internal
     */
    _onDisplayAdded(display: Display): void;
    /**
     * Called by the native layer when a display is removed
     * @internal
     */
    _onDisplayRemoved(display: Display): void;
    /**
     * Called by the native layer when display metrics change
     * @internal
     */
    _onDisplayMetricsChanged(display: Display, changedMetrics: ("bounds" | "workArea" | "scaleFactor" | "rotation")[]): void;
    private _setDisplays;
    private _mergeDisplay;
    private _primaryDisplay;
    private _assertDisplaysReady;
    private _cloneDisplay;
    private _normalizePoint;
    private _normalizeRect;
    private _normalizeGfxInteger;
    private _conversionError;
    private _insufficientArgumentsError;
    private _distanceToRect;
    private _intersectionArea;
}
/**
 * screen singleton
 */
export declare const screen: Screen;
export {};
