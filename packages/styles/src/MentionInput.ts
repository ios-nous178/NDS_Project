/* Auto-generated from packages/react/src/MentionInput.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const MI_CLASS = "nds-mention-input";
const MI_LABEL_CLASS = `${MI_CLASS}__label`;
const MI_FIELD_CLASS = `${MI_CLASS}__field`;
const MI_TEXTAREA_CLASS = `${MI_CLASS}__textarea`;
const MI_LIST_CLASS = `${MI_CLASS}__list`;
const MI_ITEM_CLASS = `${MI_CLASS}__item`;
const MI_HELPER_CLASS = `${MI_CLASS}__helper`;

export const miStyles = `
  :where(.${MI_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
  }

  :where(.${MI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${MI_FIELD_CLASS}) {
    position: relative;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default};
  }
  :where(.${MI_FIELD_CLASS}:focus-within) { border-color: ${cv.borderRole.brand}; }
  :where(.${MI_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }

  :where(.${MI_TEXTAREA_CLASS}) {
    width: 100%;
    min-height: 88px;
    border: none;
    background: transparent;
    outline: none;
    resize: vertical;
    padding: var(--inset-input) var(--inset-card);
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    box-sizing: border-box;
  }
  :where(.${MI_TEXTAREA_CLASS}::placeholder) { color: ${cv.textRole.muted}; }

  :where(.${MI_LIST_CLASS}) {
    position: absolute;
    list-style: none;
    margin: 0;
    padding: ${spacing[4]}px 0;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 10;
    max-height: 240px;
    overflow-y: auto;
    min-width: 240px;
  }

  :where(.${MI_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-comfortable);
    padding: var(--inset-chip) var(--inset-card);
    cursor: pointer;
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default};
  }
  :where(.${MI_ITEM_CLASS}[data-active="true"]),
  :where(.${MI_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${MI_ITEM_CLASS}) > div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  :where(.${MI_ITEM_CLASS}) strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }
  :where(.${MI_ITEM_CLASS}) span {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${MI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
  :where(.${MI_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
