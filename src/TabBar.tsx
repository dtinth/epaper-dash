import type { IconifyIcon } from "@iconify/types";
import type { ComponentChildren } from "preact";
import { Icon } from "./Icon.tsx";

export interface Tab {
  id: string;
  icon: IconifyIcon;
  content: ComponentChildren;
}

/**
 * The row of icons at the bottom of a panel. Touching the open tab closes it,
 * like the tab bars in e-reader-dashboard.
 */
export function TabBar({
  tabs,
  active,
  onSelect,
}: {
  tabs: Tab[];
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div class="tab-bar">
      {tabs.map((tab) => (
        <button
          type="button"
          class="tab-button"
          key={tab.id}
          data-active={tab.id === active}
          onClick={() => onSelect(active === tab.id ? null : tab.id)}
        >
          <Icon icon={tab.icon} />
        </button>
      ))}
      <div class="tab-bar-filler"></div>
    </div>
  );
}
