/* Auto-generated from packages/react/src/JournalEntry.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const JE_CLASS = "nds-journal-entry";
const JE_HEADER_CLASS = `${JE_CLASS}__header`;
const JE_DATE_CLASS = `${JE_CLASS}__date`;
const JE_MOOD_CLASS = `${JE_CLASS}__mood`;
const JE_TITLE_CLASS = `${JE_CLASS}__title`;
const JE_BODY_CLASS = `${JE_CLASS}__body`;
const JE_TAGS_CLASS = `${JE_CLASS}__tags`;
const JE_TAG_CLASS = `${JE_CLASS}__tag`;
const JE_FOOTER_CLASS = `${JE_CLASS}__footer`;
const JE_THUMB_CLASS = `${JE_CLASS}__thumb`;

export const journalStyles = `
  :where(.${JE_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${JE_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${JE_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.borderRole.brand}; }

  :where(.${JE_CLASS}__main) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }

  :where(.${JE_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
  }

  :where(.${JE_MOOD_CLASS}) {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    background: ${cv.surface.section};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${JE_DATE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${JE_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${JE_BODY_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: var(--nds-journal-lines, 3);
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  :where(.${JE_TAGS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--semantic-gap-tight);
  }

  :where(.${JE_TAG_CLASS}) {
    padding: 2px var(--semantic-inset-chip);
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${JE_FOOTER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${JE_THUMB_CLASS}) {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: ${radius.md}px;
    object-fit: cover;
    background: ${cv.surface.section};
  }
`;
