import { signal } from "@preact/signals";

/**
 * The current time, one timer for the whole dashboard. Everything that shows a
 * time reads this, so the clock and the relative times change together.
 */
export const now = signal(new Date());

setInterval(() => {
  now.value = new Date();
}, 5000);
