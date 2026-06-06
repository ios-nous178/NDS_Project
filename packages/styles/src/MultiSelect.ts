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
const MS_OPTION_CHECK_CLASS = `${MS_CLASS}__option-check`;
const MS_OPTION_LABEL_CLASS = `${MS_CLASS}__option-label`;
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_FOOTER_BTN_CLASS = `${MS_CLASS}__footer-button`;

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
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
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
  :where(.${MS_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) { color: ${cv.textRole.muted}; }

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

  /* ── Search ── */
  :where(.${MS_SEARCH_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    margin: ${spacing[8]}px;
    padding: 0 var(--semantic-inset-input);
    min-height: 40px;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
  }
  :where(.${MS_SEARCH_CLASS}) svg { width: 16px; height: 16px; flex-shrink: 0; color: ${cv.iconRole.normal}; }
  :where(.${MS_SEARCH_CLASS}) input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }
  :where(.${MS_SEARCH_CLASS}) input::placeholder { color: ${cv.textRole.muted}; }

  /* ── Select-all row ── */
  :where(.${MS_SELECT_ALL_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    width: 100%;
    padding: ${spacing[8]}px var(--semantic-inset-input);
    border: none;
    border-bottom: 1px solid ${cv.borderRole.subtle};
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    text-align: left;
  }
  :where(.${MS_SELECT_ALL_CLASS}:disabled) { cursor: not-allowed; opacity: 0.5; }
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
  :where(.${MS_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: ${spacing[8]}px var(--semantic-inset-input);
    cursor: pointer;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default};
  }
  :where(.${MS_OPTION_CLASS}:hover) { background: ${cv.surface.section}; }
  :where(.${MS_OPTION_CLASS}[data-disabled="true"]) { color: ${cv.textRole.muted}; cursor: not-allowed; }
  :where(.${MS_OPTION_CLASS}) input {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }
  :where(.${MS_OPTION_LABEL_CLASS}) {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Checkbox indicator (select-all + option 공용) ── */
  :where(.${MS_OPTION_CHECK_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border: 1.5px solid ${cv.borderRole.strong};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
    color: ${cv.button.textDefault};
    transition: background-color ${transition.default}, border-color ${transition.default};
  }
  :where(.${MS_OPTION_CHECK_CLASS}) svg { opacity: 0; }
  :where(.${MS_OPTION_CHECK_CLASS}[data-checked="true"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
  }
  :where(.${MS_OPTION_CHECK_CLASS}[data-checked="true"]) svg { opacity: 1; }

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

  /* ── Footer (취소 / 적용) ── */
  :where(.${MS_FOOTER_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-tight);
    padding: ${spacing[8]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
  :where(.${MS_FOOTER_BTN_CLASS}) {
    flex: 1;
    min-height: 36px;
    padding: 0 var(--semantic-inset-input);
    border-radius: ${radius.sm}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default}, border-color ${transition.default};
  }
  :where(.${MS_FOOTER_BTN_CLASS}[data-variant="apply"]) {
    border-color: ${cv.surface.inverse};
    background: ${cv.surface.inverse};
    color: ${cv.textRole.inverse};
  }
`;
