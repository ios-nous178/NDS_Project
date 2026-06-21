/* Auto-generated from packages/react/src/Divider.tsx during the @nudge-design/styles split. */
import { cv, spacing } from "@nudge-design/tokens";

const DIV_CLASS = "nds-divider";

export const dividerStyles = `
  :where(.${DIV_CLASS}) {
    border: none;
    margin: 0;
    flex-shrink: 0;
    background: var(--nds-divider-color, var(--nds-divider-tone, ${cv.borderRole.normal}));
  }

  /* tone — Border 강도 매핑 (특정성 0). color escape hatch 가 항상 이김. */
  :where(.${DIV_CLASS}[data-tone="subtle"]) { --nds-divider-tone: ${cv.borderRole.subtle}; }
  :where(.${DIV_CLASS}[data-tone="normal"]) { --nds-divider-tone: ${cv.borderRole.normal}; }
  :where(.${DIV_CLASS}[data-tone="strong"]) { --nds-divider-tone: ${cv.borderRole.strong}; }

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

  /* block — 섹션 사이 8px 청크(가로 전용). tone 규칙 뒤에 둬 source-order 로 이김. */
  :where(.${DIV_CLASS}[data-type="block"][data-orientation="horizontal"]) {
    height: var(--nds-divider-thickness, ${spacing[8]}px);
    --nds-divider-tone: ${cv.surface.section};
  }
`;
