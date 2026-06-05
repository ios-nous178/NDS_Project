/* Auto-generated from packages/react/src/CounselorCard.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CN_CLASS = "nds-counselor-card";
const CN_AVATAR_CLASS = `${CN_CLASS}__avatar`;
const CN_BODY_CLASS = `${CN_CLASS}__body`;
const CN_HEADER_CLASS = `${CN_CLASS}__header`;
const CN_NAME_CLASS = `${CN_CLASS}__name`;
const CN_TITLE_CLASS = `${CN_CLASS}__title`;
const CN_RATING_CLASS = `${CN_CLASS}__rating`;
const CN_RATING_VALUE_CLASS = `${CN_CLASS}__rating-value`;
const CN_RATING_COUNT_CLASS = `${CN_CLASS}__rating-count`;
const CN_TAGS_CLASS = `${CN_CLASS}__tags`;
const CN_TAG_CLASS = `${CN_CLASS}__tag`;
const CN_BIO_CLASS = `${CN_CLASS}__bio`;
const CN_FOOTER_CLASS = `${CN_CLASS}__footer`;
const CN_CTA_CLASS = `${CN_CLASS}__cta`;

export const counselorCardStyles = `
  :where(.${CN_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-loose);
    padding: var(--semantic-inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${CN_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${CN_CLASS}[data-clickable="true"]:hover) {
    border-color: ${cv.borderRole.focus};
    box-shadow: ${shadow["1"]};
  }

  :where(.${CN_AVATAR_CLASS}) {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    object-fit: cover;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.headline4.fontSize}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CN_AVATAR_CLASS}) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${CN_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }

  :where(.${CN_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${CN_NAME_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${CN_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CN_RATING_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }

  :where(.${CN_RATING_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${CN_RATING_COUNT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CN_TAGS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[6]}px;
  }

  :where(.${CN_TAG_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px var(--semantic-inset-chip);
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${CN_BIO_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :where(.${CN_FOOTER_CLASS}) {
    margin-top: ${spacing[4]}px;
    display: flex;
    justify-content: flex-end;
  }

  :where(.${CN_CTA_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: var(--semantic-inset-chip) var(--semantic-inset-card);
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    border-radius: ${radius.pill}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${CN_CTA_CLASS}:hover) {
    background: ${cv.fill.brandHover};
  }
`;
