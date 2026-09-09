/**
 * WebUtils preload helper
 *
 * Provides webUtils.getPathForFile(file) behavior by mapping native file paths
 * to WebKit File objects created by drag-and-drop and file picker selection.
 */
export interface WebUtilsAPI {
    getPathForFile(file: File): string;
}
export declare function createWebUtilsAPI(): WebUtilsAPI;
