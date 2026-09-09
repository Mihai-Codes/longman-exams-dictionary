import { EventEmitter } from "node:events";
export type CalendarAuthorizationStatus = "not-determined" | "denied" | "restricted" | "write-only" | "full-access" | "unknown";
export type CalendarAccessLevel = "write-only" | "full";
export type CalendarEntityType = "event" | "reminder";
export interface CalendarSourceInfo {
    id: string;
    title: string;
    type: "local" | "exchange" | "caldav" | "mobileme" | "subscribed" | "birthdays" | "unknown";
    isDelegate: boolean;
}
export interface CalendarInfo {
    id: string;
    title: string;
    color: string | null;
    type: "local" | "caldav" | "exchange" | "subscription" | "birthday" | "unknown";
    source: string | null;
    sourceId: string;
    entityTypes: CalendarEntityType[];
    supportedAvailabilities: Array<"busy" | "free" | "tentative" | "unavailable">;
    allowsContentModifications: boolean;
    isSubscribed: boolean;
    isImmutable: boolean;
}
export type EventTime = {
    kind: "date";
    date: string;
} | {
    kind: "date-time";
    dateTime: string;
    timeZone: string | null;
};
export interface EventRef {
    /**
     * Opaque and versioned. Do not parse it or treat it as a stable EventKit identifier.
     * A mutation may return a replacement ref; always retain the ref from the latest returned event.
     */
    value: string;
}
export interface StructuredLocation {
    /** Also exposed as `CalendarEvent.location`; EventKit stores both as the same title. */
    title: string;
    latitude: number | null;
    longitude: number | null;
    radiusMeters: number;
}
export interface CalendarParticipant {
    name: string | null;
    url: string;
    status: "unknown" | "pending" | "accepted" | "declined" | "tentative" | "delegated" | "completed" | "in-process";
    role: "unknown" | "required" | "optional" | "chair" | "non-participant";
    type: "unknown" | "person" | "room" | "resource" | "group";
    isCurrentUser: boolean;
}
export type CalendarAlarm = {
    kind: "relative";
    /** Signed minutes before the item. Negative values represent an alarm after it starts. */
    offsetMinutes: number;
    proximity: "none" | "enter" | "leave" | "unknown";
    structuredLocation: StructuredLocation | null;
    type: "display" | "audio" | "procedure" | "email" | "unknown";
    emailAddress: string | null;
    soundName: string | null;
} | {
    kind: "absolute";
    /** RFC 3339 instant. */
    dateTime: string;
    proximity: "none" | "enter" | "leave" | "unknown";
    structuredLocation: StructuredLocation | null;
    type: "display" | "audio" | "procedure" | "email" | "unknown";
    emailAddress: string | null;
    soundName: string | null;
};
/** Shorthand accepted for compatibility with the original relative-alarm API. */
export interface CalendarEventAlarm {
    /** Signed minutes before the item. Negative values represent an alarm after it starts. */
    offsetMinutes: number;
}
export type CalendarAlarmInput = CalendarEventAlarm | {
    kind: "relative";
    offsetMinutes: number;
    proximity?: "none" | "enter" | "leave";
    structuredLocation?: StructuredLocation;
} | {
    kind: "absolute";
    dateTime: string;
    proximity?: "none" | "enter" | "leave";
    structuredLocation?: StructuredLocation;
};
export type CalendarWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export interface RecurrenceDayOfWeek {
    /** Sunday is 1 and Saturday is 7, matching EventKit. */
    dayOfWeek: CalendarWeekday;
    /** Optional ordinal, such as 1 for first or -1 for last. Zero means no ordinal. */
    weekNumber: number;
}
export type RecurrenceEnd = {
    kind: "count";
    count: number;
} | {
    kind: "date";
    dateTime: string;
};
export interface RecurrenceRule {
    calendarIdentifier: string;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    firstDayOfWeek: CalendarWeekday | null;
    daysOfTheWeek: RecurrenceDayOfWeek[];
    daysOfTheMonth: number[];
    daysOfTheYear: number[];
    weeksOfTheYear: number[];
    monthsOfTheYear: number[];
    setPositions: number[];
    end: RecurrenceEnd | null;
}
export interface RecurrenceRuleInput {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    /** Defaults to 1. */
    interval?: number;
    daysOfTheWeek?: RecurrenceDayOfWeek[];
    daysOfTheMonth?: number[];
    daysOfTheYear?: number[];
    weeksOfTheYear?: number[];
    monthsOfTheYear?: number[];
    setPositions?: number[];
    end?: RecurrenceEnd | null;
}
export interface CalendarEvent {
    ref: EventRef;
    externalId: string | null;
    calendarId: string;
    title: string;
    start: EventTime;
    /** Exclusive boundary. A one-day all-day event on 2026-07-22 ends on 2026-07-23. */
    end: EventTime;
    /** The title of `structuredLocation`, or the plain location when no coordinates are attached. */
    location: string | null;
    structuredLocation: StructuredLocation | null;
    notes: string | null;
    url: string | null;
    creationDate: string | null;
    lastModifiedDate: string | null;
    availability: "not-supported" | "busy" | "free" | "tentative" | "unavailable" | "unknown";
    status: "none" | "confirmed" | "tentative" | "canceled" | "unknown";
    isDetached: boolean;
    occurrenceDate: string | null;
    birthdayContactId: string | null;
    organizer: CalendarParticipant | null;
    attendees: CalendarParticipant[];
    alarms: CalendarAlarm[];
    recurrenceRules: RecurrenceRule[];
}
export interface GetEventsOptions {
    /** Inclusive RFC 3339 query boundary. Events overlapping the range are returned without clamping their times. */
    start: string;
    /** Exclusive RFC 3339 query boundary. Must be after start and no more than four years later. */
    end: string;
    calendarIds?: string[];
    limit?: number;
}
export interface GetEventsResult {
    events: CalendarEvent[];
    truncated: boolean;
}
export interface CreateEventInput {
    title: string;
    start: EventTime;
    /** Exclusive boundary. A one-day all-day event on 2026-07-22 ends on 2026-07-23. */
    end: EventTime;
    /** Omit under write-only access so Glaze can use the user's default event calendar. */
    calendarId?: string;
    /** Plain location title. Ignored when structuredLocation is also supplied. */
    location?: string;
    /** Structured location and title. Takes precedence over location when both are supplied. */
    structuredLocation?: StructuredLocation;
    notes?: string;
    url?: string;
    availability?: "busy" | "free" | "tentative" | "unavailable";
    alarms?: CalendarAlarmInput[];
    recurrenceRules?: RecurrenceRuleInput[];
}
export interface CreateEventResult {
    /** Null under write-only access because the app is not allowed to read the saved event. */
    reference: EventRef | null;
}
export type EventMutationSpan = "this-event" | "future-events";
/** `location` and `structuredLocation` are aliases in EventKit; clearing either clears both. */
export type ClearableEventField = "location" | "structuredLocation" | "notes" | "url" | "alarms" | "recurrenceRules";
export interface UpdateEventPatch {
    title?: string;
    start?: EventTime;
    /** Exclusive boundary. A one-day all-day event on 2026-07-22 ends on 2026-07-23. */
    end?: EventTime;
    calendarId?: string;
    /** Plain location title. Ignored when structuredLocation is also supplied. */
    location?: string;
    /** Structured location and title. Takes precedence over location when both are supplied. */
    structuredLocation?: StructuredLocation;
    notes?: string;
    url?: string;
    availability?: "busy" | "free" | "tentative" | "unavailable";
    alarms?: CalendarAlarmInput[];
    recurrenceRules?: RecurrenceRuleInput[];
    clearFields?: ClearableEventField[];
}
export interface CreateCalendarInput {
    title: string;
    sourceId?: string;
    color?: string;
}
export interface UpdateCalendarPatch {
    title?: string;
    color?: string;
}
export declare function validateRFC3339(value: string, name: string): void;
export declare function validateEventTime(value: EventTime, name: string): void;
export declare function validateLimit(limit: number | undefined, fallback: number, maximum: number): number;
export declare function validateAlarms(alarms: CalendarAlarmInput[] | undefined): void;
export declare function validateRecurrenceRules(rules: RecurrenceRuleInput[] | undefined): void;
declare class CalendarAPI extends EventEmitter {
    constructor();
    status(): Promise<CalendarAuthorizationStatus>;
    requestAccess(level: CalendarAccessLevel): Promise<CalendarAuthorizationStatus>;
    getSources(): Promise<CalendarSourceInfo[]>;
    getCalendars(): Promise<CalendarInfo[]>;
    getDefaultCalendar(): Promise<CalendarInfo>;
    createCalendar(input: CreateCalendarInput): Promise<CalendarInfo>;
    updateCalendar(id: string, patch: UpdateCalendarPatch): Promise<CalendarInfo>;
    deleteCalendar(id: string): Promise<void>;
    getEvents(options: GetEventsOptions): Promise<GetEventsResult>;
    getEvent(reference: EventRef): Promise<CalendarEvent>;
    createEvent(input: CreateEventInput): Promise<CreateEventResult>;
    /** Returns the saved event. Always replace the input ref with the ref on this result. */
    updateEvent(reference: EventRef, patch: UpdateEventPatch, options: {
        span: EventMutationSpan;
    }): Promise<CalendarEvent>;
    deleteEvent(reference: EventRef, options: {
        span: EventMutationSpan;
    }): Promise<void>;
}
export declare const calendar: CalendarAPI;
export {};
