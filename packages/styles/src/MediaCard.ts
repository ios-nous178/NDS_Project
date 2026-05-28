/* Auto-generated from packages/react/src/MediaCard.tsx during the @nudge-design/styles split. */
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

const MC_CLASS = "nds-media-card";
const MC_MEDIA_CLASS = `${MC_CLASS}__media`;
const MC_MEDIA_INNER_CLASS = `${MC_CLASS}__media-inner`;
const MC_OVERLAY_CLASS = `${MC_CLASS}__overlay`;
const MC_BODY_CLASS = `${MC_CLASS}__body`;
const MC_EYEBROW_CLASS = `${MC_CLASS}__eyebrow`;
const MC_TITLE_CLASS = `${MC_CLASS}__title`;
const MC_BODY_TEXT_CLASS = `${MC_CLASS}__body-text`;
const MC_RATING_CLASS = `${MC_CLASS}__rating`;
const MC_FOOTER_CLASS = `${MC_CLASS}__footer`;

export const mediaCardStyles = `
  :where(.${MC_CLASS}) {
    display: flex;
    flex-direction: column;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    overflow: hidden;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${MC_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${MC_CLASS}[data-clickable="true"]:hover) {
    box-shadow: ${shadow["1"]};
  }

  :where(.${MC_MEDIA_CLASS}) {
    position: relative;
    width: 100%;
    background: ${cv.surface.section};
    overflow: hidden;
  }

  :where(.${MC_MEDIA_INNER_CLASS}) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  :where(.${MC_MEDIA_INNER_CLASS}) img,
  :where(.${MC_MEDIA_INNER_CLASS}) video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  :where(.${MC_OVERLAY_CLASS}) {
    position: absolute;
    right: ${spacing[8]}px;
    bottom: ${spacing[8]}px;
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px ${spacing[6]}px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    pointer-events: none;
  }

  :where(.${MC_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    padding: var(--semantic-inset-card);
  }

  :where(.${MC_EYEBROW_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${MC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  :where(.${MC_BODY_TEXT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  :where(.${MC_RATING_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  :where(.${MC_FOOTER_CLASS}) {
    margin-top: ${spacing[2]}px;
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
  }
`;
