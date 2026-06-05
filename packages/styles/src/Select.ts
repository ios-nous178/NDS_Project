/* Auto-generated from packages/react/src/Select.tsx during the @nudge-design/styles split. */
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
  zIndex,
} from "@nudge-design/tokens";

const SELECT_CLASS = "nds-select";
const SELECT_ROOT_CLASS = `${SELECT_CLASS}__root`;
const SELECT_LABEL_CLASS = `${SELECT_CLASS}__label`;
const SELECT_TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const SELECT_TRIGGER_TEXT_CLASS = `${SELECT_CLASS}__trigger-text`;
const SELECT_CHEVRON_CLASS = `${SELECT_CLASS}__chevron`;
const SELECT_DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const SELECT_OPTION_CLASS = `${SELECT_CLASS}__option`;
const SELECT_OPTION_LABEL_CLASS = `${SELECT_CLASS}__option-label`;
const SELECT_OPTION_CHECK_CLASS = `${SELECT_CLASS}__option-check`;
const SELECT_HELPER_CLASS = `${SELECT_CLASS}__helper`;

export const selectStyles = `
  :where(.${SELECT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-select-label-gap, var(--semantic-gap-comfortable));
    width: var(--nds-select-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SELECT_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${SELECT_TRIGGER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--nds-select-height, ${sizing.input.default}px);
    padding: 0 var(--semantic-inset-input);
    border: 1px solid var(--nds-select-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-select-radius, ${radius.md}px);
    background: var(--nds-select-background, ${cv.surface.default});
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-open="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${SELECT_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: var(--nds-select-font-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.regular};
    line-height: var(--nds-select-line-height, ${typeScale.body3.lineHeight}px);
    color: ${cv.textRole.normal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  :where(.${SELECT_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${SELECT_CHEVRON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: ${spacing[4]}px;
    color: ${cv.iconRole.normal};
    transition: transform ${transition.default};
  }

  :where(.${SELECT_CHEVRON_CLASS}[data-open="true"]) {
    transform: rotate(180deg);
  }

  :where(.${SELECT_CHEVRON_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${SELECT_DROPDOWN_CLASS}) {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: var(--nds-select-dropdown-gap, 0);
    max-height: var(--nds-select-dropdown-max-height, 200px);
    overflow-y: auto;
    padding: var(--nds-select-dropdown-padding, 0);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    box-sizing: border-box;
    animation: nds-select-fade-in ${transition.default};
  }

  :where(.${SELECT_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: var(--nds-select-option-padding, var(--semantic-inset-input));
    border-radius: var(--nds-select-option-radius, 0);
    font-family: ${fontFamily.web};
    font-size: var(--nds-select-font-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.regular};
    line-height: var(--nds-select-line-height, ${typeScale.body3.lineHeight}px);
    color: ${cv.textRole.normal};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  /* 옵션 라벨 — 메뉴가 max-width(좁은 셀렉트) / 트리거폭(전체너비) 에 닿으면
     줄바꿈 대신 말줄임. 메뉴 폭 자체는 JS 가 mode 별로 설정(전체너비=트리거폭,
     auto=가장 넓은 아이템까지 grow, 캡 max-width). */
  :where(.${SELECT_OPTION_LABEL_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 선택 표시용 체크 — 평소엔 숨김, 선택된 옵션에서만 노출. trailing 정렬. */
  :where(.${SELECT_OPTION_CHECK_CLASS}) {
    display: none;
    flex-shrink: 0;
    margin-left: auto;
    padding-left: ${spacing[8]}px;
    color: inherit;
  }

  :where(.${SELECT_OPTION_CHECK_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  /* hover / 키보드 active — 비선택 행의 탐색 어포던스 */
  :where(.${SELECT_OPTION_CLASS}:hover),
  :where(.${SELECT_OPTION_CLASS}[data-active="true"]) {
    background: ${cv.surface.section};
    color: ${cv.textRole.strong};
    outline: none;
  }

  /* 선택 상태 — hover/active 규칙보다 뒤(= 동일 specificity면 우선)에 둬서
     선택+active 가 겹쳐도 항상 브랜드색이 보이도록 한다. */
  :where(.${SELECT_OPTION_CLASS}[data-selected="true"]) {
    color: var(--nds-select-option-selected-color, ${cv.textRole.brand});
    background: var(--nds-select-option-selected-bg, ${cv.surface.brandSubtle});
    font-weight: var(--nds-select-option-selected-weight, ${fontWeight.regular});
  }

  :where(.${SELECT_OPTION_CLASS}[data-selected="true"] .${SELECT_OPTION_CHECK_CLASS}) {
    display: flex;
  }

  :where(.${SELECT_OPTION_CLASS}[data-disabled="true"]) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${SELECT_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  :where(.${SELECT_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  /* 캐포비(cashwalk-biz) admin 전용 — 에러 헬퍼 앞 빨간 경고 아이콘(Figma 04ic/report/red). 다른 브랜드 미노출. */
  [data-brand="cashwalk-biz"] :where(.${SELECT_HELPER_CLASS}[data-error="true"]) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }
  [data-brand="cashwalk-biz"] :where(.${SELECT_HELPER_CLASS}[data-error="true"])::before {
    content: "";
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
  }

  @keyframes nds-select-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
