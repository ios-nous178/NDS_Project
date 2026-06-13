/* Auto-generated from packages/react/src/Heading.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const HD_CLASS = "nds-heading";
const HD_TITLE_CLASS = `${HD_CLASS}__title`;
const HD_DESCRIPTION_CLASS = `${HD_CLASS}__description`;

export const headingStyles = `
  :where(.${HD_CLASS}) {
    display: flex;
    flex-direction: column;
    font-family: ${fontFamily.web};
  }

  :where(.${HD_TITLE_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }

  :where(.${HD_DESCRIPTION_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
  }
`;
