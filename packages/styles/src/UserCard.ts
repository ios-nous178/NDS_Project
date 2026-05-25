/* Auto-generated from packages/react/src/UserCard.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const UC_CLASS = "nds-user-card";
const UC_AVATAR_CLASS = `${UC_CLASS}__avatar`;
const UC_BODY_CLASS = `${UC_CLASS}__body`;
const UC_NAME_CLASS = `${UC_CLASS}__name`;
const UC_VERIFIED_CLASS = `${UC_CLASS}__verified`;
const UC_HANDLE_CLASS = `${UC_CLASS}__handle`;
const UC_BIO_CLASS = `${UC_CLASS}__bio`;
const UC_META_CLASS = `${UC_CLASS}__meta`;
const UC_ACTION_CLASS = `${UC_CLASS}__action`;

export const ucStyles = `
  :where(.${UC_CLASS}) {
    display: flex;
    gap: var(--gap-comfortable);
    padding: var(--inset-input) var(--inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
    box-sizing: border-box;
    align-items: center;
  }

  :where(.${UC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${UC_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.borderRole.brand}; }

  :where(.${UC_CLASS}[data-layout="stacked"]) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--inset-card-large);
  }

  :where(.${UC_AVATAR_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${UC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${UC_NAME_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${UC_VERIFIED_CLASS}) {
    display: inline-flex;
    margin-left: ${spacing[4]}px;
    color: ${cv.textRole.brand};
    vertical-align: middle;
  }

  :where(.${UC_HANDLE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${UC_BIO_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.normal};
    margin-top: ${spacing[4]}px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :where(.${UC_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-default);
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
    margin-top: ${spacing[4]}px;
  }

  :where(.${UC_ACTION_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${UC_CLASS}[data-layout="stacked"]) .${UC_ACTION_CLASS} {
    width: 100%;
    margin-top: ${spacing[12]}px;
  }
`;
