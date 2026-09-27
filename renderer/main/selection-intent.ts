export function createSelectionIntent<T>() {
  let selected: T | null = null;

  return {
    arm(value: T): void {
      selected = value;
    },
    consume(value: T): boolean {
      if (selected !== value) return false;
      selected = null;
      return true;
    },
    clear(): void {
      selected = null;
    },
  };
}
