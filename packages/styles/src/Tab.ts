/* Auto-generated from packages/react/src/Tab.tsx during the @nudge-design/styles split. */
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
} from "@nudge-design/tokens";

const TAB_CLASS = "nds-tab";
const TAB_ROOT_CLASS = `${TAB_CLASS}__root`;
const TAB_LIST_CLASS = `${TAB_CLASS}__list`;
const TAB_TRIGGER_CLASS = `${TAB_CLASS}__trigger`;
const TAB_TRIGGER_INNER_CLASS = `${TAB_CLASS}__trigger-inner`;
const TAB_TRIGGER_ICON_CLASS = `${TAB_CLASS}__trigger-icon`;
const TAB_INDICATOR_CLASS = `${TAB_CLASS}__indicator`;
const TAB_PANEL_CLASS = `${TAB_CLASS}__panel`;

export const tabsStyles = `
  :where(.${TAB_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    width: var(--nds-tab-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* ─── List (shared) ─── */

  :where(.${TAB_LIST_CLASS}) {
    position: relative;
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :where(.${TAB_TRIGGER_CLASS}) {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: color ${transition.default}, background-color ${transition.default}, font-weight ${transition.default};
  }

  :where(.${TAB_TRIGGER_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    color: ${cv.textRole.muted};
    pointer-events: none;
  }

  :where(.${TAB_TRIGGER_INNER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-default);
  }

  :where(.${TAB_TRIGGER_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  /* ─── line variant ─── */

  :where(.${TAB_LIST_CLASS}[data-variant="line"]) {
    /* line variant 스트립은 투명 — 회색 페이지(예: 캐포비 admin #FAFAFA) 위에 떠 보이도록.
       흰 배경이 필요하면 부모(카드/섹션)가 칠한다. (구 기본값 cv.surface.default 흰색 → 투명) */
    background: transparent;
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"] .${TAB_TRIGGER_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: var(--nds-tab-line-font-size, ${typeScale.body3.fontSize}px);
    line-height: var(--nds-tab-line-line-height, ${typeScale.body3.lineHeight}px);
    font-weight: var(--nds-tab-line-default-weight, ${fontWeight.regular});
    padding: 0;
    position: relative;
    white-space: nowrap;
  }

  /* Mobile line tabs: 4글자 라벨이 ~360px 뷰포트에서 잘리지 않도록 좌우 padding
   * 을 inset-input(12) 으로 축소. 글자 수가 더 많으면 ellipsis 로 잘린다. */
  :where(.${TAB_LIST_CLASS}[data-variant="line"][data-size="mobile"] .${TAB_TRIGGER_CLASS}) {
    height: ${sizing.tabs.line.mobile}px;
    padding: 0 var(--semantic-inset-input);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"][data-size="pc"] .${TAB_TRIGGER_CLASS}) {
    height: var(--nds-tab-line-tab-height, ${sizing.tabs.line.pc}px);
    padding: 0 var(--nds-tab-line-padding-x, var(--semantic-inset-card-large));
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"][data-tone="color"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    color: ${cv.textRole.brand};
  }

  @media (hover: hover) {
    :where(.${TAB_LIST_CLASS}[data-variant="line"] .${TAB_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      color: ${cv.textRole.strong};
      background: ${cv.surface.subtle};
    }
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"] .${TAB_INDICATOR_CLASS}) {
    position: absolute;
    bottom: 0;
    left: 0;
    height: var(--nds-tab-line-indicator-height, 3px);
    background: ${cv.textRole.strong};
    transition: transform ${transition.slow}, width ${transition.slow}, background ${transition.default};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="line"][data-tone="color"] .${TAB_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
  }

  /* ─── chip variant ─── */

  :where(.${TAB_LIST_CLASS}[data-variant="chip"]) {
    /* 칩 스트립은 투명 — 각 칩이 자기 bg(subtle/brand/neutral)를 칠한다. 회색 페이지 위에
       흰 띠로 떠 보이지 않게. (line variant 와 동일 처리. 흰 배경이 필요하면 부모가 칠한다.) */
    background: transparent;
    gap: var(--semantic-gap-default);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"][data-size="mobile"]) {
    padding: 0 var(--semantic-inset-card);
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"]::-webkit-scrollbar) {
    display: none;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"] .${TAB_TRIGGER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--nds-tab-chip-radius, ${radius.pill}px);
    background: var(--nds-tab-chip-default-bg, ${cv.surface.subtle});
    color: var(--nds-tab-chip-default-color, ${cv.textRole.subtle});
    white-space: nowrap;
    font-weight: var(--nds-tab-chip-default-weight, ${fontWeight.regular});
    flex: 0 0 auto;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"][data-size="mobile"] .${TAB_TRIGGER_CLASS}) {
    height: ${sizing.tabs.chip.mobile}px;
    padding: 0 var(--semantic-inset-input);
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"][data-size="pc"] .${TAB_TRIGGER_CLASS}) {
    height: var(--nds-tab-chip-tab-height, ${sizing.tabs.chip.pc}px);
    padding: 0 var(--nds-tab-chip-padding-x, var(--semantic-inset-card));
    font-size: var(--nds-tab-chip-font-size, ${typeScale.body3.fontSize}px);
    line-height: var(--nds-tab-chip-line-height, ${typeScale.body3.lineHeight}px);
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"][data-tone="color"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
    font-weight: ${fontWeight.bold};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="chip"][data-tone="neutral"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    background: var(--nds-tab-chip-selected-bg, ${cv.fill.neutral});
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.bold};
  }

  @media (hover: hover) {
    :where(.${TAB_LIST_CLASS}[data-variant="chip"] .${TAB_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      background: ${cv.surface.section};
      color: ${cv.textRole.strong};
    }
  }

  /* ─── segment variant (구 SegmentedControl 흡수) ───
     연결된 회색 트랙(surface.subtle) 위 균등 분할. active = 흰색 떠오름(surface.default + shadow).
     mobile 36 / pc 40(아이콘 동반). tone="color" 면 active 가 브랜드 채움. */
  :where(.${TAB_LIST_CLASS}[data-variant="segment"]) {
    display: flex;
    align-items: stretch;
    width: 100%;
    background: ${cv.surface.subtle};
    border-radius: ${radius.md}px;
    padding: ${spacing[4]}px;
    gap: var(--semantic-gap-tight);
    box-sizing: border-box;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"] .${TAB_TRIGGER_CLASS}) {
    flex: 1 1 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    height: 36px;
    padding: 0 var(--semantic-inset-input);
    background: transparent;
    border-radius: ${radius.sm}px;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
    cursor: pointer;
    transition: background-color ${transition.default}, color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"][data-size="pc"] .${TAB_TRIGGER_CLASS}) {
    height: 40px;
    padding: 0 var(--semantic-inset-card);
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"] .${TAB_TRIGGER_ICON_CLASS} svg) {
    width: 18px;
    height: 18px;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
    box-shadow: ${shadow["1"]};
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"][data-tone="color"] .${TAB_TRIGGER_CLASS}[data-active="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
    box-shadow: none;
  }

  :where(.${TAB_LIST_CLASS}[data-variant="segment"] .${TAB_TRIGGER_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (hover: hover) {
    :where(.${TAB_LIST_CLASS}[data-variant="segment"] .${TAB_TRIGGER_CLASS}:not([data-active="true"]):not([data-disabled="true"]):hover) {
      color: ${cv.textRole.strong};
    }
  }

  /* ─── Panel ─── */

  :where(.${TAB_PANEL_CLASS}) {
    box-sizing: border-box;
  }

  :where(.${TAB_PANEL_CLASS}[data-hidden="true"]) {
    display: none;
  }
`;
