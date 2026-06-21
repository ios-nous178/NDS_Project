/* Auto-generated from packages/react/src/MultiSelect.tsx during the @nudge-design/styles split. */
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

const MS_CLASS = "nds-multi-select";
const MS_TRIGGER_CLASS = `${MS_CLASS}__trigger`;
const MS_TRIGGER_TEXT_CLASS = `${MS_CLASS}__trigger-text`;
const MS_CHEVRON_CLASS = `${MS_CLASS}__chevron`;
const MS_DROPDOWN_CLASS = `${MS_CLASS}__dropdown`;
const MS_SEARCH_CLASS = `${MS_CLASS}__search`;
const MS_SELECT_ALL_CLASS = `${MS_CLASS}__select-all`;
const MS_COUNT_CLASS = `${MS_CLASS}__count`;
const MS_LIST_CLASS = `${MS_CLASS}__list`;
const MS_OPTION_CLASS = `${MS_CLASS}__option`;
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;

export const multiSelectStyles = `
  :where(.${MS_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: auto;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }
  :where(.${MS_CLASS}[data-fullwidth="true"]) {
    display: flex;
    width: 100%;
  }

  /* ── Trigger (Select 트리거와 동일 톤) ── */
  :where(.${MS_TRIGGER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--nds-select-height, ${sizing.input.default}px);
    padding: 0 var(--semantic-inset-input);
    border: 1px solid ${cv.input.borderDefault};
    border-radius: var(--nds-select-radius, ${radius[8]}px);
    background: ${cv.input.bg};
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }
  :where(.${MS_TRIGGER_CLASS}[data-open="true"]) { border-color: ${cv.input.borderFocus}; }
  :where(.${MS_TRIGGER_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }
  :where(.${MS_TRIGGER_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${MS_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  :where(.${MS_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) { color: ${cv.input.placeholder}; }

  :where(.${MS_CHEVRON_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: ${spacing[4]}px;
    color: ${cv.iconRole.normal};
    transition: transform ${transition.default};
  }
  :where(.${MS_CHEVRON_CLASS}[data-open="true"]) { transform: rotate(180deg); }
  :where(.${MS_CHEVRON_CLASS} svg) { width: 16px; height: 16px; }

  /* ── Dropdown panel ── */
  :where(.${MS_DROPDOWN_CLASS}) {
    position: absolute;
    top: calc(100% + ${spacing[4]}px);
    left: 0;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    width: max-content;
    max-width: 392px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius[8]}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    box-sizing: border-box;
    overflow: hidden;
    animation: nds-select-fade-in ${transition.default};
  }

  /* ── Search (SearchInput 조합) — 패널 상단 패딩 박스 안의 **테두리 있는 인셋 TextInput**.
     하단 1px 구분선으로 select-all 과 분리. SearchInput 자체 보더/라운드(--nds-input-*)를 그대로 노출.
     Figma 4123-1406: 검색행 64h(py8 px16) + TextInput 48h radius. ── */
  :where(.${MS_SEARCH_CLASS}) {
    padding: ${spacing[8]}px ${spacing[16]}px;
    border-bottom: 1px solid ${cv.borderRole.subtle};
    box-sizing: border-box;
  }
  :where(.${MS_SEARCH_CLASS} .nds-search-input__root) { width: 100%; }

  /* ── Select-all row (Checkbox indeterminate 조합) ── */
  :where(.${MS_SELECT_ALL_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    width: 100%;
    padding: ${spacing[12]}px ${spacing[16]}px;
    background: ${cv.surface.subtle};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    box-sizing: border-box;
  }
  :where(.${MS_SELECT_ALL_CLASS} .nds-checkbox__root) { flex: 1; align-items: center; }
  /* 전체선택 라벨은 옵션(14)보다 한 단계 큰 16/medium (Figma subtitle1) */
  :where(.${MS_SELECT_ALL_CLASS} .nds-checkbox__label) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }
  :where(.${MS_COUNT_CLASS}) {
    margin-left: auto;
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  /* ── Option list ── */
  :where(.${MS_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    max-height: 220px;
    overflow-y: auto;
  }
  /* 옵션 행 = Checkbox 조합. 행 전체가 클릭되도록 checkbox root 를 width:100% 로 채운다. */
  :where(.${MS_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    padding: ${spacing[12]}px ${spacing[16]}px;
    transition: background-color ${transition.default};
  }
  :where(.${MS_OPTION_CLASS}:hover) { background: ${cv.surface.section}; }
  :where(.${MS_OPTION_CLASS}[data-checked="true"]) { background: ${cv.surface.subtle}; }
  :where(.${MS_OPTION_CLASS} .nds-checkbox__root) { width: 100%; align-items: center; }
  :where(.${MS_OPTION_CLASS} .nds-checkbox__label) {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  /* ── Empty state ── */
  :where(.${MS_EMPTY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    padding: ${spacing[16]}px;
    text-align: center;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  /* ── Footer (Button 컴포넌트 조합 — 취소 neutral outlined / 적용 neutral solid · 우측 hug) ── */
  :where(.${MS_FOOTER_CLASS}) {
    display: flex;
    justify-content: flex-end;
    gap: var(--semantic-gap-tight);
    padding: ${spacing[10]}px ${spacing[16]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
`;
