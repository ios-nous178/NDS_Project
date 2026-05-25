/* Mirror of packages/react/src/Sidebar.tsx — keep in sync. */
/* The .tsx still self-injects this literal at runtime; this copy feeds the bundled styles.css. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

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

export const sidebarStyles = `
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
