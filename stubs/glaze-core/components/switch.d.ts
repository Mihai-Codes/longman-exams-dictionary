import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;
declare function Switch({ className, defaultChecked, checked: checkedProp, onCheckedChange, onClick, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, disabled, ...props }: SwitchProps): import("react/jsx-runtime").JSX.Element;
export { Switch };
