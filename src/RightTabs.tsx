import megaphoneIcon from "@iconify-icons/lucide/megaphone";
import { AnnouncementsTab } from "./AnnouncementsTab.tsx";
import { activeRightTab } from "./state.ts";
import { TabBar, type Tab } from "./TabBar.tsx";

const tabs: Tab[] = [{ id: "announcements", icon: megaphoneIcon, content: <AnnouncementsTab /> }];

export function RightTabs() {
  const active = activeRightTab.value;
  const openTab = tabs.filter((tab) => tab.id === active)[0];
  return (
    <div class="right-tabs">
      <div class="right-tabs-panel">{openTab ? openTab.content : null}</div>
      <TabBar
        tabs={tabs}
        active={active}
        onSelect={(id) => {
          activeRightTab.value = id;
        }}
      />
    </div>
  );
}
