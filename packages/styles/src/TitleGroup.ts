/* Auto-generated from packages/react/src/TitleGroup.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const TB_CLASS = "nds-title-group";
const TB_TITLE_CLASS = `${TB_CLASS}__title`;
const TB_SUBTITLE_CLASS = `${TB_CLASS}__subtitle`;

export const titleGroupStyles = `
  :where(.${TB_CLASS}) {
    display: flex;
    flex-direction: column;
    font-family: ${fontFamily.web};
  }

  :where(.${TB_TITLE_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }

  :where(.${TB_SUBTITLE_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
  }
`;
