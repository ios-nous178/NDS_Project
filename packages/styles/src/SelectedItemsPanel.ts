/* SelectedItemsPanel + SelectedItemRow (legacy alias: RegionRow) — 다중 선택 결과 패널.
 * 헤더(타이틀 + 개수 + 추가/해제 액션) 고정, 본문은 children 슬롯(리스트/폼/테이블 swap).
 * 색·radius 는 semantic 토큰으로 브랜드 cascade. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SIP_CLASS = "nds-selected-items-panel";
const SIP_HEADER_CLASS = `${SIP_CLASS}__header`;
const SIP_TITLE_GROUP_CLASS = `${SIP_CLASS}__title-group`;
const SIP_TITLE_CLASS = `${SIP_CLASS}__title`;
const SIP_COUNT_CLASS = `${SIP_CLASS}__count`;
const SIP_ACTIONS_CLASS = `${SIP_CLASS}__actions`;
const SIP_ACTION_CLASS = `${SIP_CLASS}__action`;
const SIP_ACTION_ICON_CLASS = `${SIP_CLASS}__action-icon`;
const SIP_BODY_CLASS = `${SIP_CLASS}__body`;

const ROW_CLASS = "nds-selected-item-row";
const LEGACY_ROW_CLASS = "nds-region-row";
const ROW_LABEL_CLASS = `${ROW_CLASS}__label`;
const LEGACY_ROW_LABEL_CLASS = `${LEGACY_ROW_CLASS}__label`;
const ROW_REMOVE_CLASS = `${ROW_CLASS}__remove`;
const LEGACY_ROW_REMOVE_CLASS = `${LEGACY_ROW_CLASS}__remove`;

export const selectedItemsPanelStyles = `
  :where(.${SIP_CLASS}) {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding: var(--semantic-inset-modal);
    background: ${cv.surface.subtle};
    border: 1px solid ${cv.borderRole.normal};
    border-radius: var(--nds-selected-items-panel-radius, 16px);
    font-family: ${fontFamily.web};
  }

  :where(.${SIP_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]}px;
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${SIP_TITLE_GROUP_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    min-width: 0;
  }

  :where(.${SIP_TITLE_CLASS}) {
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${SIP_COUNT_CLASS}) {
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
    flex-shrink: 0;
  }

  :where(.${SIP_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    flex-shrink: 0;
  }

  :where(.${SIP_ACTION_CLASS}) {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[4]}px;
    padding: 7px ${spacing[16]}px 7px ${spacing[10]}px;
    border: 0;
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    white-space: nowrap;
    transition: background ${transition.default}, border-color ${transition.default};
  }

  :where(.${SIP_ACTION_CLASS}[data-variant="primary"]) {
    background: ${cv.fill.neutral};
    color: ${cv.textRole.inverse};
  }

  :where(.${SIP_ACTION_CLASS}[data-variant="ghost"]) {
    background: transparent;
    border: 1px solid ${cv.borderRole.strong};
    color: ${cv.textRole.subtle};
  }

  :where(.${SIP_ACTION_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${SIP_ACTION_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: currentColor;
  }

  :where(.${SIP_ACTION_ICON_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${SIP_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    flex: 1 1 auto;
    min-height: 0;
    max-height: var(--nds-selected-items-panel-body-max-height, none);
    overflow-y: auto;
  }

  /* ── SelectedItemRow — 패널 본문에 쌓이는 단일 선택 항목 행 ── */
  :where(.${ROW_CLASS}), :where(.${LEGACY_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    width: 100%;
    box-sizing: border-box;
    padding: ${spacing[8]}px ${spacing[12]}px ${spacing[8]}px ${spacing[16]}px;
    background: var(--nds-selected-item-row-bg, ${cv.surface.section});
    border-radius: var(--nds-selected-item-row-radius, ${radius.lg}px);
    font-family: ${fontFamily.web};
  }

  :where(.${ROW_LABEL_CLASS}), :where(.${LEGACY_ROW_LABEL_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.normal};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${ROW_REMOVE_CLASS}), :where(.${LEGACY_ROW_REMOVE_CLASS}) {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    transition: color ${transition.default};
  }

  :where(.${ROW_REMOVE_CLASS}:hover), :where(.${LEGACY_ROW_REMOVE_CLASS}:hover) {
    color: ${cv.textRole.statusError};
  }

  :where(.${ROW_REMOVE_CLASS} svg), :where(.${LEGACY_ROW_REMOVE_CLASS} svg) {
    width: 20px;
    height: 20px;
  }

  /* ─── 캐포비(cashwalk-biz) SelectedItemRow 삭제 글리프 — Figma 3001:18463 ───
     민자 X(svg) 숨기고 ::before 에 원형 serchdelete 아이콘을 mask 로 swap (요소 교체=구조적 → [data-brand] 유지).
     gray/200 fill·radius 10 은 브랜드 슬롯(components.selected-item-row)으로 이전. 색(currentColor→hover statusError)은 base 상속. */
  :where([data-brand="cashwalk-biz"] .${ROW_REMOVE_CLASS}) svg,
  :where([data-brand="cashwalk-biz"] .${LEGACY_ROW_REMOVE_CLASS}) svg {
    display: none;
  }
  :where([data-brand="cashwalk-biz"] .${ROW_REMOVE_CLASS})::before,
  :where([data-brand="cashwalk-biz"] .${LEGACY_ROW_REMOVE_CLASS})::before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='10' fill='black' fill-opacity='0.4'/><path d='M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z' fill='black'/><path d='M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z' fill='black'/></svg>") center / contain no-repeat;
    mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='10' fill='black' fill-opacity='0.4'/><path d='M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z' fill='black'/><path d='M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z' fill='black'/></svg>") center / contain no-repeat;
  }
`;
