/* Auto-generated from packages/react/src/SelectionButtonGroup.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SBG_CLASS = "nds-selection-button-group";
const SBG_ROOT_CLASS = `${SBG_CLASS}__root`;
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;
const SBG_LABEL_CLASS = `${SBG_CLASS}__label`;

export const selectionButtonGroupStyles = `
  /*
   * 그룹 내 옵션은 등폭이 기본이다 — '전체'(좁음) / '특정 지역'(넓음) 처럼 라벨 길이가
   * 달라도 묶인 옵션 너비가 들쭉날쭉하면 안 된다(디자인 결정 2026-06).
   * inline-grid + grid-auto-columns:1fr = 그룹은 콘텐츠에 hug 하되 모든 열은 가장 넓은
   * 옵션 기준으로 균등. fullWidth=true 는 컨테이너 100% 를 균등 분할.
   */
  :where(.${SBG_ROOT_CLASS}) {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SBG_ROOT_CLASS}[data-fullwidth="true"]) {
    display: grid;
    width: 100%;
  }

  :where(.${SBG_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* 좌우 패딩은 슬롯으로 노출하되 기본 24 — 셀이 좁아져도 라벨이 ellipsis 로 줄어들
       뿐(아래 __label), 패딩을 침범하지 않도록 최소 패딩을 보장한다. */
    padding: ${spacing[14]}px var(--nds-selection-button-padding-x, ${spacing[24]}px);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    white-space: nowrap;
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
  }

  /* 라벨 — 셀이 좁아지면 패딩을 먹지 않고 말줄임. (flex child 라 min-width:0 필수) */
  :where(.${SBG_LABEL_CLASS}) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 등폭 그리드 셀을 꽉 채우고, 긴 라벨도 셀 안에서 줄어들 수 있게 한다(grid 기본 stretch). */
  :where(.${SBG_ROOT_CLASS} .${SBG_ITEM_CLASS}) {
    width: 100%;
    min-width: 0;
  }

  :where(.${SBG_ITEM_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    border-color: ${cv.borderRole.strong};
    color: ${cv.textRole.normal};
  }

  :where(.${SBG_ITEM_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brandSubtle};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${SBG_ITEM_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${SBG_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }
`;
