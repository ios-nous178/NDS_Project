/* Auto-generated from packages/react/src/Dim.tsx during the @nudge-design/styles split. */
import { cv } from "@nudge-design/tokens";

const DIM_CLASS = "nds-dim";

export const dimStyles = `
  :where(.${DIM_CLASS}) {
    position: fixed;
    inset: 0;
    /* 강도 합성: ① 프로젝트 override > ② variant 슬롯 > ③ 기본(Default = BG/Overlay) */
    background: var(--nds-dim-bg, var(--nds-dim-variant-bg, ${cv.surface.overlay}));
  }

  :where(.${DIM_CLASS}[data-type="subtle"]) {
    --nds-dim-variant-bg: ${cv.surface.overlaySubtle};
  }
  :where(.${DIM_CLASS}[data-type="default"]) {
    --nds-dim-variant-bg: ${cv.surface.overlay};
  }
  :where(.${DIM_CLASS}[data-type="strong"]) {
    --nds-dim-variant-bg: ${cv.surface.overlayStrong};
  }

  :where(.${DIM_CLASS}[data-animated="true"]) {
    animation: nds-dim-fade-in 0.18s ease-out;
  }

  @keyframes nds-dim-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
