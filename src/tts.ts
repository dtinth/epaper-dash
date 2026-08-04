import { signal } from "@preact/signals";
import type { Announcement } from "./api.ts";
import { getApi } from "./api.ts";
import { log, logError } from "./log.ts";
import { settings } from "./settings.ts";

const POLL_INTERVAL = 5000;

/** How long the bubble stays up when there is no audio to time it against. */
const SILENT_DURATION = 5000;

/** The announcement on screen right now, or null when the bubble is hidden. */
export const currentAnnouncement = signal<Announcement | null>(null);

/** The latest announcements, newest first, for the tab on the right. */
export const recentAnnouncements = signal<Announcement[]>([]);

let seen = new Set<string>();

/**
 * False until the first answer arrives. Everything in that first answer already
 * existed before this dashboard started, so it is recorded but never announced.
 */
let primed = false;

let lastPollFailed = false;
let started = false;

export function startAnnouncer() {
  if (started) return;
  started = true;
  void pollForever();
  watchSettings();
}

/** A new backend means a new set of ids, so nothing carries over. */
function watchSettings() {
  let previous = key(settings.value.mode, settings.value.endpoint);
  settings.subscribe((value) => {
    const next = key(value.mode, value.endpoint);
    if (next === previous) return;
    previous = next;
    seen = new Set<string>();
    primed = false;
    recentAnnouncements.value = [];
    log("tts: switched to " + value.mode + " mode");
  });
}

function key(mode: string, endpoint: string) {
  return mode + " " + endpoint;
}

async function pollForever() {
  for (;;) {
    try {
      const result = await getApi().tts.getLatestAnnouncements({});
      accept(result.announcements || []);
      if (lastPollFailed) {
        lastPollFailed = false;
        log("tts: the connection works again");
      }
    } catch (error) {
      if (!lastPollFailed) {
        lastPollFailed = true;
        logError("tts: cannot get the announcements", error);
      }
    }
    await delay(POLL_INTERVAL);
  }
}

function accept(announcements: Announcement[]) {
  recentAnnouncements.value = announcements;

  const fresh: Announcement[] = [];
  for (const announcement of announcements) {
    if (seen.has(announcement.id)) continue;
    seen.add(announcement.id);
    fresh.push(announcement);
  }

  if (!primed) {
    primed = true;
    log("tts: ready, " + announcements.length + " announcement(s) at the start stay silent");
    return;
  }

  // The answer is newest first; announce them in the sequence of their arrival.
  for (let i = fresh.length - 1; i >= 0; i--) {
    const announcement = fresh[i]!;
    log('tts: new announcement "' + announcement.text + '"');
    announce(announcement);
  }
}

let queue: Promise<void> = Promise.resolve();

/**
 * Adds an announcement to the queue. Only one plays at a time.
 *
 * Silent mode suppresses the audio of announcements that arrive on their own,
 * but a touch on one in the announcements tab is a deliberate act, so that one
 * still plays.
 */
export function announce(announcement: Announcement, options: { onDemand?: boolean } = {}) {
  queue = queue.then(() => show(announcement, options.onDemand === true));
}

async function show(announcement: Announcement, onDemand: boolean) {
  currentAnnouncement.value = announcement;
  const quiet = settings.value.silent && !onDemand;
  try {
    if (announcement.audioUrl && !quiet) {
      await play(announcement.audioUrl);
    } else {
      if (announcement.audioUrl) log("tts: silent mode, the audio stays off");
      await delay(SILENT_DURATION);
    }
  } catch (error) {
    logError("tts: cannot play the audio", error);
    await delay(SILENT_DURATION);
  } finally {
    currentAnnouncement.value = null;
  }
}

async function play(url: string) {
  let source = url;
  let objectUrl = "";
  try {
    // Downloading first keeps the whole file ready before the bubble appears,
    // but it needs CORS. Playing the URL directly does not, so that is the
    // fallback.
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    objectUrl = URL.createObjectURL(await response.blob());
    source = objectUrl;
  } catch (error) {
    logError("tts: cannot download the audio, plays it directly", error);
  }
  try {
    await playSource(source);
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function playSource(source: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("ended", () => resolve());
    audio.addEventListener("error", () => reject(new Error("the browser cannot play this audio")));
    audio.src = source;
    const result = audio.play() as Promise<void> | undefined;
    if (result && result.catch) result.catch(reject);
  });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
