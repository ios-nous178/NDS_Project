/* Auto-generated from packages/react/src/ReviewCard.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

const RC_CLASS = "nds-review-card";
const RC_HEADER_CLASS = `${RC_CLASS}__header`;
const RC_AUTHOR_AREA_CLASS = `${RC_CLASS}__author-area`;
const RC_AUTHOR_CLASS = `${RC_CLASS}__author`;
const RC_VERIFIED_CLASS = `${RC_CLASS}__verified`;
const RC_META_CLASS = `${RC_CLASS}__meta`;
const RC_RATING_CLASS = `${RC_CLASS}__rating`;
const RC_BODY_CLASS = `${RC_CLASS}__body`;
const RC_TAGS_CLASS = `${RC_CLASS}__tags`;
const RC_TAG_CLASS = `${RC_CLASS}__tag`;
const RC_FOOTER_CLASS = `${RC_CLASS}__footer`;

export const rcStyles = `
  :where(.${RC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
    padding: var(--inset-card) var(--inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${RC_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-comfortable);
    justify-content: space-between;
  }

  :where(.${RC_AUTHOR_AREA_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    min-width: 0;
  }

  :where(.${RC_AUTHOR_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  :where(.${RC_AUTHOR_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${RC_VERIFIED_CLASS}) {
    display: inline-flex;
    margin-left: ${spacing[4]}px;
    color: ${cv.textRole.statusSuccess};
    vertical-align: middle;
  }

  :where(.${RC_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${RC_RATING_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    flex-shrink: 0;
    color: #FFD54F;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${RC_RATING_CLASS}) .${RC_RATING_CLASS}__label {
    color: ${cv.textRole.normal};
  }

  :where(.${RC_BODY_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }

  :where(.${RC_BODY_CLASS}) > h4 {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0 0 ${spacing[4]}px 0;
  }

  :where(.${RC_TAGS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-tight);
  }

  :where(.${RC_TAG_CLASS}) {
    padding: 2px var(--inset-chip);
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${RC_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: ${spacing[4]}px;
  }
`;
