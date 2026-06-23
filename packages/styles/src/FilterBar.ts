/* Auto-generated from packages/react/src/FilterBar.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-design/tokens";

const FB_CLASS = "nds-filter-bar";
const FB_LIST_CLASS = `${FB_CLASS}__list`;
const FB_CHIP_CLASS = `${FB_CLASS}__chip`;
const FB_RESET_CLASS = `${FB_CLASS}__reset`;

export const fbStyles = `
  :where(.${FB_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: ${spacing[4]}px;
  }
  :where(.${FB_CLASS})::-webkit-scrollbar { display: none; }

  :where(.${FB_LIST_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex: 1;
  }

  :where(.${FB_CHIP_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    height: 32px;
    padding: 0 var(--semantic-inset-input);
    border-radius: 9999px;
    border: var(--stroke-default) solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    white-space: nowrap;
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
  }

  :where(.${FB_CHIP_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${FB_CHIP_CLASS}[data-active="true"]) {
    background: ${cv.surface.inverse};
    border-color: ${cv.surface.inverse};
    color: ${cv.surface.default};
  }

  :where(.${FB_CHIP_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${FB_CHIP_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${FB_RESET_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    height: 32px;
    padding: 0 var(--semantic-inset-input);
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }
  :where(.${FB_RESET_CLASS}:hover) { color: ${cv.textRole.normal}; }
`;
