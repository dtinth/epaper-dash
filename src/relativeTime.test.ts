import { expect, test } from "vite-plus/test";
import { formatRelativeTime } from "./relativeTime.ts";

const now = Date.parse("2026-08-04T12:00:00.000Z");

function at(offsetSeconds: number) {
  return new Date(now - offsetSeconds * 1000).toISOString();
}

test("very recent times read as just now", () => {
  expect(formatRelativeTime(at(0), now)).toBe("just now");
  expect(formatRelativeTime(at(44), now)).toBe("just now");
});

test("minutes, hours and days are counted", () => {
  expect(formatRelativeTime(at(60), now)).toBe("1 minute ago");
  expect(formatRelativeTime(at(300), now)).toBe("5 minutes ago");
  expect(formatRelativeTime(at(3600), now)).toBe("1 hour ago");
  expect(formatRelativeTime(at(7200), now)).toBe("2 hours ago");
  expect(formatRelativeTime(at(86400), now)).toBe("1 day ago");
  expect(formatRelativeTime(at(3 * 86400), now)).toBe("3 days ago");
});

test("a clock a little ahead still reads as just now", () => {
  expect(formatRelativeTime(at(-30), now)).toBe("just now");
});

test("a time far in the future says in", () => {
  expect(formatRelativeTime(at(-300), now)).toBe("in 5 minutes");
});

test("a time that cannot be read gives an empty string", () => {
  expect(formatRelativeTime("not a time", now)).toBe("");
  expect(formatRelativeTime("", now)).toBe("");
});
