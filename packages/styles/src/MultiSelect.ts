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
    border-radius: var(--nds-select-radius, ${radius.md}px);
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }
  :where(.${MS_TRIGGER_CLASS}[data-open="true"]) { border-color: ${cv.input.borderFocus}; }
  :where(.${MS_TRIGGER_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }
  :where(.${MS_TRIGGER_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${MS_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
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
    max-width: 360px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    box-sizing: border-box;
    overflow: hidden;
    animation: nds-select-fade-in ${transition.default};
  }

  /* ── Search (SearchInput 조합) — 패널 상단 flush. SearchInput 자체 보더 박스를 끄고
     하단 구분선만 남겨 박스-in-박스 방지. 끄는 방법은 :where 오버라이드(소스순서에 짐)가
     아니라 SearchInput 이 노출한 슬롯(--nds-search-input-*)으로 — cascade 라 순서 무관. ── */
  :where(.${MS_SEARCH_CLASS}) {
    --nds-search-input-border-color: transparent;
    --nds-search-input-background: transparent;
    --nds-search-input-radius: 0;
    border-bottom: 1px solid ${cv.borderRole.subtle};
    transition: border-color ${transition.default};
  }
  :where(.${MS_SEARCH_CLASS}:focus-within) {
    border-bottom-color: ${cv.input.borderFocus};
  }
  :where(.${MS_SEARCH_CLASS} .nds-search-input__root) { width: 100%; }
  /* 포커스 시 wrapper 의 하드코딩 border-color(borderFocus)가 박스 보더를 다시 그리지 않게
     — 슬롯이 못 덮는 focus 상태라 specificity 확보용으로 :where 미사용(의도적). */
  .${MS_SEARCH_CLASS} .nds-search-input__wrapper[data-focused="true"] {
    border-color: transparent;
  }

  /* ── Select-all row (Checkbox indeterminate 조합) ── */
  :where(.${MS_SELECT_ALL_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    width: 100%;
    padding: ${spacing[8]}px var(--semantic-inset-input);
    border-bottom: 1px solid ${cv.borderRole.subtle};
    box-sizing: border-box;
  }
  :where(.${MS_SELECT_ALL_CLASS} .nds-checkbox__root) { flex: 1; align-items: center; }
  :where(.${MS_COUNT_CLASS}) {
    margin-left: auto;
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
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
    padding: ${spacing[8]}px var(--semantic-inset-input);
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
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  /* ── Empty state ── */
  :where(.${MS_EMPTY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    padding: ${spacing[16]}px;
    text-align: center;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  /* ── Footer (Button 컴포넌트 조합 — 취소 outlined / 적용 secondary solid) ── */
  :where(.${MS_FOOTER_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-tight);
    padding: ${spacing[8]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
  :where(.${MS_FOOTER_CLASS} .nds-button) { flex: 1; }
`;
