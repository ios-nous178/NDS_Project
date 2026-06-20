/* CheckboxGroup 데이터 모드(select-all + 체크 리스트 + badge/detail) 스타일.
 * 레이아웃 모드(.nds-checkbox-group 기본 flex)는 Checkbox.ts 에 유지되고, 여기서는
 * items 데이터 모드의 sub-element 만 정의한다. 색/radius 는 semantic 토큰(프로젝트 cascade). */
import { cv, fontWeight, radius, spacing, transition, typeScale } from "@nudge-design/tokens";

const CG_CLASS = "nds-checkbox-group";
const CG_SELECT_ALL_CLASS = `${CG_CLASS}__select-all`;
const CG_DIVIDER_CLASS = `${CG_CLASS}__divider`;
const CG_LIST_CLASS = `${CG_CLASS}__list`;
const CG_ITEM_CLASS = `${CG_CLASS}__item`;
const CG_ROW_CLASS = `${CG_CLASS}__row`;
const CG_BADGE_CLASS = `${CG_CLASS}__badge`;
const CG_TOGGLE_CLASS = `${CG_CLASS}__toggle`;
const CG_DETAIL_CLASS = `${CG_CLASS}__detail`;

export const checkboxGroupStyles = `
  /* 데이터 모드 컨테이너 — 세로 스택(레이아웃 모드의 row 옵션과 무관) */
  :where(.${CG_CLASS}[data-mode="data"]) {
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  :where(.${CG_SELECT_ALL_CLASS}) {
    display: flex;
    align-items: center;
    padding: var(--semantic-inset-input) 0;
  }
  :where(.${CG_SELECT_ALL_CLASS}) .${CG_CLASS}__checkbox .nds-checkbox__label {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CG_DIVIDER_CLASS}) {
    height: 1px;
    background: ${cv.borderRole.subtle};
    margin: ${spacing[4]}px 0;
  }

  :where(.${CG_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
    padding: var(--semantic-inset-chip) 0;
  }

  :where(.${CG_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
  }

  :where(.${CG_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-chip) 0;
  }
  /* 행 안의 Checkbox 는 라벨까지 공간을 차지, badge/chevron 은 뒤따른다 */
  :where(.${CG_ROW_CLASS}) .${CG_CLASS}__checkbox {
    flex: 1 1 auto;
    min-width: 0;
  }

  :where(.${CG_BADGE_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }
  /* 필수 항목 뱃지 — 선택 항목(회색)과 구분되도록 강조(빨강 + bold) */
  :where(.${CG_BADGE_CLASS}[data-required="true"]) {
    color: ${cv.textRole.statusError};
    font-weight: ${fontWeight.bold};
  }

  :where(.${CG_TOGGLE_CLASS}) {
    appearance: none;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    transition: transform ${transition.default};
  }
  :where(.${CG_TOGGLE_CLASS}[data-open="true"]) { transform: rotate(180deg); }
  :where(.${CG_TOGGLE_CLASS}) svg { width: 16px; height: 16px; }

  :where(.${CG_DETAIL_CLASS}) {
    margin: ${spacing[4]}px 0 ${spacing[8]}px 32px;
    padding: var(--semantic-inset-input);
    background: ${cv.surface.page};
    border-radius: ${radius.md}px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.strong};
    white-space: pre-wrap;
  }
`;
