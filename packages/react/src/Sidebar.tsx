import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const SB_CLASS = "nds-sidebar";
const SB_ROOT_CLASS = `${SB_CLASS}__root`;
const SB_HEADER_CLASS = `${SB_CLASS}__header`;
const SB_LOGO_CLASS = `${SB_CLASS}__logo`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_SUBTITLE_CLASS = `${SB_CLASS}__subtitle`;
const SB_TOGGLE_CLASS = `${SB_CLASS}__toggle`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_SECTION_CLASS = `${SB_CLASS}__section`;
const SB_SECTION_LABEL_CLASS = `${SB_CLASS}__section-label`;
const SB_ITEM_LIST_CLASS = `${SB_CLASS}__item-list`;
const SB_ITEM_CLASS = `${SB_CLASS}__item`;
const SB_ITEM_INNER_CLASS = `${SB_CLASS}__item-inner`;
const SB_ITEM_ICON_CLASS = `${SB_CLASS}__item-icon`;
const SB_ITEM_LABEL_CLASS = `${SB_CLASS}__item-label`;
const SB_ITEM_BADGE_CLASS = `${SB_CLASS}__item-badge`;
const SB_ITEM_CARET_CLASS = `${SB_CLASS}__item-caret`;
const SB_CHILDREN_CLASS = `${SB_CLASS}__children`;
const SB_FOOTER_CLASS = `${SB_CLASS}__footer`;
const SB_USER_CLASS = `${SB_CLASS}__user`;
const SB_USER_AVATAR_CLASS = `${SB_CLASS}__user-avatar`;
const SB_USER_META_CLASS = `${SB_CLASS}__user-meta`;
const SB_USER_NAME_CLASS = `${SB_CLASS}__user-name`;
const SB_USER_ROLE_CLASS = `${SB_CLASS}__user-role`;

/* ─── Types ─── */

export interface SidebarItem {
  /** Stable key used for `activeKey` matching. */
  key: string;
  /** Label text (or React node). */
  label: React.ReactNode;
  /** Leading icon node. Recommended size 20×20. */
  icon?: React.ReactNode;
  /** Link target — when set, item renders as `<a>`. */
  href?: string;
  /** Click handler — invoked together with `onItemClick`. */
  onClick?: (e: React.MouseEvent) => void;
  /** Badge node or numeric count (shown as pill). */
  badge?: React.ReactNode | number;
  /** Disable item interaction. */
  disabled?: boolean;
  /** Nested children (1 level). */
  children?: SidebarItem[];
}

export interface SidebarSection {
  /** Stable key for the section. */
  key: string;
  /** Optional section heading label. */
  label?: React.ReactNode;
  /** Items in this section. */
  items: SidebarItem[];
}

export interface SidebarUser {
  name: React.ReactNode;
  role?: React.ReactNode;
  avatar?: string;
  avatarAlt?: string;
}

export interface SidebarLogo {
  /** Image src. If `element` provided, that wins. */
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Custom element (overrides src). */
  element?: React.ReactNode;
  href?: string;
}

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Either a flat item list or grouped sections. */
  items: SidebarItem[] | SidebarSection[];
  /** Currently active item key. */
  activeKey?: string;
  /** Click callback (fires after the item's own onClick). */
  onItemClick?: (item: SidebarItem) => void;
  /** Width when expanded. */
  width?: number;
  /** Width when collapsed (icon-only). */
  collapsedWidth?: number;
  /** Collapsed (icon-only) mode. */
  collapsed?: boolean;
  /** Toggle button callback. When provided, a toggle is shown in header. */
  onToggleCollapse?: () => void;
  /** Brand logo (image or custom element). */
  logo?: SidebarLogo;
  /** Title shown next to logo (e.g. business name). */
  title?: React.ReactNode;
  /** Optional subtitle (e.g. business plan). */
  subtitle?: React.ReactNode;
  /** Override the entire header area. */
  header?: React.ReactNode;
  /** Footer content (replaces the user block if both provided). */
  footer?: React.ReactNode;
  /** Convenience footer: user avatar + name + role + click action. */
  user?: SidebarUser;
  /** Make sidebar fill the viewport height. @default true */
  fullHeight?: boolean;
  /** Render as `<aside>` (default) or another tag. */
  as?: keyof React.JSX.IntrinsicElements;
}

/* ─── Helpers ─── */

const cx = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

function isSectionList(input: SidebarItem[] | SidebarSection[]): input is SidebarSection[] {
  if (!Array.isArray(input) || input.length === 0) return false;
  const first = input[0] as { items?: unknown };
  return Array.isArray(first.items);
}

function normalizeSections(input: SidebarItem[] | SidebarSection[]): SidebarSection[] {
  if (isSectionList(input)) return input;
  return [{ key: "__default", items: input }];
}

function containsKey(items: SidebarItem[] | undefined, key: string | undefined): boolean {
  if (!items || !key) return false;
  for (const it of items) {
    if (it.key === key) return true;
    if (it.children && containsKey(it.children, key)) return true;
  }
  return false;
}

/* ─── Styles (token-driven, brand-aware via --nds-sidebar-*) ─── */

const sidebarStyles = `
  :where(.${SB_ROOT_CLASS}) {
    --nds-sidebar-width: 300px;
    --nds-sidebar-collapsed-width: 72px;
    --nds-sidebar-bg: ${cv.surface.default};
    --nds-sidebar-border-color: ${cv.borderRole.subtle};
    --nds-sidebar-text: ${cv.textRole.normal};
    --nds-sidebar-text-subtle: ${cv.textRole.subtle};
    --nds-sidebar-icon: ${cv.iconRole.normal};
    --nds-sidebar-icon-active: ${cv.iconRole.strong};
    --nds-sidebar-text-active: ${cv.textRole.strong};
    --nds-sidebar-item-radius: 16px;
    --nds-sidebar-item-active-radius: 12px;
    --nds-sidebar-item-hover-bg: ${cv.surface.section};
    --nds-sidebar-item-active-bg: ${cv.surface.brandSubtle};
    --nds-sidebar-item-active-accent: ${cv.fill.brand};

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: var(--nds-sidebar-width);
    background: var(--nds-sidebar-bg);
    border-right: 1px solid var(--nds-sidebar-border-color);
    font-family: ${fontFamily.web};
    color: var(--nds-sidebar-text);
    box-sizing: border-box;
    transition: width 0.18s ease;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"]) {
    width: var(--nds-sidebar-collapsed-width);
  }

  :where(.${SB_ROOT_CLASS}[data-full-height="true"]) {
    height: 100vh;
    position: sticky;
    top: 0;
  }

  /* ── Header (Figma 168:1267: 36px avatar + gap 12 + bold 16 title + caption13 subtitle) ───── */
  :where(.${SB_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[32]}px ${spacing[24]}px ${spacing[16]}px ${spacing[24]}px;
    box-sizing: border-box;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_HEADER_CLASS}) {
    padding: ${spacing[24]}px ${spacing[12]}px;
    justify-content: center;
  }

  :where(.${SB_LOGO_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: inherit;
    text-decoration: none;
  }

  :where(.${SB_LOGO_CLASS} img) {
    display: block;
    max-height: 28px;
    width: auto;
  }

  :where(.${SB_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: 20px;
    font-weight: ${fontWeight.bold};
    color: var(--nds-sidebar-text-active);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${SB_SUBTITLE_CLASS}) {
    margin: 4px 0 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${SB_TOGGLE_CLASS}) {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: var(--nds-sidebar-icon);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${SB_TOGGLE_CLASS}:hover) {
    background: var(--nds-sidebar-item-hover-bg);
    color: var(--nds-sidebar-icon-active);
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SUBTITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TOGGLE_CLASS}) {
    display: none;
  }

  /* ── Body / Sections (Figma 168:1252: section py-28, 1px top border #EEE) ───── */
  :where(.${SB_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 ${spacing[24]}px ${spacing[24]}px;
    -webkit-overflow-scrolling: touch;
  }

  :where(.${SB_SECTION_CLASS}) {
    padding: ${spacing[28]}px 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${SB_SECTION_CLASS} + .${SB_SECTION_CLASS}) {
    border-top: 1px solid var(--nds-sidebar-border-color);
  }

  :where(.${SB_SECTION_LABEL_CLASS}) {
    padding: 0 ${spacing[10]}px 0 ${spacing[20]}px;
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: ${fontWeight.medium};
    color: var(--nds-sidebar-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SECTION_LABEL_CLASS}) {
    display: none;
  }

  :where(.${SB_ITEM_LIST_CLASS}) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  /* ── Item ─────────────────────────────────────────── */
  :where(.${SB_ITEM_CLASS}) {
    position: relative;
  }

  :where(.${SB_ITEM_INNER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[10]}px;
    width: 100%;
    height: 42px;
    padding: ${spacing[12]}px ${spacing[20]}px;
    border: none;
    background: transparent;
    border-radius: var(--nds-sidebar-item-radius);
    color: var(--nds-sidebar-text);
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    box-sizing: border-box;
    transition: background 0.12s ease, color 0.12s ease, border-radius 0.12s ease;
  }

  :where(.${SB_ITEM_INNER_CLASS}:hover) {
    background: var(--nds-sidebar-item-hover-bg);
    color: var(--nds-sidebar-text-active);
  }

  :where(.${SB_ITEM_INNER_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.focus};
    outline-offset: -2px;
  }

  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"]) {
    background: var(--nds-sidebar-item-active-bg);
    color: var(--nds-sidebar-text-active);
    border-radius: var(--nds-sidebar-item-active-radius);
    font-weight: ${fontWeight.medium};
  }

  :where(.${SB_ITEM_INNER_CLASS}[aria-disabled="true"]) {
    color: ${cv.textRole.disabled};
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${SB_ITEM_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: var(--nds-sidebar-icon);
  }

  :where(.${SB_ITEM_INNER_CLASS}:hover .${SB_ITEM_ICON_CLASS}),
  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"] .${SB_ITEM_ICON_CLASS}) {
    color: var(--nds-sidebar-icon-active);
  }

  :where(.${SB_ITEM_LABEL_CLASS}) {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_LABEL_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_BADGE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_CARET_CLASS}) {
    display: none;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}) {
    justify-content: center;
    padding: 0;
    gap: 0;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}[aria-current="page"]::before) {
    display: none;
  }

  :where(.${SB_ITEM_BADGE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 6px;
    border-radius: 9px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    font-size: ${typeScale.label.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    box-sizing: border-box;
  }

  :where(.${SB_ITEM_CARET_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--nds-sidebar-text-subtle);
    transition: transform 0.18s ease;
  }

  :where(.${SB_ITEM_CARET_CLASS}[data-expanded="true"]) {
    transform: rotate(90deg);
  }

  /* ── Children (nested level) ──────────────────────── */
  :where(.${SB_CHILDREN_CLASS}) {
    list-style: none;
    margin: ${spacing[2]}px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${SB_CHILDREN_CLASS} .${SB_ITEM_INNER_CLASS}) {
    height: 36px;
    padding-left: ${spacing[40]}px;
    font-weight: ${fontWeight.regular};
    font-size: ${typeScale.body3.fontSize}px;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_CHILDREN_CLASS}) {
    display: none;
  }

  /* ── Footer / User (Figma 168:1267: 36×36 rounded-8 avatar + 16 Bold name + 13 caption role) ───── */
  :where(.${SB_FOOTER_CLASS}) {
    padding: ${spacing[12]}px ${spacing[24]}px ${spacing[24]}px;
    box-sizing: border-box;
  }

  :where(.${SB_USER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[8]}px;
    border-radius: 8px;
  }

  :where(button.${SB_USER_CLASS}) {
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
  }

  :where(button.${SB_USER_CLASS}:hover) {
    background: var(--nds-sidebar-item-hover-bg);
  }

  :where(.${SB_USER_AVATAR_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    flex-shrink: 0;
    background: ${cv.borderRole.strong};
    color: ${cv.textRole.inverse};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: 1.5;
    font-weight: ${fontWeight.semibold};
    overflow: hidden;
  }

  :where(.${SB_USER_AVATAR_CLASS} img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${SB_USER_META_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
  }

  :where(.${SB_USER_NAME_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: var(--nds-sidebar-text-active);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${SB_USER_ROLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_META_CLASS}) {
    display: none;
  }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_CLASS}) {
    justify-content: center;
    padding: ${spacing[4]}px;
  }
`;

/* ─── Brand presets ─── */

// Cashpobi 가이드 (Figma 168:1250 실측): 활성 아이템 bg = #FFF4C0 (Yellow/200 톤),
// radius 12 (idle 16 → 12 로 좁아짐). 텍스트는 #383838 유지 (Bold 가 아니라 Medium 유지).
// `data-brand="cashpobi"` 가 :root 에 박혔을 때만 자동 적용.

const sidebarCashpobiTuning = `
  :where([data-brand="cashpobi"] .${SB_ROOT_CLASS}) {
    --nds-sidebar-item-active-bg: #FFF4C0;
    --nds-sidebar-item-active-radius: 12px;
    --nds-sidebar-item-active-accent: #FFD200;
    --nds-sidebar-text-active: #383838;
  }
`;

/* ─── Item renderer ─── */

interface ItemRowProps {
  item: SidebarItem;
  activeKey?: string;
  onItemClick?: (item: SidebarItem) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  depth?: number;
}

const CaretIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  activeKey,
  onItemClick,
  expanded,
  onToggleExpand,
  depth = 0,
}) => {
  const isActive = activeKey === item.key;
  const hasChildren = !!item.children?.length;

  const renderInner = () => (
    <>
      {item.icon !== undefined && (
        <span className={SB_ITEM_ICON_CLASS} aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className={SB_ITEM_LABEL_CLASS}>{item.label}</span>
      {item.badge !== undefined && item.badge !== null && item.badge !== false && (
        <span className={SB_ITEM_BADGE_CLASS}>{item.badge}</span>
      )}
      {hasChildren && (
        <span className={SB_ITEM_CARET_CLASS} data-expanded={expanded ? "true" : "false"}>
          <CaretIcon />
        </span>
      )}
    </>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) return;
    if (hasChildren) {
      e.preventDefault();
      onToggleExpand();
      return;
    }
    item.onClick?.(e);
    onItemClick?.(item);
  };

  const commonProps = {
    className: SB_ITEM_INNER_CLASS,
    "aria-current": isActive ? ("page" as const) : undefined,
    "aria-disabled": item.disabled ? true : undefined,
    "aria-expanded": hasChildren ? expanded : undefined,
    "data-depth": depth,
    title: typeof item.label === "string" ? item.label : undefined,
  };

  return (
    <li className={SB_ITEM_CLASS}>
      {item.href && !hasChildren && !item.disabled ? (
        <a href={item.href} onClick={handleClick} {...commonProps}>
          {renderInner()}
        </a>
      ) : (
        <button type="button" onClick={handleClick} disabled={item.disabled} {...commonProps}>
          {renderInner()}
        </button>
      )}
      {hasChildren && expanded && (
        <ul className={SB_CHILDREN_CLASS}>
          {item.children!.map((child) => (
            <ItemRowController
              key={child.key}
              item={child}
              activeKey={activeKey}
              onItemClick={onItemClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/** Wraps ItemRow to manage its own expand state when used as a child entry. */
const ItemRowController: React.FC<{
  item: SidebarItem;
  activeKey?: string;
  onItemClick?: (item: SidebarItem) => void;
  depth?: number;
}> = ({ item, activeKey, onItemClick, depth = 0 }) => {
  const initiallyOpen = useMemo(
    () => containsKey(item.children, activeKey),
    [item.children, activeKey],
  );
  const [expanded, setExpanded] = useState(initiallyOpen);

  // Auto-open if `activeKey` lands inside this branch later.
  useEffect(() => {
    if (initiallyOpen) setExpanded(true);
  }, [initiallyOpen]);

  return (
    <ItemRow
      item={item}
      activeKey={activeKey}
      onItemClick={onItemClick}
      expanded={expanded}
      onToggleExpand={() => setExpanded((v) => !v)}
      depth={depth}
    />
  );
};

/* ─── Default toggle icon ─── */

const CollapseIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg
    viewBox="0 0 20 20"
    width="18"
    height="18"
    fill="none"
    aria-hidden="true"
    style={{ transform: collapsed ? "rotate(180deg)" : undefined, transition: "transform 0.18s" }}
  >
    <path
      d="M12 5l-5 5 5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M16 5v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── Component ─── */

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeKey,
  onItemClick,
  width,
  collapsedWidth,
  collapsed = false,
  onToggleCollapse,
  logo,
  title,
  subtitle,
  header,
  footer,
  user,
  fullHeight = true,
  as: Tag = "aside",
  className,
  style,
  children,
  ...rest
}) => {
  const sections = useMemo(() => normalizeSections(items), [items]);

  const handleItemClick = useCallback(
    (item: SidebarItem) => {
      onItemClick?.(item);
    },
    [onItemClick],
  );

  const rootStyle: React.CSSProperties = {
    ...(width !== undefined
      ? ({ "--nds-sidebar-width": `${width}px` } as React.CSSProperties)
      : {}),
    ...(collapsedWidth !== undefined
      ? ({ "--nds-sidebar-collapsed-width": `${collapsedWidth}px` } as React.CSSProperties)
      : {}),
    ...style,
  };

  const renderLogo = () => {
    if (!logo) return null;
    const inner = logo.element ?? (
      <img src={logo.src} alt={logo.alt ?? ""} width={logo.width} height={logo.height} />
    );
    if (logo.href) {
      return (
        <a href={logo.href} className={SB_LOGO_CLASS} aria-label={logo.alt}>
          {inner}
        </a>
      );
    }
    return <span className={SB_LOGO_CLASS}>{inner}</span>;
  };

  const renderUser = () => {
    if (!user) return null;
    const avatar = user.avatar ? (
      <img src={user.avatar} alt={user.avatarAlt ?? ""} />
    ) : (
      <>{typeof user.name === "string" ? user.name.slice(0, 1).toUpperCase() : null}</>
    );
    return (
      <div className={SB_USER_CLASS}>
        <span className={SB_USER_AVATAR_CLASS}>{avatar}</span>
        <div className={SB_USER_META_CLASS}>
          <p className={SB_USER_NAME_CLASS}>{user.name}</p>
          {user.role !== undefined && <p className={SB_USER_ROLE_CLASS}>{user.role}</p>}
        </div>
      </div>
    );
  };

  const hasHeader = header !== undefined || logo || title || subtitle || onToggleCollapse;
  const hasFooter = footer !== undefined || user;

  const Component = Tag as React.ElementType;

  return (
    <>
      <style>{sidebarStyles}</style>
      <style>{sidebarCashpobiTuning}</style>
      <Component
        data-slot="root"
        data-collapsed={collapsed ? "true" : "false"}
        data-full-height={fullHeight ? "true" : "false"}
        className={cx(SB_ROOT_CLASS, className)}
        style={rootStyle}
        {...rest}
      >
        {hasHeader && (
          <div data-slot="header" className={SB_HEADER_CLASS}>
            {header !== undefined ? (
              header
            ) : (
              <>
                {renderLogo()}
                {(title !== undefined || subtitle !== undefined) && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {title !== undefined && <p className={SB_TITLE_CLASS}>{title}</p>}
                    {subtitle !== undefined && <p className={SB_SUBTITLE_CLASS}>{subtitle}</p>}
                  </div>
                )}
                {onToggleCollapse && (
                  <button
                    type="button"
                    aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
                    className={SB_TOGGLE_CLASS}
                    onClick={onToggleCollapse}
                  >
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <nav data-slot="body" className={SB_BODY_CLASS} aria-label="사이드바 메뉴">
          {sections.map((section) => (
            <div key={section.key} className={SB_SECTION_CLASS}>
              {section.label !== undefined && (
                <p className={SB_SECTION_LABEL_CLASS}>{section.label}</p>
              )}
              <ul className={SB_ITEM_LIST_CLASS}>
                {section.items.map((item) => (
                  <ItemRowController
                    key={item.key}
                    item={item}
                    activeKey={activeKey}
                    onItemClick={handleItemClick}
                  />
                ))}
              </ul>
            </div>
          ))}
          {children}
        </nav>

        {hasFooter && (
          <div data-slot="footer" className={SB_FOOTER_CLASS}>
            {footer !== undefined ? footer : renderUser()}
          </div>
        )}
      </Component>
    </>
  );
};

Sidebar.displayName = "Sidebar";
