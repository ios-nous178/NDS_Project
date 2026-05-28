/* Auto-generated from packages/react/src/DropdownMenu.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const DM_CLASS = "nds-dropdown-menu";
const DM_PANEL_CLASS = `${DM_CLASS}__panel`;
const DM_GROUP_CLASS = `${DM_CLASS}__group`;
const DM_GROUP_LABEL_CLASS = `${DM_CLASS}__group-label`;
const DM_DIVIDER_CLASS = `${DM_CLASS}__divider`;
const DM_ITEM_CLASS = `${DM_CLASS}__item`;
const DM_ITEM_LABEL_CLASS = `${DM_CLASS}__item-label`;
const DM_ITEM_LEADING_CLASS = `${DM_CLASS}__item-leading`;
const DM_ITEM_TRAILING_CLASS = `${DM_CLASS}__item-trailing`;

export const dropdownMenuStyles = `
  :where(.${DM_PANEL_CLASS}) {
    position: fixed;
    min-width: var(--nds-dropdown-min-width, 160px);
    max-height: 320px;
    overflow-y: auto;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    padding: ${spacing[4]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    animation: nds-dropdown-fade-in ${transition.default};
  }

  :where(.${DM_GROUP_CLASS}) {
    display: flex;
    flex-direction: column;
  }

  :where(.${DM_GROUP_CLASS} + .${DM_GROUP_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
    margin-top: ${spacing[4]}px;
    padding-top: ${spacing[4]}px;
  }

  :where(.${DM_GROUP_LABEL_CLASS}) {
    padding: var(--semantic-inset-chip) var(--semantic-inset-input) ${spacing[4]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    user-select: none;
  }

  :where(.${DM_DIVIDER_CLASS}) {
    height: 1px;
    background: ${cv.borderRole.subtle};
    margin: ${spacing[4]}px 0;
  }

  :where(.${DM_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: ${spacing[10]}px var(--semantic-inset-input);
    border: none;
    background: transparent;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.normal};
    text-align: left;
    width: 100%;
    transition: background-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${DM_ITEM_CLASS}:hover),
  :where(.${DM_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${DM_ITEM_CLASS}[data-danger="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${DM_ITEM_CLASS}[data-danger="true"]:hover),
  :where(.${DM_ITEM_CLASS}[data-danger="true"][data-active="true"]) {
    background: ${cv.surface.statusError};
  }

  :where(.${DM_ITEM_CLASS}:disabled),
  :where(.${DM_ITEM_CLASS}[data-disabled="true"]) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
    background: transparent;
  }

  :where(.${DM_ITEM_LABEL_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${DM_ITEM_LEADING_CLASS}),
  :where(.${DM_ITEM_TRAILING_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${cv.iconRole.normal};
  }

  :where(.${DM_ITEM_TRAILING_CLASS}) {
    color: ${cv.textRole.muted};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${DM_ITEM_CLASS}[data-danger="true"] .${DM_ITEM_LEADING_CLASS}) {
    color: ${cv.textRole.statusError};
  }

  @keyframes nds-dropdown-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
