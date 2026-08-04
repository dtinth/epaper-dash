import { addMockAnnouncement } from "./mock.ts";
import { settings, updateSettings } from "./settings.ts";

export function ConfigTab() {
  const { mode, endpoint, secret } = settings.value;
  return (
    <div class="config-tab">
      <div class="field">
        <div class="field-label">Mode</div>
        <div class="button-row">
          <button
            type="button"
            data-active={mode === "mock"}
            onClick={() => updateSettings({ mode: "mock" })}
          >
            Mock
          </button>
          <button
            type="button"
            data-active={mode === "live"}
            onClick={() => updateSettings({ mode: "live" })}
          >
            Live
          </button>
        </div>
      </div>

      <div class="field">
        <div class="field-label">Endpoint</div>
        <input
          type="url"
          value={endpoint}
          placeholder="https://example.com/rpc"
          onInput={(event) => updateSettings({ endpoint: event.currentTarget.value })}
        />
      </div>

      <div class="field">
        <div class="field-label">Secret</div>
        <input
          type="password"
          value={secret}
          placeholder="Bearer token"
          onInput={(event) => updateSettings({ secret: event.currentTarget.value })}
        />
      </div>

      {mode === "mock" ? (
        <div class="field">
          <div class="field-label">Mock events</div>
          <div class="button-row">
            <button type="button" onClick={() => addMockAnnouncement({ withAudio: true })}>
              Add announcement
            </button>
            <button type="button" onClick={() => addMockAnnouncement({ withAudio: false })}>
              Add silent one
            </button>
          </div>
        </div>
      ) : null}

      <div class="button-row">
        <button type="button" onClick={() => location.reload()}>
          Reload
        </button>
      </div>
    </div>
  );
}
