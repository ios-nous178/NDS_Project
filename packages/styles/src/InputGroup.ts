/* Auto-generated from packages/react/src/InputGroup.tsx during the @nudge-eap/styles split. */

const IG_ROOT_CLASS = "nds-input-group";

export const inputGroupStyles = `
  :where(.${IG_ROOT_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--nds-input-group-gap, 12px);
    width: 100%;
    box-sizing: border-box;
  }

  /* stretch: 모든 자식이 동일 비율로 늘어남 (Figma 표준).
   * direct children + nds-* 호스트(들) 양쪽 매칭 — 어느 쪽이든 1fr 분할.
   */
  :where(.${IG_ROOT_CLASS}[data-align="stretch"]) > * {
    flex: 1 1 0;
    min-width: 0;
  }

  :where(.${IG_ROOT_CLASS}[data-align="start"]) > * {
    flex: 0 0 auto;
  }
`;
