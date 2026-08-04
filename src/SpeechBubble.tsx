import { currentAnnouncement } from "./tts.ts";

/** The overlay that covers the dashboard while an announcement plays. */
export function SpeechBubble() {
  const announcement = currentAnnouncement.value;
  if (!announcement) return null;
  return (
    <div class="bubble-overlay">
      <div class="bubble">{announcement.text}</div>
    </div>
  );
}
