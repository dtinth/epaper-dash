import { createLiveApi } from "./rpc.ts";
import { mockApi } from "./mock.ts";
import { settings } from "./settings.ts";

export interface Announcement {
  id: string;
  text: string;
  audioUrl?: string;
  /** ISO 8601, as `new Date().toISOString()` gives it. */
  time: string;
}

export interface GetLatestAnnouncementsResult {
  /** Newest first. */
  announcements: Announcement[];
}

/**
 * The RPC surface. Every method is one `POST <endpoint>/<service>/<method>`
 * with a JSON body and a JSON reply, so live and mock share the same shape.
 */
export interface Api {
  tts: {
    getLatestAnnouncements(input: Record<string, never>): Promise<GetLatestAnnouncementsResult>;
  };
}

const liveApi = createLiveApi();

export function getApi(): Api {
  return settings.value.mode === "live" ? liveApi : mockApi;
}
