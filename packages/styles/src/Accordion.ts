/* Auto-generated from packages/react/src/Accordion.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const ACC_CLASS = "nds-accordion";
const ACC_ITEM_CLASS = `${ACC_CLASS}__item`;
const ACC_TRIGGER_CLASS = `${ACC_CLASS}__trigger`;
const ACC_CONTENT_CLASS = `${ACC_CLASS}__content`;
const ACC_CHEVRON_CLASS = `${ACC_CLASS}__chevron`;

export const accordionStyles = `
  :where(.${ACC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${ACC_ITEM_CLASS}) {
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius[12]}px;
    overflow: hidden;
    background: ${cv.surface.default};
  }

  :where(.${ACC_TRIGGER_CLASS}) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    transition: background ${transition.default};
  }

  :where(.${ACC_TRIGGER_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }

  :where(.${ACC_TRIGGER_CLASS}[data-state="open"]) {
    background: ${cv.surface.section};
  }

  :where(.${ACC_CHEVRON_CLASS}) {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${cv.iconRole.normal};
    transition: transform ${transition.default};
  }

  :where(.${ACC_TRIGGER_CLASS}[data-state="open"]) .${ACC_CHEVRON_CLASS} {
    transform: rotate(180deg);
  }

  :where(.${ACC_CONTENT_CLASS}) {
    padding: 0 var(--semantic-inset-card-large) var(--semantic-inset-card);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    background: ${cv.surface.section};
  }
`;
