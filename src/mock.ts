import type { Announcement, Api } from "./api.ts";

const MOCK_AUDIO_URL =
  "https://im.dt.in.th/ipfs/bafybeih46oifjjk7hzncm7emzdhzxcxdllig2gch6hmgivtwvn2qk463aq/ready-aiden.ogg";

/** Newest first, like the live service is expected to answer. */
let announcements: Announcement[] = [];
let counter = 0;

export const mockApi: Api = {
  tts: {
    getLatestAnnouncements: () => Promise.resolve({ announcements: announcements.slice(0, 20) }),
  },
};

/**
 * Simulates the arrival of a new announcement. The poll loop then sees an id it
 * has never seen and announces it, exactly as it would in live mode.
 */
export function addMockAnnouncement(options: { withAudio: boolean }) {
  counter++;
  const announcement: Announcement = {
    id: "mock-" + counter + "-" + Date.now(),
    text: "Test announcement",
    audioUrl: options.withAudio ? MOCK_AUDIO_URL : undefined,
  };
  announcements = [announcement, ...announcements].slice(0, 20);
  return announcement;
}
