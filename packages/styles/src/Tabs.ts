/* Auto-generated from packages/react/src/Tabs.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const TABS_CLASS = "nds-tabs";
const TABS_ROOT_CLASS = `${TABS_CLASS}__root`;
const TABS_LIST_CLASS = `${TABS_CLASS}__list`;
const TABS_TRIGGER_CLASS = `${TABS_CLASS}__trigger`;
const TABS_TRIGGER_INNER_CLASS = `${TABS_CLASS}__trigger-inner`;
const TABS_TRIGGER_ICON_CLASS = `${TABS_CLASS}__trigger-icon`;
const TABS_INDICATOR_CLASS = `${TABS_CLASS}__indicator`;
const TABS_PANEL_CLASS = `${TABS_CLASS}__panel`;

export const tabsStyles = `
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
