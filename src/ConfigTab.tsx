/**
 * Placeholder for the settings panel. The plan is to let the device store a
 * connection string here; without one, the dashboard falls back to mock data.
 */
export function ConfigTab() {
  return (
    <div class="config-tab">
      <div class="config-tab-title">Configuration</div>
      <p>No connection string. The dashboard shows mock data.</p>
      <div class="config-tab-buttons">
        <button type="button" onClick={() => location.reload()}>
          Reload
        </button>
        <button type="button" onClick={enterFullScreen}>
          Full Screen
        </button>
      </div>
    </div>
  );
}

function enterFullScreen() {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => void;
  };
  if (el.requestFullscreen) {
    // Older engines reject rather than throw; there is nothing to fall back to.
    void el.requestFullscreen().catch(() => {});
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}
