/* StatsTable — 캐포비 어드민 통계/집계 리포트 테이블 (병합셀 + 합계행).
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (node 3001:47404 의 캐시워크 통계 표)
 *
 * native <table> 에 class 만 입히는 구조형 컴포넌트 — rowspan/colspan(병합셀)을
 * 그대로 쓸 수 있어 합계행·그룹행 같은 리포트 표에 적합. 동적 정렬/카드뷰가 필요하면
 * DataTable(nds-data-table) 을 쓸 것.
 *
 * 합계/요약 행: <tr class="is-summary"> 또는 <tr data-summary> → 전체 셀 Bold.
 * 셀 정렬: [data-align="right"] / [data-align="center"].
 */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";

const ST_CLASS = "nds-stats-table";

export const statsTableStyles = `
  :where(.${ST_CLASS}) {
    width: 100%;
    border-collapse: collapse;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.normal};
    background: ${cv.surface.default};
  }

  :where(.${ST_CLASS} th) {
    background: ${cv.surface.page};
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
    text-align: left;
    padding: 14px 16px;
    border-bottom: 1px solid ${cv.borderRole.subtle};
    white-space: nowrap;
  }

  :where(.${ST_CLASS} td) {
    padding: 14px 16px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid ${cv.borderRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  /* 컬럼 구분선 (subtle) — 마지막 열 제외 */
  :where(.${ST_CLASS} th:not(:last-child)),
  :where(.${ST_CLASS} td:not(:last-child)) {
    border-right: 1px solid ${cv.borderRole.subtle};
  }

  /* 합계/요약 행 — 전체 셀 Bold + 강조색 */
  :where(.${ST_CLASS} tr.is-summary td),
  :where(.${ST_CLASS} tr[data-summary] td) {
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }

  /* 셀 정렬 옵션 */
  :where(.${ST_CLASS} [data-align="right"]) {
    text-align: right;
  }
  :where(.${ST_CLASS} [data-align="center"]) {
    text-align: center;
  }
`;
