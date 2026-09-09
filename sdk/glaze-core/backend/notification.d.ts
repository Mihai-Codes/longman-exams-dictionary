/**
 * Notification - system notification API
 */
import { EventEmitter } from "events";
import { type NativeImage } from "./native-image.js";
export type NotificationActionType = "button" | "selection";
export type NotificationUrgency = "normal" | "critical" | "low";
export type NotificationTimeoutType = "default" | "never";
export interface NotificationAction {
    /**
     * Type of action button. Electron requires this field for setter conversion;
     * macOS only renders button actions.
     */
    type?: string;
    /**
     * Visible label for the action.
     */
    text?: string;
    /**
     * Selection item labels. Only meaningful on Windows; ignored by Glaze's macOS runtime.
     */
    items?: string[];
}
/**
 * Constructor options for Notification.
 */
export interface NotificationConstructorOptions {
    id?: string;
    groupId?: string;
    groupTitle?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    silent?: boolean;
    icon?: string | NativeImage;
    hasReply?: boolean;
    timeoutType?: string;
    replyPlaceholder?: string;
    sound?: string;
    urgency?: string;
    actions?: NotificationAction[];
    closeButtonText?: string;
    toastXml?: string;
}
export type NotificationActionEvent = Event & {
    actionIndex: number;
    selectionIndex: number;
};
export type NotificationReplyEvent = Event & {
    reply: string;
};
export interface NotificationEvents {
    show: (event: Event) => void;
    click: (event: Event) => void;
    close: (event: Event) => void;
    failed: (event: Event, error: string) => void;
    action: (details: NotificationActionEvent, actionIndex: number, selectionIndex: number) => void;
    reply: (details: NotificationReplyEvent, reply: string) => void;
}
/**
 * Create and control native system notifications.
 *
 * @example
 * ```typescript
 * const notification = new Notification({
 *   title: "Build complete",
 *   body: "Your app is ready",
 * });
 *
 * notification.on("click", () => {
 *   console.log("Notification clicked");
 * });
 *
 * notification.show();
 * ```
 */
export declare class Notification extends EventEmitter {
    private static notifications;
    private static nativeListenersInitialized;
    private showAttempt;
    private nativeNotificationScheduled;
    private isRestoredFromHistory;
    private readonly notificationId;
    private readonly notificationGroupId;
    private readonly notificationGroupTitle;
    private notificationTitle;
    private notificationSubtitle;
    private notificationBody;
    private notificationSilent;
    icon?: string | NativeImage;
    private notificationHasReply;
    private notificationTimeoutType;
    private notificationReplyPlaceholder;
    private notificationSound;
    private notificationUrgency;
    private notificationActions;
    private notificationCloseButtonText;
    private notificationToastXml;
    constructor(options?: NotificationConstructorOptions);
    get id(): string;
    get groupId(): string;
    get groupTitle(): string;
    get title(): string;
    set title(value: string);
    get subtitle(): string;
    set subtitle(value: string);
    get body(): string;
    set body(value: string);
    get silent(): boolean;
    set silent(value: boolean);
    get hasReply(): boolean;
    set hasReply(value: boolean);
    get timeoutType(): string;
    set timeoutType(value: string);
    get replyPlaceholder(): string;
    set replyPlaceholder(value: string);
    get sound(): string;
    set sound(value: string);
    get urgency(): string;
    set urgency(value: string);
    get actions(): NotificationAction[];
    set actions(value: NotificationAction[]);
    get closeButtonText(): string;
    set closeButtonText(value: string);
    get toastXml(): string;
    set toastXml(value: string);
    /**
     * Check if notifications are available on the current platform.
     */
    static isSupported(): boolean;
    /**
     * Return delivered notifications still present in Notification Center.
     */
    static getHistory(): Promise<Notification[]>;
    /**
     * Remove delivered notifications by identifier.
     */
    static remove(id: string | string[]): void;
    /**
     * Remove all delivered notifications for this app.
     */
    static removeAll(): void;
    /**
     * Remove delivered notifications by group identifier.
     */
    static removeGroup(groupId: string): void;
    /**
     * Display the notification.
     */
    show(): void;
    /**
     * Close the notification, if it is still visible.
     */
    close(): void;
    on<K extends keyof NotificationEvents>(event: K, listener: NotificationEvents[K]): this;
    once<K extends keyof NotificationEvents>(event: K, listener: NotificationEvents[K]): this;
    off<K extends keyof NotificationEvents>(event: K, listener: NotificationEvents[K]): this;
    emit<K extends keyof NotificationEvents>(event: K, ...args: Parameters<NotificationEvents[K]>): boolean;
    private static ensureNativeListeners;
    private static consumeNativeNotification;
    private closeCurrentNativeNotification;
}
