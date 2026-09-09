import { EventEmitter } from "events";
import { type BrowserWindow } from "./browser-window.js";
import { type MenuPopupSourceType, type SharingItem } from "./menu.js";
import { type WebFrameMain } from "./web-frame-main.js";
export interface ShareMenuPopupOptions {
    browserWindow?: BrowserWindow;
    x?: number;
    y?: number;
    positioningItem?: number;
    callback?: () => void;
    /**
     * @deprecated Use `browserWindow` instead. This alias preserves older Glaze callers.
     */
    window?: BrowserWindow;
    /**
     * @deprecated This is a Glaze/Menu compatibility extension and is not part of ShareMenu popup options.
     */
    frame?: WebFrameMain;
    /**
     * @deprecated This is a Glaze/Menu compatibility extension and is not part of ShareMenu popup options.
     */
    sourceType?: MenuPopupSourceType;
    /**
     * @deprecated This is a Glaze/Menu compatibility extension and is not part of ShareMenu popup options.
     */
    minWidth?: number;
}
export declare class ShareMenu extends EventEmitter {
    private _menu;
    constructor(sharingItem: SharingItem);
    popup(options?: ShareMenuPopupOptions): void;
    closePopup(browserWindow?: BrowserWindow): void;
}
