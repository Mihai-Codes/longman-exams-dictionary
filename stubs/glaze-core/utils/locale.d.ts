/**
 * The user's locale as configured in System Settings, including hour-cycle,
 * calendar and first-day-of-week overrides. `undefined` in environments where
 * the native host has not injected it — pass it to `Intl` anyway, which then
 * falls back to the runtime default.
 */
export declare function getSystemLocale(): string | undefined;
/**
 * Whether times should be displayed on a 12-hour clock with an AM/PM suffix.
 * Reads the bridged system locale, so it honours the macOS 24-hour-time toggle.
 */
export declare function prefersHour12(locale?: string | undefined): boolean;
