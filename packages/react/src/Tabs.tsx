import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";

import { getMeasuredIndicatorStyle, getTabsPanelId, getTabsTriggerId } from "./internal/tabs";

/* ─── Class names ─── */

const TABS_CLASS = "nds-tabs";
const TABS_ROOT_CLASS = `${TABS_CLASS}__root`;
const TABS_LIST_CLASS = `${TABS_CLASS}__list`;
const TABS_TRIGGER_CLASS = `${TABS_CLASS}__trigger`;
const TABS_TRIGGER_INNER_CLASS = `${TABS_CLASS}__trigger-inner`;
const TABS_TRIGGER_ICON_CLASS = `${TABS_CLASS}__trigger-icon`;
const TABS_INDICATOR_CLASS = `${TABS_CLASS}__indicator`;
const TABS_PANEL_CLASS = `${TABS_CLASS}__panel`;

/* ─── Types ─── */

/**
 * Tabs 변형.
 * - `line`    : 하단 밑줄(언더라인) 탭. Mobile · PC 지원.
 * - `chip`    : 알약(Pill) 탭. Mobile · PC 지원.
 * - `segment` : 연결된 회색 트랙 위 균등 분할 단일선택(iOS 세그먼트). active = 흰색 떠오름.
 *               뷰/기간/상태 토글용. Mobile(36) · PC(40, 아이콘 동반). 구 SegmentedControl 흡수.
 */
export type TabsVariant = "line" | "chip" | "segment";

/**
 * 사이즈 컨텍스트 (Mobile / PC).
 * 높이, 패딩, 폰트가 사이즈별로 다르게 적용된다.
 */
export type TabsSize = "mobile" | "pc";

/**
 * 톤 (활성 상태 강조 컬러).
 * - `neutral` : 검정 텍스트/슬레이트 배경 강조.
 * - `color`   : 브랜드 컬러(primary) 강조.
 */
export type TabsTone = "neutral" | "color";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context ─── */

interface TabsContextValue {
  activeKey: string;
  onTabChange: (key: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  tone: TabsTone;
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
  /** 탭 스타일 변형 (`line` | `chip` | `segment`). 기본 `line` */
  variant?: TabsVariant;
  /** 사이즈 (Mobile / PC). 기본 `pc` */
  size?: TabsSize;
  /** 톤 (활성 강조 색). 기본 `neutral` */
  tone?: TabsTone;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** Root 내부 콘텐츠 (List, Panel 등) */
  children: React.ReactNode;
}

export const TabsRoot: React.FC<TabsRootProps> = ({
  activeKey,
  onTabChange,
  variant = "line",
  size = "pc",
  tone = "neutral",
  fullWidth = true,
  children,
  className,
  style,
  ...rest
}) => {
  const baseId = useId();
  const resolvedSize = size;
  const resolvedTone = tone;

  return (
    <TabsContext.Provider
      value={{ activeKey, onTabChange, variant, size: resolvedSize, tone: resolvedTone, baseId }}
    >
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
  const { variant, size, tone, activeKey } = useTabsContext();
  const listRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (variant !== "line" || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-active="true"]`);
    setIndicatorStyle(getMeasuredIndicatorStyle(activeEl));
  }, [activeKey, variant, size]);

  return (
    <ul
      ref={listRef}
      data-slot="list"
      data-variant={variant}
      data-size={size}
      data-tone={tone}
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
  /** 텍스트 앞에 표시할 아이콘 노드 (선택) */
  icon?: React.ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  tabKey,
  children,
  icon,
  disabled,
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
      data-disabled={disabled ? "true" : "false"}
      data-tab-key={tabKey}
      id={triggerId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : isActive ? 0 : -1}
      className={cx(TABS_TRIGGER_CLASS, className)}
      onClick={(e) => {
        if (disabled) return;
        onTabChange(tabKey);
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTabChange(tabKey);
        }
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
          if (!list) return;
          const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
            (el) => el.getAttribute("aria-disabled") !== "true",
          );
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
          const first = list?.querySelector<HTMLElement>(
            '[role="tab"]:not([aria-disabled="true"])',
          );
          first?.focus();
          const firstKey = first?.dataset.tabKey;
          if (firstKey) onTabChange(firstKey);
        }
        if (e.key === "End") {
          e.preventDefault();
          const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
          const tabs = list?.querySelectorAll<HTMLElement>(
            '[role="tab"]:not([aria-disabled="true"])',
          );
          const last = tabs?.[tabs.length - 1];
          last?.focus();
          const lastKey = last?.dataset.tabKey;
          if (lastKey) onTabChange(lastKey);
        }
      }}
      {...rest}
    >
      <span className={TABS_TRIGGER_INNER_CLASS}>
        {icon && (
          <span className={TABS_TRIGGER_ICON_CLASS} aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
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
  /** Segment 변형에서 텍스트 앞에 표시할 아이콘 */
  icon?: React.ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface TabsSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<
    TabsRootProps,
    "activeKey" | "onTabChange" | "variant" | "size" | "tone" | "children"
  >;
  /** 탭 리스트 `<ul>`에 전달할 추가 props */
  list?: Omit<TabsListProps, "children">;
  /** 각 탭 트리거 `<li>`에 공통으로 전달할 추가 props */
  trigger?: Omit<TabsTriggerProps, "tabKey" | "children" | "icon" | "disabled">;
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
  /** 스타일 변형 (`line` | `chip` | `segment`). 기본 `line` */
  variant?: TabsVariant;
  /** 사이즈 (Mobile / PC). 기본 `pc` */
  size?: TabsSize;
  /** 톤 (활성 강조 색). 기본 `neutral` */
  tone?: TabsTone;
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
  size = "pc",
  tone = "neutral",
  fullWidth = true,
  className,
  style,
  slotProps,
}) => (
  <TabsRoot
    activeKey={activeKey}
    onTabChange={onTabChange}
    variant={variant}
    size={size}
    tone={tone}
    fullWidth={fullWidth}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <TabsList className={slotProps?.list?.className} style={slotProps?.list?.style}>
      {items.map((item) => (
        <TabsTrigger
          key={item.key}
          tabKey={item.key}
          icon={item.icon}
          disabled={item.disabled}
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
