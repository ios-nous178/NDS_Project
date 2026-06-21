/* Auto-generated from packages/react/src/Carousel.tsx during the @nudge-design/styles split. */
import { cv, radius, spacing, transition } from "@nudge-design/tokens";

const CR_CLASS = "nds-carousel";
const CR_VIEWPORT_CLASS = `${CR_CLASS}__viewport`;
const CR_TRACK_CLASS = `${CR_CLASS}__track`;
const CR_SLIDE_CLASS = `${CR_CLASS}__slide`;
const CR_INDICATORS_CLASS = `${CR_CLASS}__indicators`;
const CR_DOT_CLASS = `${CR_CLASS}__dot`;
const CR_NAV_CLASS = `${CR_CLASS}__nav`;
const CR_COUNTER_CLASS = `${CR_CLASS}__counter`;

export const carouselStyles = `
  :where(.${CR_CLASS}) {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  :where(.${CR_VIEWPORT_CLASS}) {
    overflow: hidden;
    border-radius: var(--nds-carousel-radius, ${radius[12]}px);
    width: 100%;
  }

  :where(.${CR_TRACK_CLASS}) {
    display: flex;
    transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
  }

  :where(.${CR_TRACK_CLASS}[data-grabbing="true"]) {
    transition: none;
  }

  :where(.${CR_SLIDE_CLASS}) {
    flex: 0 0 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  :where(.${CR_INDICATORS_CLASS}) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--semantic-gap-default);
    margin-top: ${spacing[16]}px;
  }

  :where(.${CR_DOT_CLASS}) {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    border: none;
    background: ${cv.borderRole.normal};
    padding: 0;
    cursor: pointer;
    transition: background-color ${transition.default}, width ${transition.default};
  }

  :where(.${CR_DOT_CLASS}[data-active="true"]) {
    background: ${cv.iconRole.brand};
    width: 18px;
  }

  :where(.${CR_DOT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CR_NAV_CLASS}) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.normal};
    z-index: 1;
    opacity: 0;
    transition: opacity ${transition.default};
  }

  :where(.${CR_CLASS}:hover) :where(.${CR_NAV_CLASS}) {
    opacity: 1;
  }

  :where(.${CR_NAV_CLASS}[data-side="prev"]) { left: ${spacing[8]}px; }
  :where(.${CR_NAV_CLASS}[data-side="next"]) { right: ${spacing[8]}px; }

  :where(.${CR_NAV_CLASS}:focus-visible) {
    opacity: 1;
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CR_NAV_CLASS}[disabled]) {
    opacity: 0;
    pointer-events: none;
  }

  :where(.${CR_COUNTER_CLASS}) {
    position: absolute;
    bottom: ${spacing[8]}px;
    right: ${spacing[8]}px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    border-radius: 9999px;
    padding: 4px 10px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }
`;
