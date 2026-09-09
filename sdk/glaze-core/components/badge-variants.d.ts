export type BadgeColor = "primary" | "secondary" | "blue" | "green" | "yellow" | "orange" | "red" | "purple" | "magenta";
export declare const badgeVariants: (props?: ({
    size?: "small" | "medium" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare const badgeColorClasses: Record<BadgeColor, string>;
