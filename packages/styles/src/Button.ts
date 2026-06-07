/* Auto-generated from packages/react/src/Button.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;
const BUTTON_ICON_CLASS = `${BUTTON_CLASS}__icon`;

export const buttonStyles = `
  /* Base rule uses .nds-button (not :where()) so that browser/host
   * user-agent and theme rules on the bare \`button\` element
   * (e.g. Docusaurus' Infima theme) don't override our alignment/typography. */
  .${BUTTON_CLASS} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    gap: var(--nds-button-gap, var(--semantic-gap-default));
    width: var(--nds-button-width, auto);
    min-height: var(--nds-button-height, 48px);
    padding: 0 var(--nds-button-padding-x, var(--semantic-inset-card));
    border-radius: var(--nds-button-radius, ${radius.md}px);
    border: 1px solid var(--nds-button-border-color, transparent);
    background: var(--nds-button-background, ${cv.surface.brand});
    color: var(--nds-button-text-color, ${cv.button.textDefault});
    font-family: var(--nds-button-font-family, ${fontFamily.web});
    font-size: var(--nds-button-font-size, ${typeScale.body1.fontSize}px);
    line-height: var(--nds-button-line-height, ${typeScale.body1.lineHeight}px);
    font-weight: var(--nds-button-font-weight, ${fontWeight.bold});
    /* 전 브랜드 공통 룰: 라벨은 항상 1줄. 컨테이너 폭 부족으로 wrap 되면 size 선택이 잘못된 신호다.
     * 가이드(MCP Button) 와 동기화 — host 가 white-space: normal 로 덮어쓰지 못하게 nowrap 강제. */
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default},
      opacity ${transition.default};
  }

  .${BUTTON_CLASS}:disabled {
    /* Host themes often set their own disabled opacity — pin to 1 so our
     * semantic disabled colors carry the full intended contrast.
     * cursor: default 는 base 의 cursor: pointer 를 같은 selector 에서 덮어쓰기 위해 같이 둔다.
     */
    opacity: 1;
    cursor: default;
  }

  /* hover/focus 룰은 :where() 로 감싸지 않는다 — :where() 는 specificity 를 0 으로
   * 만들어버려 base .nds-button(0,0,1,0) 룰이 늘 이기고 hover bg/color/border 가
   * 화면에 안 보이는 버그가 났었음. .nds-button:...:hover 로 두면 (0,0,2,0) 가
   * 확보돼 정상 override. */
  .${BUTTON_CLASS}:not(:disabled):hover {
    background: var(--nds-button-hover-background, var(--nds-button-background));
    border-color: var(--nds-button-hover-border-color, var(--nds-button-border-color));
    color: var(--nds-button-hover-text-color, var(--nds-button-text-color));
  }

  .${BUTTON_CLASS}:focus {
    outline: none;
  }

  .${BUTTON_CLASS}:focus-visible {
    outline: 2px solid var(--nds-button-focus-ring-color, ${cv.borderRole.focus});
    outline-offset: var(--nds-button-focus-ring-offset, 2px);
  }

  :where(.${BUTTON_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* HTML <nds-button> 은 아이콘 SVG + 텍스트를 이 label span 하나로 몰아넣으므로
     * (nds-button._mount), 버튼 본체의 gap 이 둘 사이에 적용되지 않는다. label 자체에
     * gap 을 줘서 아이콘↔텍스트가 붙는 것을 막는다. (React Button 은 아이콘이 label
     * 바깥 형제 span 이라 영향 없음 — HTML 전용 보정.) */
    gap: var(--nds-button-gap, var(--semantic-gap-default));
  }

  :where(.${BUTTON_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--nds-button-icon-size, ${sizing.icon.default}px);
    line-height: 1;
  }

  :where(.${BUTTON_ICON_CLASS} svg) {
    width: var(--nds-button-icon-size, ${sizing.icon.default}px);
    height: var(--nds-button-icon-size, ${sizing.icon.default}px);
  }
`;
