/* Auto-generated from packages/react/src/Lightbox.tsx during the @nudge-design/styles split. */
import { fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-design/tokens";

const LB_CLASS = "nds-lightbox";
const LB_BACKDROP_CLASS = `${LB_CLASS}__backdrop`;
const LB_IMG_CLASS = `${LB_CLASS}__img`;
const LB_CLOSE_CLASS = `${LB_CLASS}__close`;
const LB_NAV_CLASS = `${LB_CLASS}__nav`;
const LB_COUNTER_CLASS = `${LB_CLASS}__counter`;
const LB_CAPTION_CLASS = `${LB_CLASS}__caption`;

export const lbStyles = `
  :where(.${LB_BACKDROP_CLASS}) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: ${fontFamily.web};
  }

  :where(.${LB_IMG_CLASS}) {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    user-select: none;
  }

  :where(.${LB_CLOSE_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    right: ${spacing[16]}px;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default};
  }
  :where(.${LB_CLOSE_CLASS}:hover) { background: rgba(255, 255, 255, 0.22); }
  :where(.${LB_CLOSE_CLASS}:focus-visible) {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  :where(.${LB_NAV_CLASS}) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default};
  }
  :where(.${LB_NAV_CLASS}:hover) { background: rgba(255, 255, 255, 0.22); }
  :where(.${LB_NAV_CLASS}[data-side="prev"]) { left: ${spacing[16]}px; }
  :where(.${LB_NAV_CLASS}[data-side="next"]) { right: ${spacing[16]}px; }
  :where(.${LB_NAV_CLASS}[disabled]) {
    opacity: 0.3;
    cursor: not-allowed;
  }

  :where(.${LB_COUNTER_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    background: rgba(0, 0, 0, 0.5);
    padding: 6px var(--inset-input);
    border-radius: 9999px;
  }

  :where(.${LB_CAPTION_CLASS}) {
    margin-top: ${spacing[16]}px;
    color: #fff;
    text-align: center;
    max-width: 80vw;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }
`;
