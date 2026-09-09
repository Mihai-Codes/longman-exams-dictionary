import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
type SliderSize = "small" | "medium" | "large";
type SliderContent = React.ReactNode | ((value: number) => React.ReactNode);
type BaseSliderProps = Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "size">;
interface DefaultSliderProps extends BaseSliderProps {
    /**
     * `default` — slim 6px track with a visible white thumb (form / inspector slider).
     */
    variant?: "default";
}
interface FilledSliderProps extends BaseSliderProps {
    /**
     * `filled` — iOS volume-style pill: tall pill track that matches `Input variant="filled"`
     * height + radius. Drag anywhere on the track; thumb is a small pill anchored just inside
     * the filled edge.
     */
    variant: "filled";
    /** Matches `Input` / `Select` `size` so the slider stacks neatly alongside them. */
    size?: SliderSize;
    /**
     * Content rendered at the leading edge of the track (icon, label, etc.). Pass a
     * `(value) => node` function to format the live value (single-thumb only).
     */
    startContent?: SliderContent;
    /** Trailing-edge counterpart to `startContent` — typically the current value. */
    endContent?: SliderContent;
    /**
     * Fill anchor for single-thumb sliders. By default the range fills from the start
     * (left/bottom) to the thumb. Pass a value (e.g. `0` on a `-100…100` adjustment) to
     * make the fill grow from that point in either direction — Photos / Lightroom style.
     */
    origin?: number;
    /**
     * Render evenly-spaced tick marks along the track (Apple Photos / Logic style).
     * Pass `true` for a sensible default count, or a number to set the tick count
     * explicitly.
     */
    ticks?: boolean | number;
}
export type SliderProps = DefaultSliderProps | FilledSliderProps;
declare function Slider(props: SliderProps): import("react/jsx-runtime").JSX.Element;
export { Slider };
