import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";

import { getMeasuredIndicatorStyle, getTabPanelId, getTabTriggerId } from "./internal/tabs.js";

/* ─── Class names ─── */

const TAB_CLASS = "nds-tab";
const TAB_ROOT_CLASS = `${TAB_CLASS}__root`;
const TAB_LIST_CLASS = `${TAB_CLASS}__list`;
const TAB_TRIGGER_CLASS = `${TAB_CLASS}__trigger`;
const TAB_TRIGGER_INNER_CLASS = `${TAB_CLASS}__trigger-inner`;
const TAB_TRIGGER_ICON_CLASS = `${TAB_CLASS}__trigger-icon`;
const TAB_INDICATOR_CLASS = `${TAB_CLASS}__indicator`;
const TAB_PANEL_CLASS = `${TAB_CLASS}__panel`;

/* ─── Types ─── */

/**
 * Tab 변형.
 * - `line`    : 하단 밑줄(언더라인) 탭. Mobile · PC 지원.
 * - `chip`    : 알약(Pill) 탭. Mobile · PC 지원.
 * - `segment` : 연결된 회색 트랙 위 균등 분할 단일선택(iOS 세그먼트). active = 흰색 떠오름.
 *               뷰/기간/상태 토글용. Mobile(36) · PC(40, 아이콘 동반). 구 SegmentedControl 흡수.
 */
export type TabVariant = "line" | "chip" | "segment";

/**
 * 사이즈 컨텍스트 (Mobile / PC).
 * 높이, 패딩, 폰트가 사이즈별로 다르게 적용된다.
 */
export type TabSize = "mobile" | "pc";

/**
 * 톤 (활성 상태 강조 컬러).
 * - `neutral` : 검정 텍스트/슬레이트 배경 강조.
 * - `color`   : 브랜드 컬러(primary) 강조.
 */
export type TabTone = "neutral" | "color";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context ─── */

interface TabContextValue {
  activeKey: string;
  onTabChange: (key: string) => void;
  variant: TabVariant;
  size: TabSize;
  tone: TabTone;
  baseId: string;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const useTabContext = () => {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("Tab compound components must be used within Tab.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface TabRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 활성 탭 키 */
  activeKey: string;
  /** 탭 변경 콜백 */
  onTabChange: (key: string) => void;
  /** 탭 스타일 변형 (`line` | `chip` | `segment`). 기본 `line` */
  variant?: TabVariant;
  /** 사이즈 (Mobile / PC). 기본 `pc` */
  size?: TabSize;
  /** 톤 (활성 강조 색). 기본 `neutral` */
  tone?: TabTone;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** Root 내부 콘텐츠 (List, Panel 등) */
  children: React.ReactNode;
}

export const TabRoot: React.FC<TabRootProps> = ({
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
    <TabContext.Provider
      value={{ activeKey, onTabChange, variant, size: resolvedSize, tone: resolvedTone, baseId }}
    >
      <div
        data-slot="root"
        className={cx(TAB_ROOT_CLASS, className)}
        style={
          {
            "--nds-tab-width": fullWidth ? "100%" : "auto",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </TabContext.Provider>
  );
};

/* ─── Compound: List ─── */

export interface TabListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 탭 트리거 목록 (TabTrigger 컴포넌트들) */
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ children, className, style, ...rest }) => {
  const { variant, size, tone, activeKey } = useTabContext();
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
      className={cx(TAB_LIST_CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
      {variant === "line" && (
        <span
          data-slot="indicator"
          className={TAB_INDICATOR_CLASS}
          style={indicatorStyle}
          aria-hidden="true"
        />
      )}
    </ul>
  );
};

/* ─── Compound: Trigger ─── */

export interface TabTriggerProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 탭 키 (activeKey와 비교) */
  tabKey: string;
  /** 탭 버튼에 표시할 콘텐츠 */
  children: React.ReactNode;
  /** 텍스트 앞에 표시할 아이콘 노드 (선택) */
  icon?: React.ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  tabKey,
  children,
  icon,
  disabled,
  className,
  onClick,
  ...rest
}) => {
  const { activeKey, onTabChange, baseId } = useTabContext();
  const isActive = activeKey === tabKey;
  const triggerId = getTabTriggerId(baseId, tabKey);
  const panelId = getTabPanelId(baseId, tabKey);

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
      className={cx(TAB_TRIGGER_CLASS, className)}
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
      <span className={TAB_TRIGGER_INNER_CLASS}>
        {icon && (
          <span className={TAB_TRIGGER_ICON_CLASS} aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    </li>
  );
};

/* ─── Compound: Panel ─── */

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이 패널에 대응하는 탭 키 */
  tabKey: string;
  /** 해당 탭이 활성화될 때 표시할 패널 콘텐츠 */
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ tabKey, children, className, ...rest }) => {
  const { activeKey, baseId } = useTabContext();
  const isHidden = activeKey !== tabKey;
  const triggerId = getTabTriggerId(baseId, tabKey);
  const panelId = getTabPanelId(baseId, tabKey);

  return (
    <div
      data-slot="panel"
      data-hidden={isHidden ? "true" : "false"}
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={cx(TAB_PANEL_CLASS, className)}
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

export interface TabSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<
    TabRootProps,
    "activeKey" | "onTabChange" | "variant" | "size" | "tone" | "children"
  >;
  /** 탭 리스트 `<ul>`에 전달할 추가 props */
  list?: Omit<TabListProps, "children">;
  /** 각 탭 트리거 `<li>`에 공통으로 전달할 추가 props */
  trigger?: Omit<TabTriggerProps, "tabKey" | "children" | "icon" | "disabled">;
  /** 각 탭 패널 `<div>`에 공통으로 전달할 추가 props */
  panel?: Omit<TabPanelProps, "tabKey" | "children">;
}

export interface TabProps {
  /** 탭 아이템 목록 */
  items: TabItem[];
  /** 현재 활성 탭 키 */
  activeKey: string;
  /** 탭 변경 콜백 */
  onTabChange: (key: string) => void;
  /** 스타일 변형 (`line` | `chip` | `segment`). 기본 `line` */
  variant?: TabVariant;
  /** 사이즈 (Mobile / PC). 기본 `pc` */
  size?: TabSize;
  /** 톤 (활성 강조 색). 기본 `neutral` */
  tone?: TabTone;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: TabSlotProps;
}

const TabComponent: React.FC<TabProps> = ({
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
  <TabRoot
    activeKey={activeKey}
    onTabChange={onTabChange}
    variant={variant}
    size={size}
    tone={tone}
    fullWidth={fullWidth}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <TabList className={slotProps?.list?.className} style={slotProps?.list?.style}>
      {items.map((item) => (
        <TabTrigger
          key={item.key}
          tabKey={item.key}
          icon={item.icon}
          disabled={item.disabled}
          className={slotProps?.trigger?.className}
          style={slotProps?.trigger?.style}
        >
          {item.title}
        </TabTrigger>
      ))}
    </TabList>
    {items.some((item) => item.content !== undefined) &&
      items.map((item) => (
        <TabPanel
          key={item.key}
          tabKey={item.key}
          className={slotProps?.panel?.className}
          style={slotProps?.panel?.style}
        >
          {item.content}
        </TabPanel>
      ))}
  </TabRoot>
);

TabComponent.displayName = "Tab";

/* ─── Export: Flat + Compound ─── */

export const Tab = Object.assign(TabComponent, {
  Root: TabRoot,
  List: TabList,
  Trigger: TabTrigger,
  Panel: TabPanel,
});
