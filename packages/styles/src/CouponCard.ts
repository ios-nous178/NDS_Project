/* Auto-generated from packages/react/src/CouponCard.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const CC_CLASS = "nds-coupon-card";
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_DIVIDER_CLASS = `${CC_CLASS}__divider`;
const CC_RIGHT_CLASS = `${CC_CLASS}__right`;
const CC_DISCOUNT_CLASS = `${CC_CLASS}__discount`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__desc`;
const CC_EXPIRY_CLASS = `${CC_CLASS}__expiry`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

export const ccStyles = `
  :where(.${CC_CLASS}) {
    display: flex;
    align-items: stretch;
    background: var(--nds-coupon-bg, var(--semantic-bg-status-info));
    color: var(--nds-coupon-fg, var(--semantic-text-brand-default));
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    overflow: hidden;
    box-sizing: border-box;
  }

  :where(.${CC_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
  }

  :where(.${CC_LEFT_CLASS}) {
    flex-shrink: 0;
    width: 110px;
    padding: var(--inset-card) var(--inset-input);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-tight);
  }

  :where(.${CC_DISCOUNT_CLASS}) {
    font-size: 32px;
    font-weight: ${fontWeight.bold};
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  :where(.${CC_DISCOUNT_CLASS}) > small {
    display: block;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    margin-top: ${spacing[4]}px;
    opacity: 0.85;
  }

  :where(.${CC_DIVIDER_CLASS}) {
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      currentColor 0,
      currentColor 4px,
      transparent 4px,
      transparent 8px
    );
    opacity: 0.4;
    flex-shrink: 0;
    position: relative;
  }

  :where(.${CC_DIVIDER_CLASS})::before,
  :where(.${CC_DIVIDER_CLASS})::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: ${cv.surface.default};
    left: -8px;
  }
  :where(.${CC_DIVIDER_CLASS})::before { top: -8px; }
  :where(.${CC_DIVIDER_CLASS})::after { bottom: -8px; }

  :where(.${CC_RIGHT_CLASS}) {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--gap-comfortable);
    padding: var(--inset-card) var(--inset-card-large);
    color: ${cv.textRole.normal};
    background: ${cv.surface.default};
  }

  :where(.${CC_CLASS}[data-disabled="true"]) .${CC_RIGHT_CLASS} {
    color: ${cv.textRole.subtle};
  }

  :where(.${CC_RIGHT_CLASS}) > div {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${CC_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${CC_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CC_EXPIRY_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
    margin-top: ${spacing[4]}px;
  }

  :where(.${CC_ACTION_CLASS}) {
    flex-shrink: 0;
    height: 32px;
    padding: 0 var(--inset-input);
    border: none;
    border-radius: 9999px;
    background: var(--semantic-bg-brand-default);
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    transition: opacity ${transition.default};
  }

  :where(.${CC_ACTION_CLASS}:hover) { opacity: 0.85; }

  :where(.${CC_ACTION_CLASS}[disabled]) {
    background: ${cv.borderRole.normal};
    cursor: not-allowed;
  }
`;
