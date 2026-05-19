import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";
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
 * - `line` : 하단 밑줄(언더라인) 탭. Mobile · PC 지원.
 * - `chip` : 알약(Pill) 탭. Mobile · PC 지원.
 * - `segment` : 균등 분할 세그먼트 탭. **PC 전용** (CMS).
 */
export type TabsVariant = "line" | "chip" | "segment";

/**
 * 사이즈 컨텍스트 (Mobile / PC).
 * 높이, 패딩, 폰트가 사이즈별로 다르게 적용된다.
 * Segment 변형은 PC만 지원하므로 size를 무시한다.
 */
export type TabsSize = "mobile" | "pc";

/**
 * 톤 (활성 상태 강조 컬러).
 * - `neutral` : 검정 텍스트/슬레이트 배경 강조.
 * - `color`   : 브랜드 컬러(primary) 강조.
 * Segment 변형은 항상 `neutral` 톤이다.
 */
export type TabsTone = "neutral" | "color";

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

  :where(.${TABS_TRIGGER_CLASS}) {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: color ${transition.default}, background-color ${transition.default}, font-weight ${transition.default};
  }

  :where(.${TABS_TRIGGER_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    color: ${cv.textRole.muted};
    pointer-events: none;
  }

  :where(.${TABS_TRIGGER_INNER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-default);
  }

  :where(.${TABS_TRIGGER_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  /* ─── line variant ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="line"]) {
    background: ${cv.surface.default};
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_TRIGGER_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    padding: 0;
    position: relative;
    white-space: nowrap;
  }

  /* Mobile line tabs: 4글자 라벨이 ~360px 뷰포트에서 잘리지 않도록 좌우 padding
   * 을 inset-input(12) 으로 축소. 글자 수가 더 많으면 ellipsis 로 잘린다. */
  :where(.${TABS_LIST_CLASS}[data-variant="line"][data-size="mobile"] .${TABS_TRIGGER_CLASS}) {
    height: ${sizing.tabs.line.mobile}px;
    padding: 0 var(--inset-input);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"][data-size="pc"] .${TABS_TRIGGER_CLASS}) {
    height: ${sizing.tabs.line.pc}px;
    padding: 0 var(--inset-card-large);
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"][data-tone="color"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    color: ${cv.textRole.brand};
  }

  @media (hover: hover) {
    :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      color: ${cv.textRole.strong};
      background: ${cv.surface.subtle};
    }
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"] .${TABS_INDICATOR_CLASS}) {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: ${cv.textRole.strong};
    transition: transform ${transition.slow}, width ${transition.slow}, background ${transition.default};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="line"][data-tone="color"] .${TABS_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
  }

  /* ─── chip variant ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="chip"]) {
    background: ${cv.surface.default};
    gap: var(--gap-default);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"][data-size="mobile"]) {
    padding: 0 var(--inset-card);
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"]::-webkit-scrollbar) {
    display: none;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"] .${TABS_TRIGGER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.subtle};
    color: ${cv.textRole.subtle};
    white-space: nowrap;
    font-weight: ${fontWeight.regular};
    flex: 0 0 auto;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"][data-size="mobile"] .${TABS_TRIGGER_CLASS}) {
    height: ${sizing.tabs.chip.mobile}px;
    padding: 0 var(--inset-input);
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"][data-size="pc"] .${TABS_TRIGGER_CLASS}) {
    height: ${sizing.tabs.chip.pc}px;
    padding: 0 var(--inset-card);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"][data-tone="color"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.bold};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="chip"][data-tone="neutral"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.fill.neutral};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.bold};
  }

  @media (hover: hover) {
    :where(.${TABS_LIST_CLASS}[data-variant="chip"] .${TABS_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      background: ${cv.surface.section};
      color: ${cv.textRole.strong};
    }
  }

  /* ─── segment variant (PC only) ─── */

  :where(.${TABS_LIST_CLASS}[data-variant="segment"]) {
    background: ${cv.surface.default};
    gap: 0;
  }

  :where(.${TABS_LIST_CLASS}[data-variant="segment"] .${TABS_TRIGGER_CLASS}) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${sizing.tabs.segment.pc}px;
    padding: 0 var(--inset-card);
    background: ${cv.surface.page};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="segment"] .${TABS_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.fill.neutral};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.bold};
  }

  :where(.${TABS_LIST_CLASS}[data-variant="segment"] .${TABS_TRIGGER_CLASS}[data-active="true"] .${TABS_TRIGGER_ICON_CLASS}) {
    color: ${cv.iconRole.inverse};
  }

  @media (hover: hover) {
    :where(.${TABS_LIST_CLASS}[data-variant="segment"] .${TABS_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      background: ${cv.surface.subtle};
      color: ${cv.textRole.strong};
    }
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

const resolveSize = (variant: TabsVariant, size: TabsSize): TabsSize =>
  variant === "segment" ? "pc" : size;

const resolveTone = (variant: TabsVariant, tone: TabsTone): TabsTone =>
  variant === "segment" ? "neutral" : tone;

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
  /** 사이즈 (Mobile / PC). 기본 `pc`. Segment는 항상 `pc` */
  size?: TabsSize;
  /** 톤 (활성 강조 색). 기본 `neutral`. Segment는 항상 `neutral` */
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
  const resolvedSize = resolveSize(variant, size);
  const resolvedTone = resolveTone(variant, tone);

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
  /** Segment 변형에서 텍스트 앞에 표시할 아이콘 노드 */
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
  /** 사이즈 (Mobile / PC). 기본 `pc`. Segment는 무시되고 `pc`로 고정 */
  size?: TabsSize;
  /** 톤 (활성 강조 색). 기본 `neutral`. Segment는 무시되고 `neutral`로 고정 */
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
