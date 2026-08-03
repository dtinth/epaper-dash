/**
 * Placeholder for the settings panel. The plan is to let the device store a
 * connection string here; without one, the dashboard falls back to mock data.
 */
export function ConfigTab() {
  return (
    <div class="config-tab">
      <div class="config-tab-title">Configuration</div>
      <p>No connection string. The dashboard shows mock data.</p>
    </div>
  );
}
