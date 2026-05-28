/* Auto-generated from packages/react/src/Card.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CARD_CLASS = "nds-card";
const CARD_ROOT_CLASS = `${CARD_CLASS}__root`;
const CARD_THUMBNAIL_CLASS = `${CARD_CLASS}__thumbnail`;
const CARD_AVATAR_CLASS = `${CARD_CLASS}__avatar`;
const CARD_CHIPS_CLASS = `${CARD_CLASS}__chips`;
const CARD_HEADER_CLASS = `${CARD_CLASS}__header`;
const CARD_TEXT_CONTENT_CLASS = `${CARD_CLASS}__text-content`;
const CARD_TITLE_DESC_CLASS = `${CARD_CLASS}__title-desc`;
const CARD_BODY_CLASS = `${CARD_CLASS}__body`;
const CARD_FOOTER_CLASS = `${CARD_CLASS}__footer`;
const CARD_TITLE_CLASS = `${CARD_CLASS}__title`;
const CARD_SUBTITLE_CLASS = `${CARD_CLASS}__subtitle`;
const CARD_DESCRIPTION_CLASS = `${CARD_CLASS}__description`;
const CARD_META_CLASS = `${CARD_CLASS}__meta`;
const CARD_METADATA_CLASS = `${CARD_CLASS}__metadata`;
const CARD_DIVIDER_CLASS = `${CARD_CLASS}__divider`;
const CARD_CTA_CLASS = `${CARD_CLASS}__cta`;
const CARD_FOOTER_TEXT_CLASS = `${CARD_CLASS}__footer-text`;

export const cardStyles = `
  :where(.${CARD_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--nds-card-gap, ${spacing[12]}px);
    width: var(--nds-card-width, 100%);
    padding: var(--nds-card-padding, var(--inset-card, 16px));
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border-radius: var(--nds-card-radius, ${radius.lg}px);
    background: var(--nds-card-background, ${cv.surface.default});
    overflow: hidden;
    transition: background-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${CARD_ROOT_CLASS}[data-variant="outlined"]) {
    border: 1px solid var(--nds-card-border-color, ${cv.borderRole.subtle});
  }

  :where(.${CARD_ROOT_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${CARD_ROOT_CLASS}[data-clickable="true"]:hover) {
    background: var(--nds-card-hover-background, ${cv.surface.page});
  }

  /* Thumbnail — Figma 고정 height (기본 160px), aspectRatio 도 옵션 유지 */
  :where(.${CARD_THUMBNAIL_CLASS}) {
    position: relative;
    width: 100%;
    height: var(--nds-card-thumbnail-height, 160px);
    overflow: hidden;
    background: ${cv.surface.subtle};
    border-radius: var(--nds-card-thumbnail-radius, 10px);
    flex-shrink: 0;
  }

  :where(.${CARD_THUMBNAIL_CLASS}[data-ratio="true"]) {
    height: auto;
    aspect-ratio: var(--nds-card-thumbnail-ratio, 16 / 10);
  }

  :where(.${CARD_THUMBNAIL_CLASS} img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Avatar — 40px circle */
  :where(.${CARD_AVATAR_CLASS}) {
    position: relative;
    width: var(--nds-card-avatar-size, 40px);
    height: var(--nds-card-avatar-size, 40px);
    border-radius: 50%;
    overflow: hidden;
    background: ${cv.surface.subtle};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${CARD_AVATAR_CLASS} img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Chips / BadgeGroup */
  :where(.${CARD_CHIPS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-tight, ${spacing[4]}px);
    align-items: flex-start;
  }

  /* Text content (Title + Description + Metadata stack) */
  :where(.${CARD_TEXT_CONTENT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 100%;
  }

  :where(.${CARD_TITLE_DESC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    width: 100%;
  }

  :where(.${CARD_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.strong};
    word-break: break-word;
  }

  /* Subtitle / Description — Figma Body 3/Regular, subtle */
  :where(.${CARD_SUBTITLE_CLASS}),
  :where(.${CARD_DESCRIPTION_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    word-break: break-word;
  }

  /* Metadata — Figma Caption 1/Regular, muted */
  :where(.${CARD_METADATA_CLASS}) {
    margin: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  /* Meta (legacy ReactNode slot) — 동일 톤 (Caption 1, muted) */
  :where(.${CARD_META_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-tight, ${spacing[4]}px);
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  /* Body (자유 ReactNode 콘텐츠) */
  :where(.${CARD_BODY_CLASS}) {
    width: 100%;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.subtle};
  }

  /* Divider (옵션 토글) */
  :where(.${CARD_DIVIDER_CLASS}) {
    width: 100%;
    height: 1px;
    background: ${cv.borderRole.subtle};
    margin: 0;
    border: 0;
    flex-shrink: 0;
  }

  /* CTA (액션 버튼 영역) */
  :where(.${CARD_CTA_CLASS}) {
    width: 100%;
  }

  /* Footer text — Figma Caption 1, muted */
  :where(.${CARD_FOOTER_TEXT_CLASS}) {
    margin: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  /* Legacy CardHeader / CardFooter — 새 레이아웃에서도 자연스럽게 */
  :where(.${CARD_HEADER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-default, ${spacing[8]}px);
    width: 100%;
  }

  :where(.${CARD_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default, ${spacing[8]}px);
    width: 100%;
  }

  :where(.${CARD_FOOTER_CLASS}[data-divider="true"]) {
    padding-top: var(--inset-card, 16px);
    border-top: 1px solid ${cv.borderRole.subtle};
  }
`;
