/* Auto-generated from packages/react/src/FormField.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-design/tokens";

const FF_CLASS = "nds-form-field";
const FF_ROOT_CLASS = `${FF_CLASS}__root`;
const FF_LABEL_ROW_CLASS = `${FF_CLASS}__label-row`;
const FF_LABEL_CLASS = `${FF_CLASS}__label`;
const FF_REQUIRED_CLASS = `${FF_CLASS}__required`;
const FF_OPTIONAL_CLASS = `${FF_CLASS}__optional`;
const FF_DESC_CLASS = `${FF_CLASS}__description`;
const FF_CONTROL_CLASS = `${FF_CLASS}__control`;
const FF_FOOTER_CLASS = `${FF_CLASS}__footer`;
const FF_HELPER_CLASS = `${FF_CLASS}__helper`;
const FF_ERROR_CLASS = `${FF_CLASS}__error`;
const FF_COUNTER_CLASS = `${FF_CLASS}__counter`;

export const formFieldStyles = `
  :where(.${FF_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* CashwalkBiz admin 표준 — 라벨 좌측 고정, control 우측 채움.
   * description 이 있으면 컴포넌트 쪽에서 자동 top 폴백 (label-row 가 vertical 이라야 함). */
  :where(.${FF_ROOT_CLASS}[data-label-position="left"]) {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--semantic-gap-loose);
  }

  :where(.${FF_LABEL_ROW_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
  }

  :where(.${FF_ROOT_CLASS}[data-label-position="left"]) > .${FF_LABEL_ROW_CLASS} {
    flex: 0 0 var(--nds-form-field-label-width, 180px);
    width: var(--nds-form-field-label-width, 180px);
    /* Figma: 라벨 시작점 = control 시작점 (top-align). 루트의 align-items:flex-start 로
     * 처리 — 입력 높이와 무관. 예전엔 라벨을 입력 세로중앙에 맞추려 padding-top(10/12px)을
     * 박았으나, (1) Figma 는 중앙이 아닌 top 정렬이고 (2) 고정 px 라 입력 높이가 다르면
     * 라벨이 처지는 버그였다 — 이제 top 정렬이라 높이(40/48 등) 무관. */
  }

  :where(.${FF_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). admin density 는 아래서 16/24 로 override. */
    font: ${cv.inputTypography.label.font};
    color: var(--nds-form-field-label-color, ${cv.textRole.normal});
  }

  :where(.${FF_REQUIRED_CLASS}) {
    color: ${cv.textRole.statusError};
    font-weight: ${fontWeight.medium};
  }

  :where(.${FF_OPTIONAL_CLASS}) {
    color: ${cv.textRole.muted};
    font-weight: ${fontWeight.regular};
  }

  :where(.${FF_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
  }

  /* footer 를 control column 안으로 흡수 — left 모드에서 control 컬럼과 helper 가 같은 컬럼에 정렬됨. */
  :where(.${FF_CONTROL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    flex: 1 1 auto;
    min-width: 0;
  }

  /* ──────────────────────────────────────────────────────────────
   * density="admin" — 캐포비 Cashwalk for Business 어드민 폼 표준
   *   · FormField 자체 py-24 → stack 시 자동 시각 48px 간격 (Figma FormSection 3387:871)
   *   · label Subtitle1 16/24
   *   · helper/error 는 공용 .nds-helper-text(Input Typography 표준 helper 13/18) — admin 도 base 와 동일
   *   · label↔control gap 16, control 내부 input↔helper gap 8
   * ────────────────────────────────────────────────────────────── */
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) {
    padding-block: ${spacing[24]}px;
    gap: ${spacing[16]}px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) > .${FF_LABEL_ROW_CLASS} :where(.${FF_LABEL_CLASS}) {
    /* Figma Subtitle1/Medium 16/24 ≡ DS typeScale.body1 */
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) > .${FF_CONTROL_CLASS} {
    gap: ${spacing[8]}px;
  }
  /* admin 도 helper/error 폰트는 공용 .nds-helper-text(Input Typography 표준 helper 13/18)를 그대로 따른다.
   * (구버전엔 여기 helper/error/counter 14px override 가 있었으나 source-order 로 죽어 제거 —
   *  base 와 동일하게 Input Typography helper 13/18 로 통일.) */

  :where(.${FF_FOOTER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--semantic-gap-default);
  }

  /* helper/error 의 폰트·색·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text
   * (HelperText.ts) 소유 — 두 element 에 nds-helper-text 클래스가 함께 붙는다.
   * (error span 은 always-error 라 data-error="true" 로 신호.) 여기엔 footer 레이아웃만. */
  :where(.${FF_HELPER_CLASS}),
  :where(.${FF_ERROR_CLASS}) {
    flex: 1 1 auto;
  }

  :where(.${FF_COUNTER_CLASS}) {
    flex-shrink: 0;
    /* char 카운터 — 같은 footer 행의 helper 와 동일하게 Input Typography 표준 13/18(caption1) 로 정렬
     * (행 내 크기 통일, 2026-06-15 결정). 색만 muted 로 de-emphasize. */
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    text-align: right;
  }

`;
