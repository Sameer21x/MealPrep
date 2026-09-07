/** Resolves after `ms`, for the deliberate pauses that pace the generation progress list. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
