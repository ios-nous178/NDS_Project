/* Auto-generated from packages/react/src/AvatarGroup.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const AG_CLASS = "nds-avatar-group";
const AG_ITEM_CLASS = `${AG_CLASS}__item`;
const AG_MORE_CLASS = `${AG_CLASS}__more`;

export const agStyles = `
  :where(.${AG_CLASS}) {
    display: inline-flex;
    align-items: center;
    font-family: ${fontFamily.web};
  }

  :where(.${AG_ITEM_CLASS}) {
    margin-left: calc(-1 * var(--nds-avatar-group-overlap, 12px));
    border: 2px solid ${cv.surface.default};
    border-radius: 9999px;
    box-sizing: content-box;
  }

  :where(.${AG_ITEM_CLASS}:first-child) { margin-left: 0; }

  :where(.${AG_MORE_CLASS}) {
    margin-left: calc(-1 * var(--nds-avatar-group-overlap, 12px));
    width: var(--nds-avatar-group-more-size, 40px);
    height: var(--nds-avatar-group-more-size, 40px);
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    border: 2px solid ${cv.surface.default};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--nds-avatar-group-more-font, 13px);
    font-weight: ${fontWeight.semibold};
    box-sizing: content-box;
  }
`;
