import { useSignalEffect } from "@preact/signals";
import { Clock } from "./Clock.tsx";
import { LeftTabs } from "./LeftTabs.tsx";
import { clockFullscreen } from "./state.ts";

export function App() {
  useSignalEffect(() => {
    document.body.toggleAttribute("data-clock-fullscreen", clockFullscreen.value);
  });

  return (
    <>
      <div class="left-panel">
        <div
          class="clock-container"
          onClick={() => {
            clockFullscreen.value = !clockFullscreen.value;
          }}
        >
          <Clock />
        </div>
        <div class="tabs-container">
          <LeftTabs />
        </div>
      </div>
      <div class="right-panel"></div>
    </>
  );
}
