/* Auto-generated from packages/react/src/ShareSheet.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SS_CLASS = "nds-share-sheet";
const SS_BACKDROP_CLASS = `${SS_CLASS}__backdrop`;
const SS_PANEL_CLASS = `${SS_CLASS}__panel`;
const SS_HEADER_CLASS = `${SS_CLASS}__header`;
const SS_TITLE_CLASS = `${SS_CLASS}__title`;
const SS_DESC_CLASS = `${SS_CLASS}__desc`;
const SS_GRID_CLASS = `${SS_CLASS}__grid`;
const SS_ITEM_CLASS = `${SS_CLASS}__item`;
const SS_ICON_CLASS = `${SS_CLASS}__icon`;
const SS_LABEL_CLASS = `${SS_CLASS}__label`;
const SS_LINK_CLASS = `${SS_CLASS}__link`;
const SS_LINK_INPUT_CLASS = `${SS_CLASS}__link-input`;
const SS_COPY_BTN_CLASS = `${SS_CLASS}__copy-btn`;

export const ssStyles = `
  :where(.${SS_BACKDROP_CLASS}) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: nds-share-fade 200ms ease;
    font-family: ${fontFamily.web};
  }

  @keyframes nds-share-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  :where(.${SS_PANEL_CLASS}) {
    width: 100%;
    max-width: 480px;
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px ${radius.lg}px 0 0;
    padding: var(--semantic-inset-modal) var(--semantic-inset-card-large) var(--semantic-inset-card-large);
    box-sizing: border-box;
    animation: nds-share-slide 240ms ease;
  }

  @keyframes nds-share-slide {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  :where(.${SS_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    margin-bottom: ${spacing[20]}px;
  }

  :where(.${SS_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${SS_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  :where(.${SS_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${SS_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-chip);
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.md}px;
    transition: background-color ${transition.default};
    font-family: inherit;
  }

  :where(.${SS_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${SS_ICON_CLASS}) {
    width: 48px;
    height: 48px;
    border-radius: 9999px;
    background: var(--nds-share-icon-bg, ${cv.surface.section});
    color: ${cv.textRole.normal};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  :where(.${SS_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.normal};
    text-align: center;
  }

  :where(.${SS_LINK_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    margin-top: ${spacing[16]}px;
    padding: var(--semantic-inset-chip) var(--semantic-inset-input);
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
  }

  :where(.${SS_LINK_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.normal};
    min-width: 0;
  }

  :where(.${SS_COPY_BTN_CLASS}) {
    height: 32px;
    padding: 0 var(--semantic-inset-input);
    border: none;
    border-radius: 9999px;
    background: ${cv.surface.inverse};
    color: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    flex-shrink: 0;
  }
`;
