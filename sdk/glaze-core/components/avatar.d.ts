import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { avatarVariants } from "./avatar-variants";
export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {
}
declare function Avatar({ className, size, ...props }: AvatarProps): import("react/jsx-runtime").JSX.Element;
declare function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>): import("react/jsx-runtime").JSX.Element;
declare function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>): import("react/jsx-runtime").JSX.Element;
declare const AVATAR_BADGE_COLORS: {
    readonly gray: "bg-foreground-40";
    readonly blue: "bg-support-blue";
    readonly green: "bg-support-green";
    readonly yellow: "bg-support-yellow";
    readonly orange: "bg-support-orange";
    readonly red: "bg-support-red";
    readonly pink: "bg-support-magenta";
};
declare const AVATAR_BADGE_POSITIONS: {
    readonly "bottom-right": "right-0 bottom-0";
    readonly "top-right": "top-0 right-0";
    readonly "bottom-left": "bottom-0 left-0";
    readonly "top-left": "top-0 left-0";
};
export interface AvatarBadgeProps extends React.ComponentProps<"span"> {
    /** Dot color when the badge has no children. Ignored when rendering content. For other colors, pass `className`. */
    color?: keyof typeof AVATAR_BADGE_COLORS;
    /** Corner to anchor to. Defaults to `bottom-right` (presence); use `top-right` for notification counts. */
    position?: keyof typeof AVATAR_BADGE_POSITIONS;
}
/**
 * Corner indicator anchored to an `Avatar`. With no children it renders a status dot
 * (sized relative to the avatar); with children it renders a count/content pill that
 * overhangs the avatar edge.
 */
declare function AvatarBadge({ className, color, position, children, ...props }: AvatarBadgeProps): import("react/jsx-runtime").JSX.Element;
/**
 * Overlapping avatar group with a real transparent gap between avatars: every
 * avatar below the previous one is masked where they overlap (rules in
 * styles.css keyed off data-slot), so any background shows through cleanly —
 * no surface-colored rings. First avatar renders on top.
 *
 * Assumes uniformly sized children; the mask geometry tracks the stack's
 * overlap via --avatar-stack-overlap.
 */
declare function AvatarStack({ className, children, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarStack };
