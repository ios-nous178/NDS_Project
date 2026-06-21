/* Auto-generated from packages/react/src/FormSection.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

const FS_CLASS = "nds-form-section";
const FS_ROOT_CLASS = `${FS_CLASS}__root`;
const FS_HEADER_CLASS = `${FS_CLASS}__header`;
const FS_TITLE_CLASS = `${FS_CLASS}__title`;
const FS_DESC_CLASS = `${FS_CLASS}__description`;
const FS_BODY_CLASS = `${FS_CLASS}__body`;

export const formSectionStyles = `
  :where(.${FS_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FS_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  /* 섹션 제목 = Headline3 24/32 Bold (Figma "기본 정보" 24 Bold). */
  :where(.${FS_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline3.fontSize}px;
    line-height: ${typeScale.headline3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }

  :where(.${FS_DESC_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  /* 카드: 좌우 패딩 24 만 — 세로 리듬은 자식 FormField density="admin"(py-24) 가 담당.
     radius 는 슬롯(base 12) → 캐포비 cascade 16. border 는 subtle(#EEE), bg surface.default(흰). */
  :where(.${FS_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    padding: 0 ${spacing[24]}px;
    border: var(--stroke-thin) solid ${cv.borderRole.subtle};
    border-radius: var(--nds-form-section-radius, ${radius[12]}px);
    background: ${cv.surface.default};
    box-sizing: border-box;
  }
`;
