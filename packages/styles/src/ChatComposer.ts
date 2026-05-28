/* Auto-generated from packages/react/src/ChatComposer.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CC_CLASS = "nds-chat-composer";
const CC_QUICK_CLASS = `${CC_CLASS}__quick`;
const CC_QUICK_ITEM_CLASS = `${CC_CLASS}__quick-item`;
const CC_INPUT_AREA_CLASS = `${CC_CLASS}__input-area`;
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_TEXTAREA_CLASS = `${CC_CLASS}__textarea`;
const CC_BTN_CLASS = `${CC_CLASS}__btn`;
const CC_SEND_CLASS = `${CC_CLASS}__send`;
const CC_COUNT_CLASS = `${CC_CLASS}__count`;

export const composerStyles = `
  :where(.${CC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    padding: var(--inset-input);
    background: ${cv.surface.default};
    border-top: 1px solid ${cv.borderRole.subtle};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CC_QUICK_CLASS}) {
    display: flex;
    gap: var(--gap-default);
    overflow-x: auto;
    padding-bottom: ${spacing[4]}px;
    scrollbar-width: none;
  }
  :where(.${CC_QUICK_CLASS})::-webkit-scrollbar { display: none; }

  :where(.${CC_QUICK_ITEM_CLASS}) {
    flex-shrink: 0;
    height: 32px;
    padding: 0 var(--inset-input);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    transition: background-color ${transition.default};
  }

  :where(.${CC_QUICK_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${CC_INPUT_AREA_CLASS}) {
    display: flex;
    align-items: flex-end;
    gap: var(--gap-default);
    background: ${cv.surface.section};
    border-radius: ${radius.lg}px;
    padding: var(--inset-chip);
  }

  :where(.${CC_LEFT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${CC_BTN_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color ${transition.default};
  }

  :where(.${CC_BTN_CLASS}:hover:not([disabled])) { background: ${cv.surface.default}; }

  :where(.${CC_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${CC_TEXTAREA_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    resize: none;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    padding: var(--inset-chip) 4px;
    max-height: var(--nds-chat-composer-max, 120px);
    overflow-y: auto;
    box-sizing: border-box;
  }

  :where(.${CC_TEXTAREA_CLASS}::placeholder) { color: ${cv.textRole.muted}; }

  :where(.${CC_SEND_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: ${cv.surface.brand};
    color: #fff;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity ${transition.default};
  }

  :where(.${CC_SEND_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${CC_COUNT_CLASS}) {
    text-align: right;
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }
`;
