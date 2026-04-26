import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";
import { getMeasuredIndicatorStyle, getTabsPanelId, getTabsTriggerId } from "./internal/tabs";

/* ─── Class names ─── */

const TABS_CLASS = "nds-tabs";
const TABS_ROOT_CLASS = `${TABS_CLASS}__root`;
const TABS_LIST_CLASS = `${TABS_CLASS}__list`;
const TABS_TRIGGER_CLASS = `${TABS_CLASS}__trigger`;
const TABS_INDICATOR_CLASS = `${TABS_CLASS}__indicator`;
const TABS_PANEL_CLASS = `${TABS_CLASS}__panel`;

/* ─── Types ─── */

export type TabsVariant = "line" | "pill" | "square";

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const tabsStyles = `
  :where(.${TABS_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    width: var(--nds-tabs-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* ─── List (shared) ─── */

  :where(.${TABS_LIST_CLASS}) {
    position: relative;
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ─── line variant ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="line"]) {
    background: ${cv.bg.white};
    border-bottom: 1px solid ${cv.border.light};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_TRIGGER_CLASS}) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${sizing.tabs.line}px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.text.disabled};
    padding: 0;
    transition: color ${transition.default}, font-weight ${transition.default};
    position: relative;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    color: ${cv.text.default};
    font-weight: ${fontWeight.medium};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_INDICATOR_CLASS}) {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: ${cv.text.default};
    transition: transform ${transition.slow}, width ${transition.slow};
  }

  /* ─── pill variant ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="pill"]) {
    background: ${cv.bg.white};
    padding: ${spacing[16]}px ${spacing[16]}px 0;
    gap: ${spacing[8]}px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="pill"]::-webkit-scrollbar) {
    display: none;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="pill"] .${TABS_TRIGGER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${sizing.tabs.pill}px;
    padding: 0 ${spacing[16]}px;
    background: ${cv.bg.light};
    border: none;
    border-radius: ${radius.pill}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.text.disabled};
    white-space: nowrap;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="pill"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.primary.main};
    color: ${cv.primary.fg};
  }

  /* ─── square variant ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="square"]) {
    background: ${cv.bg.light};
    border-radius: ${radius.md}px;
    padding: ${spacing[4]}px;
    gap: ${spacing[4]}px;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="square"] .${TABS_TRIGGER_CLASS}) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${sizing.tabs.square}px;
    background: transparent;
    border: none;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.text.disabled};
    padding: 0 ${spacing[12]}px;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="square"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.bg.white};
    color: ${cv.text.default};
    font-weight: ${fontWeight.medium};
    box-shadow: ${shadow.sm};
  }

  /* ─── Panel ─── */

  :where(.${TABS_PANEL_CLASS}) {
    box-sizing: border-box;
  }

  :where(.${TABS_PANEL_CLASS}[data-hidden="true"]) {
    display: none;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context ─── */

interface TabsContextValue {
  activeKey: string;
  onTabChange: (key: string) => void;
  variant: TabsVariant;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within Tabs.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface TabsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 활성 탭 키 */
  activeKey: string;
  /** 탭 변경 콜백 */
  onTabChange: (key: string) => void;
  /** 탭 스타일 변형 */
  variant?: TabsVariant;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** Root 내부 콘텐츠 (List, Panel 등) */
  children: React.ReactNode;
}

export const TabsRoot: React.FC<TabsRootProps> = ({
  activeKey,
  onTabChange,
  variant = "line",
  fullWidth = true,
  children,
  className,
  style,
  ...rest
}) => {
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ activeKey, onTabChange, variant, baseId }}>
      <div
        data-slot="root"
        className={cx(TABS_ROOT_CLASS, className)}
        style={
          {
            "--nds-tabs-width": fullWidth ? "100%" : "auto",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/* ─── Compound: List ─── */

export interface TabsListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 탭 트리거 목록 (TabsTrigger 컴포넌트들) */
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className, style, ...rest }) => {
  const { variant, activeKey } = useTabsContext();
  const listRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (variant !== "line" || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-active="true"]`);
    setIndicatorStyle(getMeasuredIndicatorStyle(activeEl));
  }, [activeKey, variant]);

  return (
    <ul
      ref={listRef}
      data-slot="list"
      data-variant={variant}
      role="tablist"
      className={cx(TABS_LIST_CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
      {variant === "line" && (
        <span
          data-slot="indicator"
          className={TABS_INDICATOR_CLASS}
          style={indicatorStyle}
          aria-hidden="true"
        />
      )}
    </ul>
  );
};

/* ─── Compound: Trigger ─── */

export interface TabsTriggerProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 탭 키 (activeKey와 비교) */
  tabKey: string;
  /** 탭 버튼에 표시할 콘텐츠 */
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  tabKey,
  children,
  className,
  onClick,
  ...rest
}) => {
  const { activeKey, onTabChange, baseId } = useTabsContext();
  const isActive = activeKey === tabKey;
  const triggerId = getTabsTriggerId(baseId, tabKey);
  const panelId = getTabsPanelId(baseId, tabKey);

  return (
    <li
      data-slot="trigger"
      data-active={isActive ? "true" : "false"}
      data-tab-key={tabKey}
      id={triggerId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={cx(TABS_TRIGGER_CLASS, className)}
      onClick={(e) => {
        onTabChange(tabKey);
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTabChange(tabKey);
        }
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
          if (!list) return;
          const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
          const idx = tabs.indexOf(e.currentTarget as HTMLElement);
          const next =
            e.key === "ArrowRight"
              ? tabs[(idx + 1) % tabs.length]
              : tabs[(idx - 1 + tabs.length) % tabs.length];
          next?.focus();
          const nextKey = next?.dataset.tabKey;
          if (nextKey) onTabChange(nextKey);
        }
        if (e.key === "Home") {
          e.preventDefault();
          const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
          const first = list?.querySelector<HTMLElement>('[role="tab"]');
          first?.focus();
          const firstKey = first?.dataset.tabKey;
          if (firstKey) onTabChange(firstKey);
        }
        if (e.key === "End") {
          e.preventDefault();
          const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
          const tabs = list?.querySelectorAll<HTMLElement>('[role="tab"]');
          const last = tabs?.[tabs.length - 1];
          last?.focus();
          const lastKey = last?.dataset.tabKey;
          if (lastKey) onTabChange(lastKey);
        }
      }}
      {...rest}
    >
      <span>{children}</span>
    </li>
  );
};

/* ─── Compound: Panel ─── */

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이 패널에 대응하는 탭 키 */
  tabKey: string;
  /** 해당 탭이 활성화될 때 표시할 패널 콘텐츠 */
  children: React.ReactNode;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({ tabKey, children, className, ...rest }) => {
  const { activeKey, baseId } = useTabsContext();
  const isHidden = activeKey !== tabKey;
  const triggerId = getTabsTriggerId(baseId, tabKey);
  const panelId = getTabsPanelId(baseId, tabKey);

  return (
    <div
      data-slot="panel"
      data-hidden={isHidden ? "true" : "false"}
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={cx(TABS_PANEL_CLASS, className)}
      {...rest}
    >
      {!isHidden && children}
    </div>
  );
};

/* ─── Flat API ─── */

export interface TabItem {
  /** 탭 고유 키 */
  key: string;
  /** 탭 버튼에 표시할 제목 */
  title: React.ReactNode;
  /** 탭 패널에 표시할 콘텐츠 */
  content?: React.ReactNode;
}

export interface TabsSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<TabsRootProps, "activeKey" | "onTabChange" | "variant" | "children">;
  /** 탭 리스트 `<ul>`에 전달할 추가 props */
  list?: Omit<TabsListProps, "children">;
  /** 각 탭 트리거 `<li>`에 공통으로 전달할 추가 props */
  trigger?: Omit<TabsTriggerProps, "tabKey" | "children">;
  /** 각 탭 패널 `<div>`에 공통으로 전달할 추가 props */
  panel?: Omit<TabsPanelProps, "tabKey" | "children">;
}

export interface TabsProps {
  /** 탭 아이템 목록 */
  items: TabItem[];
  /** 현재 활성 탭 키 */
  activeKey: string;
  /** 탭 변경 콜백 */
  onTabChange: (key: string) => void;
  /** 스타일 변형 */
  variant?: TabsVariant;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: TabsSlotProps;
}

const TabsComponent: React.FC<TabsProps> = ({
  items,
  activeKey,
  onTabChange,
  variant = "line",
  fullWidth = true,
  className,
  style,
  slotProps,
}) => (
  <TabsRoot
    activeKey={activeKey}
    onTabChange={onTabChange}
    variant={variant}
    fullWidth={fullWidth}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <TabsList className={slotProps?.list?.className} style={slotProps?.list?.style}>
      {items.map((item) => (
        <TabsTrigger
          key={item.key}
          tabKey={item.key}
          className={slotProps?.trigger?.className}
          style={slotProps?.trigger?.style}
        >
          {item.title}
        </TabsTrigger>
      ))}
    </TabsList>
    {items.some((item) => item.content !== undefined) &&
      items.map((item) => (
        <TabsPanel
          key={item.key}
          tabKey={item.key}
          className={slotProps?.panel?.className}
          style={slotProps?.panel?.style}
        >
          {item.content}
        </TabsPanel>
      ))}
  </TabsRoot>
);

TabsComponent.displayName = "Tabs";

/* ─── Export: Flat + Compound ─── */

export const Tabs = Object.assign(TabsComponent, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});
