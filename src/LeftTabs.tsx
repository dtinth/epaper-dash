import scrollTextIcon from "@iconify-icons/lucide/scroll-text";
import settingsIcon from "@iconify-icons/lucide/settings";
import { ConfigTab } from "./ConfigTab.tsx";
import { LogTab } from "./LogTab.tsx";
import { activeLeftTab } from "./state.ts";
import { TabBar, type Tab } from "./TabBar.tsx";

const tabs: Tab[] = [
  { id: "config", icon: settingsIcon, content: <ConfigTab /> },
  { id: "log", icon: scrollTextIcon, content: <LogTab /> },
];

export function LeftTabs() {
  const active = activeLeftTab.value;
  const openTab = tabs.filter((tab) => tab.id === active)[0];
  return (
    <div>
      {openTab ? <div class="tab-panel">{openTab.content}</div> : null}
      <TabBar
        tabs={tabs}
        active={active}
        onSelect={(id) => {
          activeLeftTab.value = id;
        }}
      />
    </div>
  );
}
