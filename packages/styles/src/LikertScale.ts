/* Auto-generated from packages/react/src/LikertScale.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const LK_CLASS = "nds-likert";
const LK_ROOT_CLASS = `${LK_CLASS}__root`;
const LK_TRACK_CLASS = `${LK_CLASS}__track`;
const LK_LINE_CLASS = `${LK_CLASS}__line`;
const LK_ITEM_CLASS = `${LK_CLASS}__item`;
const LK_INPUT_CLASS = `${LK_CLASS}__input`;
const LK_DOT_CLASS = `${LK_CLASS}__dot`;
const LK_DOT_INNER_CLASS = `${LK_CLASS}__dot-inner`;
const LK_ITEM_LABEL_CLASS = `${LK_CLASS}__item-label`;
const LK_ANCHORS_CLASS = `${LK_CLASS}__anchors`;
const LK_ANCHOR_CLASS = `${LK_CLASS}__anchor`;

export const likertStyles = `
  :where(.${LK_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${LK_TRACK_CLASS}) {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${spacing[10]}px 0 ${spacing[4]}px;
  }

  :where(.${LK_LINE_CLASS}) {
    position: absolute;
    top: ${spacing[20]}px;
    left: 12px;
    right: 12px;
    height: 2px;
    background: ${cv.borderRole.subtle};
    border-radius: ${radius.pill}px;
    pointer-events: none;
  }

  :where(.${LK_ITEM_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    cursor: pointer;
    flex: 1 1 0;
    min-width: 0;
  }

  :where(.${LK_ITEM_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${LK_INPUT_CLASS}) {
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

  :where(.${LK_DOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, background-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${LK_ITEM_CLASS}:hover .${LK_DOT_CLASS}) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${LK_DOT_CLASS}[data-checked="true"]) {
    border-color: ${cv.borderRole.brand};
    background: ${cv.surface.brand};
  }

  :where(.${LK_DOT_INNER_CLASS}) {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    opacity: 0;
    transform: scale(0.5);
    transition: opacity ${transition.default}, transform ${transition.default};
  }

  :where(.${LK_DOT_CLASS}[data-checked="true"] .${LK_DOT_INNER_CLASS}) {
    opacity: 1;
    transform: scale(1);
  }

  :where(.${LK_INPUT_CLASS}:focus-visible + .${LK_DOT_CLASS}) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${LK_ITEM_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${LK_ITEM_CLASS}[data-checked="true"] .${LK_ITEM_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${LK_ANCHORS_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${spacing[2]}px;
  }

  :where(.${LK_ANCHOR_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    user-select: none;
  }
`;
