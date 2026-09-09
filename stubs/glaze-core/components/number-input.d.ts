import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * NumberInput — compact numeric input with optional unit suffix and stepper arrows.
 * Modeled on Apple's `NSStepper` + `NSTextField` combo seen throughout Xcode / Pages
 * inspectors.
 *
 * Uses a real `<input type="number">` under the hood so browser number semantics
 * (keyboard arrows, scroll wheel, min/max clamping, locale formatting) still apply.
 * The visible stepper buttons are sugar on top — both surfaces round-trip through
 * the same `onValueChange` callback with a parsed number.
 *
 * When a NumberInput is placed in an `InspectorRow`, keep `size="small"` for the
 * Pages-style density. Use `medium` (default) in standalone forms.
 */
declare const numberInputVariants: (props?: ({
    variant?: "default" | "filled" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type NumberInputOwnProps = {
    /** Current value. Omit to use uncontrolled mode (e.g. `defaultValue`). Pass `null` for empty controlled state. */
    value?: number | null;
    /** Fires whenever the user changes the number. `null` when the input is cleared. */
    onValueChange?: (value: number | null) => void;
    /** Suffix rendered inside the input, to the right of the value (e.g. "pt", "px", "%"). */
    unit?: React.ReactNode;
    /** Show/hide the stepper arrows. Defaults to `true`. */
    steppers?: boolean;
};
export interface NumberInputProps extends Omit<React.ComponentProps<"input">, "size" | "value" | "onChange" | "type">, VariantProps<typeof numberInputVariants>, NumberInputOwnProps {
}
declare function NumberInput({ className, size, variant, value, onValueChange, unit, steppers, min, max, step, disabled, "aria-invalid": ariaInvalid, ref, ...props }: NumberInputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): import("react/jsx-runtime").JSX.Element;
declare namespace NumberInput {
    var displayName: string;
}
export { NumberInput };
