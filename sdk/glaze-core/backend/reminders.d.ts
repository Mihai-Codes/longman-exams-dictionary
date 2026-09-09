import { EventEmitter } from "node:events";
import { type CalendarAlarm, type CalendarAlarmInput, type CalendarInfo, type CalendarSourceInfo, type EventTime, type RecurrenceRule, type RecurrenceRuleInput } from "./calendar.js";
export type RemindersAuthorizationStatus = "not-determined" | "denied" | "restricted" | "full-access" | "unknown";
export interface ReminderRef {
    /**
     * Opaque and versioned. Do not parse it or persist it as an EventKit identifier.
     * A mutation may return a replacement ref; always retain the ref from the latest returned reminder.
     */
    value: string;
}
export interface Reminder {
    ref: ReminderRef;
    externalId: string | null;
    calendarId: string;
    title: string;
    location: string | null;
    notes: string | null;
    url: string | null;
    creationDate: string | null;
    lastModifiedDate: string | null;
    start: EventTime | null;
    due: EventTime | null;
    /** For a recurring series, EventKit exposes the first incomplete occurrence rather than completed history. */
    isCompleted: boolean;
    /** Completion date for the currently exposed reminder; completed occurrences of a recurring series are not queryable. */
    completionDate: string | null;
    /** EventKit scale: 0 none, 1-4 high, 5 medium, and 6-9 low. */
    priority: number;
    alarms: CalendarAlarm[];
    recurrenceRules: RecurrenceRule[];
}
export interface GetRemindersOptions {
    calendarIds?: string[];
    completed?: boolean;
    /** Optional inclusive RFC 3339 due-date boundary. */
    dueStart?: string;
    /** Optional exclusive RFC 3339 due-date boundary. */
    dueEnd?: string;
    limit?: number;
}
export interface GetRemindersResult {
    reminders: Reminder[];
    truncated: boolean;
}
export interface CreateReminderInput {
    title: string;
    calendarId?: string;
    location?: string;
    notes?: string;
    url?: string;
    start?: EventTime;
    due?: EventTime;
    isCompleted?: boolean;
    completionDate?: string;
    /** EventKit scale: 0 none, 1-4 high, 5 medium, and 6-9 low. */
    priority?: number;
    alarms?: CalendarAlarmInput[];
    recurrenceRules?: RecurrenceRuleInput[];
}
export type ClearableReminderField = "location" | "notes" | "url" | "start" | "due" | "completionDate" | "alarms" | "recurrenceRules";
export interface UpdateReminderPatch {
    title?: string;
    calendarId?: string;
    location?: string;
    notes?: string;
    url?: string;
    start?: EventTime;
    due?: EventTime;
    isCompleted?: boolean;
    completionDate?: string;
    /** EventKit scale: 0 none, 1-4 high, 5 medium, and 6-9 low. */
    priority?: number;
    alarms?: CalendarAlarmInput[];
    recurrenceRules?: RecurrenceRuleInput[];
    clearFields?: ClearableReminderField[];
}
declare class RemindersAPI extends EventEmitter {
    constructor();
    status(): Promise<RemindersAuthorizationStatus>;
    requestAccess(): Promise<RemindersAuthorizationStatus>;
    getSources(): Promise<CalendarSourceInfo[]>;
    getCalendars(): Promise<CalendarInfo[]>;
    getDefaultCalendar(): Promise<CalendarInfo>;
    createCalendar(input: {
        title: string;
        sourceId?: string;
        color?: string;
    }): Promise<CalendarInfo>;
    updateCalendar(id: string, patch: {
        title?: string;
        color?: string;
    }): Promise<CalendarInfo>;
    deleteCalendar(id: string): Promise<void>;
    getReminders(options?: GetRemindersOptions): Promise<GetRemindersResult>;
    getReminder(reference: ReminderRef): Promise<Reminder>;
    createReminder(input: CreateReminderInput): Promise<Reminder>;
    /**
     * Returns EventKit's current reminder. Always replace the input ref with the ref on this result.
     * Completing a recurring reminder advances its series, so the result represents the next incomplete
     * occurrence rather than a completed history item.
     */
    updateReminder(reference: ReminderRef, patch: UpdateReminderPatch): Promise<Reminder>;
    deleteReminder(reference: ReminderRef): Promise<void>;
}
export declare const reminders: RemindersAPI;
export {};
