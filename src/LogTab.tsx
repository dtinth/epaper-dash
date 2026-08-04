import { clearLogs, logs } from "./log.ts";

export function LogTab() {
  const entries = logs.value;
  return (
    <div class="log-tab">
      {entries.length === 0 ? (
        <div class="log-empty">No messages.</div>
      ) : (
        <ul class="log-list">
          {entries.map((entry) => (
            <li key={entry.id} data-level={entry.level}>
              <span class="log-time">{entry.time}</span>
              <span class="log-message">{entry.message}</span>
            </li>
          ))}
        </ul>
      )}
      {/* The panel hangs off the bottom of the screen, so the button belongs
          at the bottom too, where the thumb already is. */}
      <div class="button-row">
        <button type="button" onClick={clearLogs}>
          Clear
        </button>
      </div>
    </div>
  );
}
