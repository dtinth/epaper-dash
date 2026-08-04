import { announce, recentAnnouncements } from "./tts.ts";

export function AnnouncementsTab() {
  const announcements = recentAnnouncements.value;
  if (announcements.length === 0) {
    return <div class="announcements-empty">No announcements.</div>;
  }
  return (
    <ul class="announcements">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          {/* Touching an announcement plays it again, which is how you test
              the audio without waiting for a real one. */}
          <button type="button" onClick={() => announce(announcement)}>
            <div class="announcement-text">{announcement.text}</div>
            {announcement.audioUrl ? null : <div class="announcement-note">No audio</div>}
          </button>
        </li>
      ))}
    </ul>
  );
}
