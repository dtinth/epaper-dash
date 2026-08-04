import { signal } from "@preact/signals";

export interface LogEntry {
  id: number;
  time: string;
  level: "info" | "error";
  message: string;
}

const MAX_ENTRIES = 200;

let nextId = 1;

/** Newest entry first, so the log tab needs no reversing to render. */
export const logs = signal<LogEntry[]>([]);

function add(level: LogEntry["level"], message: string) {
  const now = new Date();
  const time =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");
  const entry: LogEntry = { id: nextId++, time, level, message };
  logs.value = [entry, ...logs.value].slice(0, MAX_ENTRIES);
}

export function log(message: string) {
  add("info", message);
}

export function logError(message: string, error?: unknown) {
  add("error", error === undefined ? message : message + ": " + describe(error));
}

export function clearLogs() {
  logs.value = [];
}

function describe(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
