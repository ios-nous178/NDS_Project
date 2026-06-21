/* Auto-generated from packages/react/src/Card.tsx during the @nudge-design/styles split. */
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

const CARD_CLASS = "nds-card";
const CARD_ROOT_CLASS = `${CARD_CLASS}__root`;
const CARD_THUMBNAIL_CLASS = `${CARD_CLASS}__thumbnail`;
const CARD_AVATAR_CLASS = `${CARD_CLASS}__avatar`;
const CARD_CHIPS_CLASS = `${CARD_CLASS}__chips`;
const CARD_HEADER_CLASS = `${CARD_CLASS}__header`;
const CARD_HEADER_ROW_CLASS = `${CARD_CLASS}__header-row`;
const CARD_HEADER_ICON_CLASS = `${CARD_CLASS}__header-icon`;
const CARD_HEADER_INFO_CLASS = `${CARD_CLASS}__header-info`;
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
    padding: var(--nds-card-padding, var(--semantic-inset-card, 16px));
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border-radius: var(--nds-card-radius, ${radius[12]}px);
    background: var(--nds-card-background, ${cv.surface.default});
    overflow: hidden;
    transition: background-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${CARD_ROOT_CLASS}[data-variant="outlined"]) {
    border: var(--stroke-thin) solid var(--nds-card-border-color, ${cv.borderRole.subtle});
  }

  /* Elevation (Trost container card) — outline=현행(보더, shadow 없음) / elevated=shadow + 보더 제거.
     data-elevation 기본값은 react/html 둘 다 "outline" 이라 기존 렌더는 그대로. */
  :where(.${CARD_ROOT_CLASS}[data-elevation="elevated"]) {
    box-shadow: ${shadow.e2};
    border: none;
  }

  /* Platform 사이즈 프리셋 (Trost) — 슬롯을 ROOT 에 set 해 프로젝트 상속값을 이긴다.
     data-platform 미지정이면 어떤 룰도 매칭 안 되므로 현행 렌더 유지. */
  :where(.${CARD_ROOT_CLASS}[data-platform="pc"]) {
    --nds-card-padding: ${spacing[28]}px;
    --nds-card-radius: ${radius[16]}px;
    --nds-card-title-size: ${typeScale.headline4.fontSize}px;
    --nds-card-title-line: ${typeScale.headline4.lineHeight}px;
    --nds-card-subtitle-size: ${typeScale.body3.fontSize}px;
    --nds-card-subtitle-line: ${typeScale.body3.lineHeight}px;
  }

  :where(.${CARD_ROOT_CLASS}[data-platform="mobile"]) {
    --nds-card-padding: ${spacing[20]}px;
    --nds-card-radius: 14px;
    --nds-card-title-size: 17px;
    --nds-card-title-line: 24px;
    --nds-card-subtitle-size: ${typeScale.caption1.fontSize}px;
    --nds-card-subtitle-line: ${typeScale.caption1.lineHeight}px;
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
    gap: var(--semantic-gap-tight, ${spacing[4]}px);
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

  /* Trost container-card header row — 리딩 아이콘(24px) + 10px gap + 정보 컬럼 */
  :where(.${CARD_HEADER_ROW_CLASS}) {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${spacing[10]}px;
    width: 100%;
  }

  :where(.${CARD_HEADER_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-card-header-icon-size, ${spacing[24]}px);
    height: var(--nds-card-header-icon-size, ${spacing[24]}px);
    color: ${cv.iconRole.point};
  }

  :where(.${CARD_HEADER_ICON_CLASS} svg),
  :where(.${CARD_HEADER_ICON_CLASS} img) {
    width: 100%;
    height: 100%;
  }

  /* 정보 컬럼 — title 위 subtitle, 2px gap */
  :where(.${CARD_HEADER_INFO_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
    min-width: 0;
    flex: 1;
  }

  :where(.${CARD_TITLE_CLASS}) {
    margin: 0;
    /* 기본값 = 현행 Headline 5/Bold. platform 프리셋이 슬롯만 덮어 크기 변경. */
    font-size: var(--nds-card-title-size, ${typeScale.headline5.fontSize}px);
    font-weight: ${fontWeight.bold};
    line-height: var(--nds-card-title-line, ${typeScale.headline5.lineHeight}px);
    color: ${cv.textRole.strong};
    word-break: break-word;
  }

  /* Subtitle / Description — Figma Body 3/Regular, subtle */
  :where(.${CARD_SUBTITLE_CLASS}),
  :where(.${CARD_DESCRIPTION_CLASS}) {
    margin: 0;
    font-size: var(--nds-card-subtitle-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.regular};
    line-height: var(--nds-card-subtitle-line, ${typeScale.body3.lineHeight}px);
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
    gap: var(--semantic-gap-tight, ${spacing[4]}px);
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
    gap: var(--semantic-gap-default, ${spacing[8]}px);
    width: 100%;
  }

  :where(.${CARD_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default, ${spacing[8]}px);
    width: 100%;
  }

  :where(.${CARD_FOOTER_CLASS}[data-divider="true"]) {
    padding-top: var(--semantic-inset-card, 16px);
    border-top: var(--stroke-thin) solid ${cv.borderRole.subtle};
  }
`;
