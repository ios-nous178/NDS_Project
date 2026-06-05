/* SelectedItemsPanel + RegionRow — 캐포비 InputGuide(3828:1577) 의 슬롯 패턴 패널.
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

const RR_CLASS = "nds-region-row";
const RR_LABEL_CLASS = `${RR_CLASS}__label`;
const RR_REMOVE_CLASS = `${RR_CLASS}__remove`;

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

  /* ── RegionRow — 패널 본문에 쌓이는 단일 선택 항목 행 ── */
  :where(.${RR_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    width: 100%;
    box-sizing: border-box;
    padding: ${spacing[8]}px ${spacing[12]}px ${spacing[8]}px ${spacing[16]}px;
    background: ${cv.surface.section};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
  }

  :where(.${RR_LABEL_CLASS}) {
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

  :where(.${RR_REMOVE_CLASS}) {
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

  :where(.${RR_REMOVE_CLASS}:hover) {
    color: ${cv.textRole.statusError};
  }

  :where(.${RR_REMOVE_CLASS} svg) {
    width: 20px;
    height: 20px;
  }
`;
