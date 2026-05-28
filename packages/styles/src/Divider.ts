/* Auto-generated from packages/react/src/Divider.tsx during the @nudge-design/styles split. */
import { cv, spacing } from "@nudge-design/tokens";

const DIV_CLASS = "nds-divider";

export const dividerStyles = `
  :where(.${DIV_CLASS}) {
    border: none;
    margin: 0;
    flex-shrink: 0;
    background: var(--nds-divider-color, ${cv.borderRole.subtle});
  }

  :where(.${DIV_CLASS}[data-orientation="horizontal"]) {
    width: 100%;
    height: var(--nds-divider-thickness, 1px);
    margin: var(--nds-divider-spacing, 0) 0;
  }

  :where(.${DIV_CLASS}[data-orientation="vertical"]) {
    width: var(--nds-divider-thickness, 1px);
    height: var(--nds-divider-height, 10px);
    margin: 0 var(--nds-divider-spacing, ${spacing[8]}px);
    align-self: center;
  }
`;
