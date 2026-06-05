import React from "react";

/**
 * StatsTable — 캐포비 어드민 통계/집계 리포트 테이블 (병합셀 + 합계행).
 *
 * native `<table>` 에 `.nds-stats-table` 클래스를 입히는 구조형 컴포넌트.
 * rowspan/colspan(병합셀)을 그대로 쓸 수 있어 합계행·그룹행 리포트 표에 적합.
 * 동적 정렬/모바일 카드뷰가 필요하면 DataTable 사용.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (3001:47404 캐시워크 통계 표)
 *
 * 합계/요약 행은 `<tr className="is-summary">` 또는 `<tr data-summary>` → 전체 셀 Bold.
 * 셀 정렬은 `data-align="right" | "center"`.
 *
 * @example
 * <StatsTable>
 *   <thead>
 *     <tr><th>연령</th><th>성별</th><th>당첨자 수</th><th>지급된 캐시</th></tr>
 *   </thead>
 *   <tbody>
 *     <tr className="is-summary"><td colSpan={2}>총합</td><td>999,999</td><td>999,999</td></tr>
 *     <tr><td rowSpan={2}>알 수 없음</td><td>남성</td><td>99</td><td>999</td></tr>
 *     <tr><td>여성</td><td>99</td><td>999</td></tr>
 *     <tr className="is-summary"><td colSpan={2}>알 수 없음 총합</td><td>999</td><td>99,999</td></tr>
 *   </tbody>
 * </StatsTable>
 */
export interface StatsTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function StatsTable({ className, children, ...rest }: StatsTableProps) {
  const cls = className ? `nds-stats-table ${className}` : "nds-stats-table";
  return (
    <table className={cls} {...rest}>
      {children}
    </table>
  );
}
