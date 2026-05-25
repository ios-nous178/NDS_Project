/* Auto-generated from packages/react/src/TagInput.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;
const TI_HELPER_CLASS = `${TI_CLASS}__helper`;

export const tiStyles = `
  :where(.${TI_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TI_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${TI_FIELD_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[6]}px;
    min-height: 48px;
    padding: var(--inset-chip) var(--inset-input);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, box-shadow ${transition.default};
    cursor: text;
  }

  :where(.${TI_FIELD_CLASS}:focus-within) {
    border-color: ${cv.borderRole.brand};
    box-shadow: 0 0 0 3px ${cv.surface.brandSubtle};
  }
  :where(.${TI_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }
  :where(.${TI_FIELD_CLASS}[data-error="true"]:focus-within) {
    box-shadow: 0 0 0 3px var(--semantic-bg-status-error);
  }
  :where(.${TI_FIELD_CLASS}[data-disabled="true"]) {
    background: var(--semantic-input-bg-disabled);
    cursor: not-allowed;
  }

  :where(.${TI_TAG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    height: 26px;
    padding: 0 ${spacing[4]}px 0 ${spacing[10]}px;
    border-radius: 9999px;
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${TI_REMOVE_CLASS}) {
    width: 18px;
    height: 18px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    opacity: 0.7;
    transition: opacity ${transition.default}, background-color ${transition.default};
  }

  :where(.${TI_REMOVE_CLASS}:hover) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
  }

  :where(.${TI_INPUT_CLASS}) {
    flex: 1;
    min-width: 60px;
    height: 26px;
    border: none;
    background: transparent;
    outline: none;
    padding: 0 ${spacing[2]}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 26px;
    color: ${cv.textRole.normal};
  }

  :where(.${TI_INPUT_CLASS}::placeholder) { color: ${cv.textRole.muted}; }

  :where(.${TI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${TI_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
