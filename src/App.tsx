import { useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Clock } from "./Clock.tsx";
import { LeftTabs } from "./LeftTabs.tsx";
import { RightTabs } from "./RightTabs.tsx";
import { SpeechBubble } from "./SpeechBubble.tsx";
import { clockFullscreen } from "./state.ts";
import { startAnnouncer } from "./tts.ts";

export function App() {
  useSignalEffect(() => {
    document.body.toggleAttribute("data-clock-fullscreen", clockFullscreen.value);
  });

  useEffect(() => {
    startAnnouncer();
  }, []);

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
      <div class="right-panel">
        <RightTabs />
      </div>
      <SpeechBubble />
    </>
  );
}
