/* Auto-generated from packages/react/src/FormField.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

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
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* Cashpobi admin 표준 — 라벨 좌측 고정, control 우측 채움.
   * description 이 있으면 컴포넌트 쪽에서 자동 top 폴백 (label-row 가 vertical 이라야 함). */
  :where(.${FF_ROOT_CLASS}[data-label-position="left"]) {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--gap-loose);
  }

  :where(.${FF_LABEL_ROW_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${FF_ROOT_CLASS}[data-label-position="left"]) > .${FF_LABEL_ROW_CLASS} {
    flex: 0 0 var(--nds-form-field-label-width, 180px);
    width: var(--nds-form-field-label-width, 180px);
    /* control 의 입력 baseline 과 라벨 baseline 정렬 — 캐포비 admin 표준 (10px = input padding-y). */
    padding-top: 10px;
  }

  :where(.${FF_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
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
    gap: var(--gap-default);
    flex: 1 1 auto;
    min-width: 0;
  }

  /* ──────────────────────────────────────────────────────────────
   * density="admin" — 캐포비 Cashwalk for Business 어드민 폼 표준
   *   · FormField 자체 py-24 → stack 시 자동 시각 48px 간격 (Figma FormSection 3387:871)
   *   · label Subtitle1 16/24
   *   · helper Body2 14/20
   *   · label↔control gap 16, control 내부 input↔helper gap 8
   * ────────────────────────────────────────────────────────────── */
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) {
    padding-block: ${spacing[24]}px;
    gap: ${spacing[16]}px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"][data-label-position="left"]) > .${FF_LABEL_ROW_CLASS} {
    /* admin: input height 48 기본 → baseline 정렬은 padding 0 (Subtitle1 line-height 24 == input vertical center) */
    padding-top: 12px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) > .${FF_LABEL_ROW_CLASS} :where(.${FF_LABEL_CLASS}) {
    /* Figma Subtitle1/Medium 16/24 ≡ DS typeScale.body1 */
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) > .${FF_CONTROL_CLASS} {
    gap: ${spacing[8]}px;
  }
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) :where(.${FF_HELPER_CLASS}),
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) :where(.${FF_ERROR_CLASS}),
  :where(.${FF_ROOT_CLASS}[data-density="admin"]) :where(.${FF_COUNTER_CLASS}) {
    /* Figma Body2/Regular 14/20 ≡ DS typeScale.body3 */
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  :where(.${FF_FOOTER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-default);
  }

  :where(.${FF_HELPER_CLASS}) {
    flex: 1 1 auto;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${FF_ERROR_CLASS}) {
    flex: 1 1 auto;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.statusError};
  }

  :where(.${FF_COUNTER_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    text-align: right;
  }
`;
