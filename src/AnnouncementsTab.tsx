import { now } from "./now.ts";
import { formatRelativeTime } from "./relativeTime.ts";
import { announce, recentAnnouncements } from "./tts.ts";

export function AnnouncementsTab() {
  const announcements = recentAnnouncements.value;
  const currentTime = now.value.getTime();
  if (announcements.length === 0) {
    return <div class="announcements-empty">No announcements.</div>;
  }
  return (
    <ul class="announcements">
      {announcements.map((announcement) => {
        const relative = formatRelativeTime(announcement.time, currentTime);
        const notes: string[] = [];
        if (relative) notes.push(relative);
        if (!announcement.audioUrl) notes.push("No audio");
        return (
          <li key={announcement.id}>
            {/* Touching an announcement plays it again, which is how you test
                the audio without waiting for a real one. */}
            <button type="button" onClick={() => announce(announcement, { onDemand: true })}>
              <div class="announcement-text">{announcement.text}</div>
              {notes.length > 0 ? <div class="announcement-note">{notes.join(" · ")}</div> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
