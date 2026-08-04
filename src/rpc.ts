import type { Api } from "./api.ts";
import { settings } from "./settings.ts";

/**
 * Calls one RPC method: `POST <endpoint>/<service>/<method>`, the secret in the
 * Authorization header, JSON in and JSON out.
 */
export async function call<T>(service: string, method: string, input: unknown): Promise<T> {
  const { endpoint, secret } = settings.value;
  if (!endpoint) {
    throw new Error("no endpoint is configured");
  }
  const url = endpoint.replace(/\/+$/, "") + "/" + service + "/" + method;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) {
    headers["Authorization"] = "Bearer " + secret;
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(input === undefined ? {} : input),
  });
  if (!response.ok) {
    throw new Error("HTTP " + response.status + " from " + url);
  }
  return (await response.json()) as T;
}

export function createLiveApi(): Api {
  return {
    tts: {
      getLatestAnnouncements: (input) => call("tts", "getLatestAnnouncements", input),
    },
  };
}
