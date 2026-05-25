/* Auto-generated from packages/react/src/MoodSelector.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const MD_CLASS = "nds-mood";
const MD_ROOT_CLASS = `${MD_CLASS}__root`;
const MD_LIST_CLASS = `${MD_CLASS}__list`;
const MD_ITEM_CLASS = `${MD_CLASS}__item`;
const MD_INPUT_CLASS = `${MD_CLASS}__input`;
const MD_FACE_CLASS = `${MD_CLASS}__face`;
const MD_LABEL_CLASS = `${MD_CLASS}__label`;

export const moodStyles = `
  :where(.${MD_ROOT_CLASS}) {
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${MD_LIST_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: var(--gap-default);
    width: 100%;
  }

  :where(.${MD_ITEM_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${spacing[6]}px;
    flex: 1 1 0;
    min-width: 0;
    cursor: pointer;
    padding: var(--inset-chip) ${spacing[4]}px;
    border-radius: ${radius.lg}px;
    transition: background-color ${transition.default};
  }

  :where(.${MD_ITEM_CLASS}:hover) {
    background: ${cv.surface.page};
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"]) {
    background: ${cv.surface.brandSubtle};
  }

  :where(.${MD_ITEM_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${MD_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${MD_FACE_CLASS}) {
    font-size: 32px;
    line-height: 1;
    user-select: none;
    transition: transform ${transition.default};
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"] .${MD_FACE_CLASS}) {
    transform: scale(1.1);
  }

  :where(.${MD_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"] .${MD_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${MD_INPUT_CLASS}:focus-visible + .${MD_FACE_CLASS}) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 4px;
    border-radius: ${radius.pill}px;
  }
`;
