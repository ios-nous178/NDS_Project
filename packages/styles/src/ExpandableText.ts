/* Auto-generated from packages/react/src/ExpandableText.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-eap/tokens";

const ET_CLASS = "nds-expandable-text";
const ET_BODY_CLASS = `${ET_CLASS}__body`;
const ET_TOGGLE_CLASS = `${ET_CLASS}__toggle`;

export const etStyles = `
  :where(.${ET_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  :where(.${ET_BODY_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    margin: 0;
    word-break: break-word;
  }

  :where(.${ET_BODY_CLASS}[data-clamped="true"]) {
    display: -webkit-box;
    -webkit-line-clamp: var(--nds-expandable-lines, 3);
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :where(.${ET_TOGGLE_CLASS}) {
    align-self: flex-start;
    border: none;
    background: transparent;
    color: ${cv.textRole.brand};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    padding: 0;
    transition: opacity ${transition.default};
  }

  :where(.${ET_TOGGLE_CLASS}:hover) { opacity: 0.75; }

  :where(.${ET_TOGGLE_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
