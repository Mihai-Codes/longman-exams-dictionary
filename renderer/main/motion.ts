export type MotionMode = "auto" | "full";

export function motionModeFromPreference(value: string | null): MotionMode {
  return value === "full" ? "full" : "auto";
}

export function shouldPlayMotion(mode: MotionMode, prefersReducedMotion: boolean): boolean {
  return mode === "full" || !prefersReducedMotion;
}
