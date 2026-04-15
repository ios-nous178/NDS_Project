import type React from "react";

const sanitizeKey = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

export const getTabsTriggerId = (baseId: string, tabKey: string) =>
  `${baseId}-tab-${sanitizeKey(tabKey)}`;

export const getTabsPanelId = (baseId: string, tabKey: string) =>
  `${baseId}-panel-${sanitizeKey(tabKey)}`;

export const getMeasuredIndicatorStyle = (activeEl: HTMLElement | null): React.CSSProperties => {
  if (!activeEl) return {};

  return {
    width: `${activeEl.offsetWidth}px`,
    transform: `translateX(${activeEl.offsetLeft}px)`,
  };
};
