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
    overflow: hidden;
  }

  /* Card — 배경+라운드+보더 (기본). 심리검사 카드·상품 리스트. */
  :where(.${ACC_CLASS}[data-type="card"] .${ACC_ITEM_CLASS}) {
    border: var(--stroke-default) solid ${cv.borderRole.subtle};
    border-radius: ${radius[12]}px;
    overflow: hidden;
    background: ${cv.surface.default};
  }

  /* Line — 구분선 기반(하단 1px). FAQ·약관·정책 리스트. */
  :where(.${ACC_CLASS}[data-type="line"]) {
    gap: 0;
  }
  :where(.${ACC_CLASS}[data-type="line"] .${ACC_ITEM_CLASS}) {
    border-bottom: var(--stroke-default) solid ${cv.borderRole.subtle};
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
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.strong};
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
