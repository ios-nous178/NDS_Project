/* Auto-generated from packages/react/src/ChatBubble.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

const CB_CLASS = "nds-chat-bubble";
const CB_ROW_CLASS = `${CB_CLASS}__row`;
const CB_AVATAR_CLASS = `${CB_CLASS}__avatar`;
const CB_BODY_CLASS = `${CB_CLASS}__body`;
const CB_NAME_CLASS = `${CB_CLASS}__name`;
const CB_BUBBLE_CLASS = `${CB_CLASS}__bubble`;
const CB_META_CLASS = `${CB_CLASS}__meta`;
const CB_TIME_CLASS = `${CB_CLASS}__time`;
const CB_READ_CLASS = `${CB_CLASS}__read`;

export const chatBubbleStyles = `
  :where(.${CB_ROW_CLASS}) {
    display: flex;
    align-items: flex-end;
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) {
    flex-direction: row-reverse;
  }

  :where(.${CB_AVATAR_CLASS}) {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CB_AVATAR_CLASS}) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${CB_AVATAR_CLASS}[data-hidden="true"]) {
    visibility: hidden;
  }

  :where(.${CB_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
    max-width: 70%;
    min-width: 0;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) .${CB_BODY_CLASS} {
    align-items: flex-end;
  }

  :where(.${CB_NAME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    padding: 0 ${spacing[4]}px;
  }

  :where(.${CB_BUBBLE_CLASS}) {
    padding: ${spacing[10]}px var(--inset-input);
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    word-break: break-word;
    white-space: pre-wrap;
    border-radius: ${radius.lg}px;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) .${CB_BUBBLE_CLASS} {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  /* group corners — them */
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="first"]) .${CB_BUBBLE_CLASS} {
    border-bottom-left-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="middle"]) .${CB_BUBBLE_CLASS} {
    border-top-left-radius: ${radius.sm}px;
    border-bottom-left-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="last"]) .${CB_BUBBLE_CLASS} {
    border-top-left-radius: ${radius.sm}px;
  }

  /* group corners — me */
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="first"]) .${CB_BUBBLE_CLASS} {
    border-bottom-right-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="middle"]) .${CB_BUBBLE_CLASS} {
    border-top-right-radius: ${radius.sm}px;
    border-bottom-right-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="last"]) .${CB_BUBBLE_CLASS} {
    border-top-right-radius: ${radius.sm}px;
  }

  :where(.${CB_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    padding: 0 ${spacing[4]}px;
  }

  :where(.${CB_TIME_CLASS}) {
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CB_READ_CLASS}) {
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.medium};
  }
`;
