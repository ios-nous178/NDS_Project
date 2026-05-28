/* Auto-generated from packages/react/src/AddressSearch.tsx during the @nudge-design/styles split. */
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

const AS_CLASS = "nds-address-search";
const AS_LABEL_CLASS = `${AS_CLASS}__label`;
const AS_FIELD_ROW_CLASS = `${AS_CLASS}__field-row`;
const AS_INPUT_CLASS = `${AS_CLASS}__input`;
const AS_BTN_CLASS = `${AS_CLASS}__btn`;
const AS_RESULT_CLASS = `${AS_CLASS}__result`;
const AS_RESULT_LIST_CLASS = `${AS_CLASS}__result-list`;
const AS_RESULT_ITEM_CLASS = `${AS_CLASS}__result-item`;
const AS_DETAIL_CLASS = `${AS_CLASS}__detail`;
const AS_HELPER_CLASS = `${AS_CLASS}__helper`;

export const asStyles = `
  :where(.${AS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${AS_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${AS_FIELD_ROW_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
  }

  :where(.${AS_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    height: ${sizing.input.default}px;
    padding: 0 var(--semantic-inset-card);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    transition: border-color ${transition.default};
  }
  :where(.${AS_INPUT_CLASS}:focus) { outline: none; border-color: ${cv.borderRole.brand}; }
  :where(.${AS_INPUT_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }

  :where(.${AS_BTN_CLASS}) {
    height: ${sizing.input.default}px;
    padding: 0 var(--semantic-inset-card);
    border-radius: ${radius.md}px;
    border: none;
    background: ${cv.surface.inverse};
    color: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    flex-shrink: 0;
  }
  :where(.${AS_BTN_CLASS}:hover) { opacity: 0.85; }

  :where(.${AS_RESULT_LIST_CLASS}) {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
    max-height: 240px;
    overflow-y: auto;
  }

  :where(.${AS_RESULT_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    border-bottom: 1px solid ${cv.borderRole.subtle};
    cursor: pointer;
    transition: background-color ${transition.default};
  }
  :where(.${AS_RESULT_ITEM_CLASS}:last-child) { border-bottom: 0; }
  :where(.${AS_RESULT_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${AS_RESULT_ITEM_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
  }
  :where(.${AS_RESULT_ITEM_CLASS}) > span {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${AS_RESULT_CLASS}[data-empty="true"]) {
    padding: var(--semantic-inset-card);
    color: ${cv.textRole.subtle};
    text-align: center;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-size: ${typeScale.body3.fontSize}px;
  }

  :where(.${AS_DETAIL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    padding: var(--semantic-inset-input);
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
  }

  :where(.${AS_DETAIL_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AS_DETAIL_CLASS}) input {
    height: 40px;
    padding: 0 var(--semantic-inset-input);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    margin-top: ${spacing[4]}px;
  }

  :where(.${AS_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
  :where(.${AS_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
