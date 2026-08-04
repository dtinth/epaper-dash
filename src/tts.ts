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
  logAudioSupport();
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
  let objectUrl = "";
  try {
    // Downloading first keeps the whole file ready before the bubble appears,
    // but it needs CORS.
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP " + response.status);
      objectUrl = URL.createObjectURL(await response.blob());
    } catch (error) {
      logError("tts: cannot download the audio", error);
    }
    // An engine that refuses the downloaded copy sometimes accepts the URL,
    // because then it reads the type from the server and not from the blob.
    if (objectUrl) {
      try {
        await playSource(objectUrl);
        return;
      } catch (error) {
        logError("tts: the copy does not play, tries the URL", error);
      }
    }
    await playSource(url);
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function playSource(source: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("ended", () => resolve());
    audio.addEventListener("error", () => reject(new Error(describeMediaError(audio))));
    audio.src = source;
    const result = audio.play() as Promise<void> | undefined;
    if (result && result.catch) result.catch(reject);
  });
}

const MEDIA_ERRORS: Record<number, string> = {
  1: "the browser stopped the audio",
  2: "network error while it reads the audio",
  3: "the browser cannot decode this audio",
  4: "the browser does not support this audio format",
};

function describeMediaError(audio: HTMLAudioElement) {
  const error = audio.error;
  if (!error) return "the browser cannot play this audio";
  const name = MEDIA_ERRORS[error.code] || "media error " + error.code;
  return error.message ? name + " (" + error.message + ")" : name;
}

/**
 * Writes what the engine says it can play. On a device with no developer tools
 * this line is the fastest way to see if the format is the problem.
 */
function logAudioSupport() {
  const audio = new Audio();
  const types = [
    "audio/ogg; codecs=vorbis",
    "audio/ogg; codecs=opus",
    "audio/mpeg",
    "audio/mp4; codecs=mp4a.40.2",
    "audio/wav",
  ];
  const parts: string[] = [];
  for (const type of types) {
    const name = type.replace("audio/", "").replace("; codecs=", " ");
    parts.push(name + ": " + (audio.canPlayType(type) || "no"));
  }
  log("audio support: " + parts.join(", "));
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
