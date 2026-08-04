import volume2Icon from "@iconify-icons/lucide/volume-2";
import volumeXIcon from "@iconify-icons/lucide/volume-x";
import { Icon } from "./Icon.tsx";
import { now } from "./now.ts";
import { formatRelativeTime } from "./relativeTime.ts";
import { settings, updateSettings } from "./settings.ts";
import { announce, recentAnnouncements } from "./tts.ts";

export function AnnouncementsTab() {
  return (
    <>
      <MuteToggle />
      <AnnouncementList />
    </>
  );
}

/** The same setting as "Sound" in the settings tab, within reach of a thumb. */
function MuteToggle() {
  const silent = settings.value.silent;
  return (
    <div class="announcements-header">
      <button
        type="button"
        data-silent={silent}
        onClick={() => updateSettings({ silent: !silent })}
      >
        <Icon icon={silent ? volumeXIcon : volume2Icon} />
        <span>{silent ? "Muted" : "Sound on"}</span>
      </button>
    </div>
  );
}

function AnnouncementList() {
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
