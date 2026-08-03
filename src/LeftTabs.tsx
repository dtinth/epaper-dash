import settingsIcon from "@iconify-icons/lucide/settings";
import type { IconifyIcon } from "@iconify/types";
import type { ComponentChildren } from "preact";
import { ConfigTab } from "./ConfigTab.tsx";
import { Icon } from "./Icon.tsx";
import { activeLeftTab } from "./state.ts";

interface Tab {
  id: string;
  icon: IconifyIcon;
  content: ComponentChildren;
}

const tabs: Tab[] = [{ id: "config", icon: settingsIcon, content: <ConfigTab /> }];

export function LeftTabs() {
  const active = activeLeftTab.value;
  return (
    <div>
      {tabs
        .filter((tab) => tab.id === active)
        .map((tab) => (
          <div class="tab-panel" key={tab.id}>
            {tab.content}
          </div>
        ))}
      <div class="tab-bar">
        {tabs.map((tab) => (
          <button
            type="button"
            class="tab-button"
            key={tab.id}
            data-active={tab.id === active}
            onClick={() => {
              activeLeftTab.value = active === tab.id ? null : tab.id;
            }}
          >
            <Icon icon={tab.icon} />
          </button>
        ))}
        <div class="tab-bar-filler"></div>
      </div>
    </div>
  );
}
