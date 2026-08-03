import { signal } from "@preact/signals";

/** When true, the clock hides the rest of the dashboard and doubles in size. */
export const clockFullscreen = signal(false);

/** The id of the open tab in the left panel, or null when they are all closed. */
export const activeLeftTab = signal<string | null>(null);
