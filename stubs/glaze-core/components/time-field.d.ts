import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { timeFieldVariants } from "./time-field-variants";
type TimeFieldOwnProps = {
    /** Current time as 24-hour `HH:mm` (e.g. `"14:30"`). Omit for uncontrolled mode. */
    value?: string;
    /** Initial time (uncontrolled), same `HH:mm` format. */
    defaultValue?: string;
    /** Fires with the new 24-hour `HH:mm` value, or `""` while a segment is empty. */
    onValueChange?: (value: string) => void;
    /** Force a 12-hour (AM/PM) or 24-hour clock. Defaults to the user's system setting. */
    hour12?: boolean;
    /** Increment applied to the minute segment by the arrow keys and steppers. Defaults to `1`. */
    minuteStep?: number;
    /** Show/hide the stepper arrows. Defaults to `true`. */
    steppers?: boolean;
    disabled?: boolean;
};
export interface TimeFieldProps extends Omit<React.ComponentProps<"div">, "size" | "value" | "defaultValue" | "onChange">, VariantProps<typeof timeFieldVariants>, TimeFieldOwnProps {
}
declare function TimeField({ className, variant, size, value: controlledValue, defaultValue, onValueChange, hour12: hour12Prop, minuteStep, steppers, disabled, "aria-invalid": ariaInvalid, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: TimeFieldProps): import("react/jsx-runtime").JSX.Element;
declare namespace TimeField {
    var displayName: string;
}
export { TimeField };
