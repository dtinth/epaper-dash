import { signal } from "@preact/signals";

export type Mode = "mock" | "live";

export interface Settings {
  mode: Mode;
  /** Base URL of the RPC endpoint, without a trailing slash. */
  endpoint: string;
  secret: string;
  /** When true, an announcement that arrives on its own shows but stays quiet. */
  silent: boolean;
}

const STORAGE_KEY = "epaper-dash.settings";

const defaults: Settings = {
  mode: "mock",
  endpoint: "",
  secret: "",
  silent: false,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      mode: parsed.mode === "live" ? "live" : "mock",
      endpoint: String(parsed.endpoint || ""),
      secret: String(parsed.secret || ""),
      silent: parsed.silent === true,
    };
  } catch {
    return defaults;
  }
}

export const settings = signal<Settings>(load());

/**
 * Merges a change into the stored settings. The endpoint and the secret are
 * kept even while in mock mode, so switching back to live needs no retyping.
 */
export function updateSettings(patch: Partial<Settings>) {
  const next = { ...settings.value, ...patch };
  settings.value = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A device with storage disabled still runs, it just forgets the settings.
  }
}
