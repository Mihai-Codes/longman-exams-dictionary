/**
 * Glaze Framework - Logging System
 *
 * Provides structured logging for Glaze applications
 */
export interface Logger {
    info(category: string, message: string, metadata?: any): void;
    error(category: string, message: string, error?: any): void;
    warn(category: string, message: string, metadata?: any): void;
    debug(category: string, message: string, metadata?: any): void;
}
declare class GlazeLogger implements Logger {
    private formatMessage;
    private formatExtra;
    info(category: string, message: string, metadata?: any): void;
    error(category: string, message: string, error?: any): void;
    warn(category: string, message: string, metadata?: any): void;
    debug(category: string, message: string, metadata?: any): void;
}
export declare const logger: GlazeLogger;
export {};
