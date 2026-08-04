import type { Announcement, Api } from "./api.ts";

// MP3, because NeoBrowser answers "no" to both Ogg Vorbis and Ogg Opus.
const MOCK_AUDIO_URL =
  "https://im.dt.in.th/ipfs/bafybeibqvr7timhmbwjzbufwarjxdolim4wtcof3ndrei5uolc6k64xfzq/ready-aiden.mp3";

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
