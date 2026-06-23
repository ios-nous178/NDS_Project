/* Auto-generated from packages/react/src/ProductCard.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const PC_CLASS = "nds-product-card";
const PC_THUMB_CLASS = `${PC_CLASS}__thumb`;
const PC_BADGE_CLASS = `${PC_CLASS}__badge`;
const PC_RANK_CLASS = `${PC_CLASS}__rank`;
const PC_OVERLAY_CLASS = `${PC_CLASS}__overlay`;
const PC_META_CLASS = `${PC_CLASS}__meta`;
const PC_TITLE_CLASS = `${PC_CLASS}__title`;
const PC_PRICE_ROW_CLASS = `${PC_CLASS}__price-row`;
const PC_DISCOUNT_CLASS = `${PC_CLASS}__discount`;
const PC_PRICE_CLASS = `${PC_CLASS}__price`;
const PC_CURRENCY_CLASS = `${PC_CLASS}__currency`;
const PC_ORIG_PRICE_CLASS = `${PC_CLASS}__orig-price`;
const PC_CHIP_ROW_CLASS = `${PC_CLASS}__chip-row`;
const PC_CHIP_CLASS = `${PC_CLASS}__chip`;
const PC_REWARD_CHIP_CLASS = `${PC_CLASS}__chip--reward`;
const PC_SHIPPING_CHIP_CLASS = `${PC_CLASS}__chip--shipping`;
const PC_POINT_CHIP_CLASS = `${PC_CLASS}__chip--point`;
const PC_FOOTER_CLASS = `${PC_CLASS}__footer`;
const PC_BUYERS_CLASS = `${PC_CLASS}__buyers`;
const PC_RATING_CLASS = `${PC_CLASS}__rating`;

export const pcStyles = `
  :where(.${PC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 140px;
    background: transparent;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border: none;
    padding: 0;
    text-align: left;
  }

  :where(.${PC_CLASS}[data-size="md"]) {
    width: 236px;
  }

  :where(.${PC_CLASS}[data-clickable="true"]) {
    cursor: pointer;
    transition: opacity ${transition.default};
  }

  @media (hover: hover) {
    :where(.${PC_CLASS}[data-clickable="true"]:hover) {
      opacity: 0.85;
    }
  }

  /* ─── Thumbnail ─── */

  :where(.${PC_THUMB_CLASS}) {
    position: relative;
    width: 140px;
    height: 140px;
    flex-shrink: 0;
    box-sizing: border-box;
    background: ${cv.surface.section};
    border: var(--stroke-default) solid ${cv.borderRole.subtle};
    border-radius: ${radius[8]}px;
    overflow: hidden;
  }

  :where(.${PC_CLASS}[data-size="md"] .${PC_THUMB_CLASS}) {
    width: 236px;
    height: 236px;
  }

  :where(.${PC_THUMB_CLASS}) > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  :where(.${PC_BADGE_CLASS}) {
    position: absolute;
    top: ${spacing[8]}px;
    left: ${spacing[8]}px;
    padding: 2px 6px;
    border-radius: ${radius[4]}px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    font-weight: ${fontWeight.bold};
    z-index: 1;
  }

  :where(.${PC_RANK_CLASS}) {
    position: absolute;
    top: ${spacing[8]}px;
    left: ${spacing[8]}px;
    width: 36px;
    height: 36px;
    border-radius: ${radius[8]}px;
    background: var(--nds-product-discount-bg, #f16d4d);
    color: ${cv.textRole.inverse};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${fontFamily.web};
    font-size: 20px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    z-index: 1;
  }

  :where(.${PC_OVERLAY_CLASS}) {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  /* ─── Meta ─── */

  :where(.${PC_META_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
  }

  :where(.${PC_CLASS}[data-size="md"] .${PC_TITLE_CLASS}) {
    /* PC 디자인 — 2줄 고정 높이 (44px) */
    min-height: 44px;
  }

  :where(.${PC_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.strong};
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  /* ─── Price ─── */

  :where(.${PC_ORIG_PRICE_CLASS}) {
    margin: 0;
    font-family: 'Lato', ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 16px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.muted};
    text-decoration: line-through;
    text-decoration-thickness: from-font;
  }

  :where(.${PC_PRICE_ROW_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: ${spacing[2]}px;
    white-space: nowrap;
  }

  :where(.${PC_DISCOUNT_CLASS}) {
    font-family: 'Lato', ${fontFamily.web};
    font-size: 18px;
    line-height: 24px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.statusError};
    letter-spacing: -0.3px;
  }

  :where(.${PC_PRICE_CLASS}) {
    font-family: 'Lato', ${fontFamily.web};
    font-size: 18px;
    line-height: 24px;
    /* Lato Black = 900 — Lato 미로드 시 Pretendard Bold(700) 로 graceful fallback */
    font-weight: 900;
    color: ${cv.textRole.strong};
    letter-spacing: -0.3px;
  }

  :where(.${PC_CURRENCY_CLASS}) {
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.strong};
  }

  /* ─── Chip rows ─── */

  :where(.${PC_CHIP_ROW_CLASS}) {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[6]}px;
  }

  :where(.${PC_CHIP_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    height: 20px;
    padding: 2px 5px;
    border-radius: ${radius[4]}px;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
  }

  :where(.${PC_REWARD_CHIP_CLASS}) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.strong};
    padding: 2px 3px;
  }

  :where(.${PC_REWARD_CHIP_CLASS}) > strong {
    font-weight: ${fontWeight.bold};
  }

  :where(.${PC_SHIPPING_CHIP_CLASS}) {
    background: ${cv.fill.neutralSubtle};
    color: ${cv.textRole.subtle};
  }

  :where(.${PC_POINT_CHIP_CLASS}) {
    background: ${cv.surface.default};
    color: ${cv.textRole.strong};
    border: var(--stroke-default) solid ${cv.borderRole.subtle};
    padding: 3px 3px;
    font-weight: ${fontWeight.bold};
  }

  /* ─── Footer (buyers / rating) ─── */

  :where(.${PC_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[6]}px;
  }

  :where(.${PC_BUYERS_CLASS}) {
    margin: 0;
    font-family: 'Lato', ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 16px;
    color: ${cv.textRole.strong};
  }

  :where(.${PC_BUYERS_CLASS}) > strong {
    font-weight: ${fontWeight.bold};
  }

  :where(.${PC_RATING_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    font-family: 'Lato', ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }

  :where(.${PC_RATING_CLASS}) > span[data-slot="review-count"] {
    font-family: ${fontFamily.web};
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.muted};
  }
`;
