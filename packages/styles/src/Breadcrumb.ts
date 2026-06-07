/* Auto-generated from packages/react/src/Breadcrumb.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-design/tokens";

const BC_CLASS = "nds-breadcrumb";
const BC_ITEM_CLASS = `${BC_CLASS}__item`;
const BC_SEPARATOR_CLASS = `${BC_CLASS}__separator`;

export const breadcrumbStyles = `
  :where(.${BC_CLASS}) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--semantic-gap-tight);
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    box-sizing: border-box;
  }

  :where(.${BC_ITEM_CLASS}) {
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.regular};
    text-decoration: none;
    transition: color ${transition.default};
  }

  :where(a.${BC_ITEM_CLASS}:hover) {
    color: ${cv.textRole.normal};
    text-decoration: underline;
  }

  :where(.${BC_ITEM_CLASS}[data-current="true"]) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
    pointer-events: none;
  }

  :where(.${BC_SEPARATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.muted};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 0;
    user-select: none;
    flex-shrink: 0;
  }

  /* chevron SVG(또는 커스텀 구분자)을 텍스트 baseline 이 아닌 광학 중앙에 정렬 */
  :where(.${BC_SEPARATOR_CLASS} svg) {
    display: block;
  }
`;
