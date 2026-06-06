/* Auto-generated companion for packages/react/src/CheckboxTree.tsx.
 * 검색 + 전체선택 + 계층 체크박스 트리. 색/radius 는 semantic 토큰으로 브랜드 cascade
 * (캐포비 = fill.brand 옐로우). 들여쓰기는 --nds-checkbox-tree-indent * depth 로 계산. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CT_CLASS = "nds-checkbox-tree";
const CT_SEARCH_CLASS = `${CT_CLASS}__search`;
const CT_LIST_CLASS = `${CT_CLASS}__list`;
const CT_GROUP_CLASS = `${CT_CLASS}__group`;
const CT_ROW_CLASS = `${CT_CLASS}__row`;
const CT_OPTION_CLASS = `${CT_CLASS}__option`;
const CT_INPUT_CLASS = `${CT_CLASS}__input`;
const CT_CHECK_CLASS = `${CT_CLASS}__check`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;
const CT_CHEVRON_CLASS = `${CT_CLASS}__chevron`;
const CT_EMPTY_CLASS = `${CT_CLASS}__empty`;

export const checkboxTreeStyles = `
  :where(.${CT_CLASS}) {
    --nds-checkbox-tree-indent: 32px;
    display: flex;
    flex-direction: column;
    gap: ${spacing[24]}px;
    width: 100%;
    box-sizing: border-box;
    font-family: ${fontFamily.web};
  }

  /* ── Search ── */
  :where(.${CT_SEARCH_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    min-height: ${sizing.input.default}px;
    padding: 0 var(--semantic-inset-input);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.lg}px;
    background: ${cv.surface.default};
    box-sizing: border-box;
  }
  :where(.${CT_SEARCH_CLASS}:focus-within) { border-color: ${cv.input.borderFocus}; }
  :where(.${CT_SEARCH_CLASS}) input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }
  :where(.${CT_SEARCH_CLASS}) input::placeholder { color: ${cv.textRole.muted}; }
  :where(.${CT_SEARCH_CLASS}-icon) {
    display: inline-flex;
    flex-shrink: 0;
    color: ${cv.iconRole.normal};
  }
  :where(.${CT_SEARCH_CLASS}-icon) svg { width: 24px; height: 24px; }

  /* ── Tree list ── */
  :where(.${CT_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    max-height: var(--nds-checkbox-tree-max-height, none);
    overflow-y: auto;
  }
  :where(.${CT_GROUP_CLASS}) { display: flex; flex-direction: column; }

  /* ── Row ── */
  :where(.${CT_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    min-height: ${sizing.input.default}px;
    padding-inline-start: calc(
      var(--nds-checkbox-tree-indent, 32px) * var(--nds-checkbox-tree-depth, 0)
    );
    padding-inline-end: ${spacing[8]}px;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }
  :where(.${CT_ROW_CLASS}:hover) { background: ${cv.surface.section}; }
  :where(.${CT_ROW_CLASS}[data-disabled="true"]:hover) { background: transparent; }

  /* ── Option (label: hidden input + check + text) ── */
  :where(.${CT_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    flex: 1 1 auto;
    min-width: 0;
    cursor: pointer;
  }
  :where(.${CT_ROW_CLASS}[data-disabled="true"] .${CT_OPTION_CLASS}) { cursor: not-allowed; }

  :where(.${CT_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Check indicator (Checkbox 와 동일 토큰) ── */
  :where(.${CT_CHECK_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-checkbox-size, 18px);
    height: var(--nds-checkbox-size, 18px);
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
    color: ${cv.surface.default};
    transition: background-color ${transition.default}, border-color ${transition.default};
  }
  :where(.${CT_CHECK_CLASS}[data-state="checked"]),
  :where(.${CT_CHECK_CLASS}[data-state="indeterminate"]) {
    border-color: ${cv.fill.brand};
    background: ${cv.fill.brand};
  }
  :where(.${CT_CHECK_CLASS} svg) {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity ${transition.default};
  }
  :where(.${CT_CHECK_CLASS}[data-state="checked"] .${CT_CHECK_CLASS}-icon) { opacity: 1; }
  :where(.${CT_CHECK_CLASS}[data-state="indeterminate"] .${CT_CHECK_CLASS}-minus) { opacity: 1; }

  :where(.${CT_INPUT_CLASS}:focus-visible + .${CT_CHECK_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }
  :where(.${CT_ROW_CLASS}[data-disabled="true"] .${CT_CHECK_CLASS}) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
  }

  /* ── Label ── */
  :where(.${CT_LABEL_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :where(.${CT_ROW_CLASS}[data-disabled="true"] .${CT_LABEL_CLASS}) { color: ${cv.textRole.disabled}; }

  /* ── Chevron (부모 노드 펼침/접힘) ── */
  :where(.${CT_CHEVRON_CLASS}) {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    transition: transform ${transition.default};
  }
  :where(.${CT_CHEVRON_CLASS}[data-expanded="true"]) { transform: rotate(180deg); }
  :where(.${CT_CHEVRON_CLASS}) svg { width: 24px; height: 24px; }

  /* ── Empty ── */
  :where(.${CT_EMPTY_CLASS}) {
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
`;
