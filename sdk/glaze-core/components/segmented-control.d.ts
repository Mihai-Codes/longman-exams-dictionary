import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
/**
 * SegmentedControl — pill-style selection control (Apple's `NSSegmentedControl`).
 *
 * Visually related to `ButtonGroup` + `Tabs` — same pill chrome and size tokens — but
 * semantically a form control that holds a value. Use it for mutually exclusive options
 * where every choice should be visible (alignment, size presets), or for multi-select
 * toggle strips (B/I/U/S character styles) via `type="multiple"`.
 *
 * Use `Tabs` when choices should switch content panels; use `ButtonGroup` when the items
 * are independent actions with no shared selection state.
 */
declare const segmentedControlVariants: (props?: ({
    variant?: "transparent" | "filled" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type BaseRootProps = Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type" | "value" | "defaultValue" | "onValueChange">;
type SingleProps = BaseRootProps & VariantProps<typeof segmentedControlVariants> & {
    /** Selection mode. Defaults to `"single"` — one item selected at a time. */
    type?: "single";
    /** Allow pressing the selected item again to clear the value. */
    allowEmpty?: boolean;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};
type MultipleProps = BaseRootProps & VariantProps<typeof segmentedControlVariants> & {
    /** Selection mode — pass `"multiple"` for B/I/U/S-style toggle strips. */
    type: "multiple";
    allowEmpty?: never;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
};
export type SegmentedControlProps = SingleProps | MultipleProps;
declare function SegmentedControl(props: SingleProps): React.JSX.Element;
declare function SegmentedControl(props: MultipleProps): React.JSX.Element;
interface SegmentedControlItemProps extends React.ComponentProps<typeof ToggleGroupPrimitive.Item> {
    /** Square the item up so an icon child renders with track-matched proportions. */
    iconOnly?: boolean;
}
declare function SegmentedControlItem({ className, iconOnly, ...props }: SegmentedControlItemProps): import("react/jsx-runtime").JSX.Element;
/**
 * Thin vertical divider rendered between adjacent `SegmentedControlItem`s — the
 * classic Apple creative-tool look (Pages Format inspector, Keynote, NSSegmentedControl
 * `.rounded`). The separator auto-hides when adjacent to a selected item (the accent
 * fill visually eats it).
 *
 * Omit separators entirely for the simpler "chip row" look — the root drops to a 2px
 * gap between items when no `[data-separator]` child is present.
 */
declare function SegmentedControlSeparator(): import("react/jsx-runtime").JSX.Element;
export { SegmentedControl, SegmentedControlItem, SegmentedControlSeparator };
