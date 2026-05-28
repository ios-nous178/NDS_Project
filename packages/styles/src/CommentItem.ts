/* Auto-generated from packages/react/src/CommentItem.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-design/tokens";

const CI_CLASS = "nds-comment-item";
const CI_AVATAR_CLASS = `${CI_CLASS}__avatar`;
const CI_BODY_CLASS = `${CI_CLASS}__body`;
const CI_HEAD_CLASS = `${CI_CLASS}__head`;
const CI_AUTHOR_CLASS = `${CI_CLASS}__author`;
const CI_TIME_CLASS = `${CI_CLASS}__time`;
const CI_TEXT_CLASS = `${CI_CLASS}__text`;
const CI_ACTIONS_CLASS = `${CI_CLASS}__actions`;
const CI_ACTION_CLASS = `${CI_CLASS}__action`;
const CI_REPLIES_CLASS = `${CI_CLASS}__replies`;

export const ciStyles = `
  :where(.${CI_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) 0;
    font-family: ${fontFamily.web};
  }

  :where(.${CI_CLASS}[data-reply="true"]) {
    padding-left: var(--semantic-inset-modal);
  }

  :where(.${CI_AVATAR_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${CI_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
  }

  :where(.${CI_HEAD_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex-wrap: wrap;
  }

  :where(.${CI_AUTHOR_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
  }

  :where(.${CI_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CI_TEXT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }

  :where(.${CI_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    margin-top: ${spacing[4]}px;
  }

  :where(.${CI_ACTION_CLASS}) {
    border: none;
    background: transparent;
    padding: 0;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    transition: color ${transition.default};
  }

  :where(.${CI_ACTION_CLASS}:hover) { color: ${cv.textRole.normal}; }

  :where(.${CI_REPLIES_CLASS}) {
    margin-top: ${spacing[8]}px;
    border-left: 2px solid ${cv.borderRole.subtle};
    padding-left: var(--semantic-inset-input);
  }
`;
