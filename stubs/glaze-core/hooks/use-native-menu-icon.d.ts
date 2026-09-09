/**
 * Hook for loading NativeMenuIcon as renderable data for web views.
 *
 * Use this hook when you need to render a NativeMenuIcon (SF Symbol or image path)
 * in a React component. It handles:
 * - Loading SF Symbols via nativeImage.createFromNamedImage
 * - Resolving image paths for both development (web URLs) and production (file:// protocol)
 * - Tracking whether the icon is a template (adapts to light/dark mode)
 */
import { type NativeMenuIcon } from "../utils/native-menu-helpers";
export interface NativeMenuIconData {
    /** Data URL or web URL that can be used in an img src or CSS url() */
    dataUrl: string;
    /** Whether the icon should adapt to light/dark mode (true for SF Symbols and template images) */
    isTemplate: boolean;
}
/**
 * Hook to load a NativeMenuIcon as renderable data for web views.
 *
 * @param icon - The NativeMenuIcon to load (SF Symbol name, or image path object)
 * @returns Icon data with dataUrl and isTemplate flag, or null if not loaded/invalid
 *
 * @example
 * ```tsx
 * const iconData = useNativeMenuIcon(item.icon);
 *
 * if (iconData?.isTemplate) {
 *   // Render as mask so it adapts to light/dark mode
 *   return <span className="bg-current" style={{ maskImage: `url(${iconData.dataUrl})` }} />;
 * } else if (iconData) {
 *   // Render as regular image
 *   return <img src={iconData.dataUrl} />;
 * }
 * ```
 */
export declare function useNativeMenuIcon(icon: NativeMenuIcon | undefined): NativeMenuIconData | null;
/**
 * Pre-warm the icon cache for SF symbols that are known ahead of time.
 * Call this early (e.g., at app startup) to avoid the visible delay
 * when icons first render.
 *
 * @example
 * ```ts
 * prewarmIcons(["hammer.fill", "list.bullet.indent"]);
 * ```
 */
export declare function prewarmIcons(icons: NativeMenuIcon[]): void;
