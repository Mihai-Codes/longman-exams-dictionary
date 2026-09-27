export function createRequestGuard() {
  let generation = 0;

  return {
    begin(): () => boolean {
      const request = ++generation;
      return () => request === generation;
    },
    invalidate(): void {
      generation += 1;
    },
  };
}
