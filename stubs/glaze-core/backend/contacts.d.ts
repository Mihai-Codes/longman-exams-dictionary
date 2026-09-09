import { EventEmitter } from "node:events";
export type ContactsAuthorizationStatus = "not-determined" | "denied" | "restricted" | "authorized" | "unknown";
export type ContactSearchField = "name" | "email" | "phone";
export type ContactField = "name" | "phoneticName" | "nickname" | "organization" | "department" | "jobTitle" | "emails" | "phones" | "birthday" | "nonGregorianBirthday" | "dates" | "postalAddresses" | "urlAddresses" | "relations" | "socialProfiles" | "instantMessages" | "contactType" | "imageMetadata";
export interface ContactLabeledValue<T = string> {
    /** Raw Contacts label. Preserve this value when writing the record back. */
    label: string | null;
    /** User-facing localized label returned by reads. Omit it on writes. */
    localizedLabel?: string | null;
    value: T;
}
export interface ContactPostalAddress {
    street: string;
    subLocality: string;
    city: string;
    subAdministrativeArea: string;
    state: string;
    postalCode: string;
    country: string;
    isoCountryCode: string;
}
export interface ContactDate {
    year: number | null;
    month: number;
    day: number;
    calendarIdentifier: string | null;
}
export interface ContactSocialProfile {
    urlString: string;
    username: string;
    userIdentifier: string;
    service: string;
}
export interface ContactInstantMessageAddress {
    username: string;
    service: string;
}
export interface Contact {
    id: string;
    displayName: string;
    name?: {
        prefix: string;
        given: string;
        middle: string;
        family: string;
        previousFamily: string;
        suffix: string;
    };
    phoneticName?: {
        given: string;
        middle: string;
        family: string;
        organization: string;
    };
    nickname?: string;
    organization?: string;
    department?: string;
    jobTitle?: string;
    emails?: ContactLabeledValue[];
    phones?: ContactLabeledValue[];
    birthday?: ContactDate | null;
    nonGregorianBirthday?: ContactDate | null;
    dates?: ContactLabeledValue<ContactDate>[];
    postalAddresses?: ContactLabeledValue<ContactPostalAddress>[];
    urlAddresses?: ContactLabeledValue[];
    relations?: ContactLabeledValue<{
        name: string;
    }>[];
    socialProfiles?: ContactLabeledValue<ContactSocialProfile>[];
    instantMessages?: ContactLabeledValue<ContactInstantMessageAddress>[];
    contactType?: "person" | "organization" | "unknown";
    imageMetadata?: {
        available: boolean;
    };
}
export interface SearchContactsOptions {
    query: string;
    /** Multiple fields use union semantics and results are deduplicated by unified-contact id. */
    by?: ContactSearchField | ContactSearchField[];
    fields?: ContactField[];
    limit?: number;
}
export interface SearchContactsResult {
    contacts: Contact[];
    truncated: boolean;
}
export interface ListContactsOptions {
    fields?: ContactField[];
    limit?: number;
    /** Opaque cursor. Pages are invalidated when the contact store changes. */
    cursor?: string;
    containerId?: string;
    groupId?: string;
    sort?: "user-default" | "given-name" | "family-name";
}
export interface ListContactsResult {
    contacts: Contact[];
    nextCursor: string | null;
}
export type ContactWritableField = "name" | "phoneticName" | "nickname" | "organization" | "department" | "jobTitle" | "emails" | "phones" | "birthday" | "nonGregorianBirthday" | "dates" | "postalAddresses" | "urlAddresses" | "relations" | "socialProfiles" | "instantMessages" | "contactType" | "image";
export interface ContactWriteData {
    name?: {
        prefix?: string;
        given?: string;
        middle?: string;
        family?: string;
        previousFamily?: string;
        suffix?: string;
    };
    phoneticName?: {
        given?: string;
        middle?: string;
        family?: string;
        organization?: string;
    };
    nickname?: string;
    organization?: string;
    department?: string;
    jobTitle?: string;
    emails?: ContactLabeledValue[];
    phones?: ContactLabeledValue[];
    birthday?: ContactDate;
    nonGregorianBirthday?: ContactDate;
    dates?: ContactLabeledValue<ContactDate>[];
    postalAddresses?: ContactLabeledValue<ContactPostalAddress>[];
    urlAddresses?: ContactLabeledValue[];
    relations?: ContactLabeledValue<{
        name: string;
    }>[];
    socialProfiles?: ContactLabeledValue<ContactSocialProfile>[];
    instantMessages?: ContactLabeledValue<ContactInstantMessageAddress>[];
    contactType?: "person" | "organization";
    /** JPEG, PNG, GIF, HEIC, or TIFF bytes. Normalized to JPEG before saving. Maximum 10 MB. */
    image?: Uint8Array;
}
export interface ContactPatch extends ContactWriteData {
    clearFields?: ContactWritableField[];
}
export interface ContactContainer {
    id: string;
    name: string;
    type: "local" | "exchange" | "carddav" | "unassigned" | "unknown";
    isDefault: boolean;
}
export interface ContactGroup {
    id: string;
    name: string;
    containerId: string | null;
}
export interface ContactPhoto {
    data: Uint8Array;
    contentType: string;
}
declare class ContactsAPI extends EventEmitter {
    constructor();
    status(): Promise<ContactsAuthorizationStatus>;
    requestAccess(): Promise<ContactsAuthorizationStatus>;
    search(options: SearchContactsOptions): Promise<SearchContactsResult>;
    list(options?: ListContactsOptions): Promise<ListContactsResult>;
    get(id: string, options?: {
        fields?: ContactField[];
    }): Promise<Contact>;
    getMe(options?: {
        fields?: ContactField[];
    }): Promise<Contact>;
    create(data: ContactWriteData, options?: {
        containerId?: string;
        fields?: ContactField[];
    }): Promise<Contact>;
    update(id: string, patch: ContactPatch, options?: {
        fields?: ContactField[];
    }): Promise<Contact>;
    delete(id: string): Promise<void>;
    /** Returns the requested photo variant, falling back to the other stored variant when Contacts omits a derivative. */
    getPhoto(id: string, variant?: "thumbnail" | "full"): Promise<ContactPhoto>;
    getContainers(): Promise<ContactContainer[]>;
    getGroups(options?: {
        containerId?: string;
    }): Promise<ContactGroup[]>;
    createGroup(name: string, options?: {
        containerId?: string;
    }): Promise<ContactGroup>;
    updateGroup(id: string, name: string): Promise<ContactGroup>;
    deleteGroup(id: string): Promise<void>;
    addToGroup(contactId: string, groupId: string): Promise<void>;
    removeFromGroup(contactId: string, groupId: string): Promise<void>;
    exportVCard(ids: string[]): Promise<string>;
    importVCard(vCard: string, options?: {
        containerId?: string;
        fields?: ContactField[];
    }): Promise<Contact[]>;
}
export declare const contacts: ContactsAPI;
export {};
