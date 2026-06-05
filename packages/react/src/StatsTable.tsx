import React from "react";

/**
 * StatsTable — 캐포비 어드민 통계/집계 리포트 테이블 (병합셀 + 합계행).
 *
 * native `<table>` 에 `.nds-stats-table` 클래스를 입히는 구조형 컴포넌트.
 * rowspan/colspan(병합셀)을 그대로 쓸 수 있어 합계행·그룹행·**그룹 슈퍼헤더**
 * (예: "남성" 이 10대~60대 하위열을 colSpan 으로 묶는 2단 헤더) 리포트 표에 적합.
 * 동적 정렬/모바일 카드뷰가 필요하면 DataTable 사용.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계(3001:47404) · 인구통계별 리포트(3001:30014)
 *
 * 합계/요약 행은 `<tr className="is-summary">` 또는 `<tr data-summary>` → 전체 셀 Bold.
 * 셀 정렬은 `data-align="right" | "center"`. 슈퍼헤더는 보통 `data-align="center"`.
 *
 * 와이드 리포트(열이 많아 가로로 넘침):
 *   - `scroll` → 표를 가로 스크롤 컨테이너로 감싼다(레이아웃을 깨지 않음).
 *   - `stickyFirst` → 좌측 첫 열(날짜/항목 라벨)을 스크롤 중에도 고정한다.
 *
 * @example 2단 그룹 슈퍼헤더 + 가로 스크롤 + 좌측 고정
 * <StatsTable scroll stickyFirst>
 *   <thead>
 *     <tr>
 *       <th rowSpan={2}>날짜</th>
 *       <th colSpan={6} data-align="center">남성</th>
 *       <th colSpan={6} data-align="center">여성</th>
 *     </tr>
 *     <tr>
 *       <th>10대</th><th>20대</th><th>30대</th><th>40대</th><th>50대</th><th>60대</th>
 *       <th>10대</th><th>20대</th><th>30대</th><th>40대</th><th>50대</th><th>60대</th>
 *     </tr>
 *   </thead>
 *   <tbody>…</tbody>
 * </StatsTable>
 */
export interface StatsTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  /** 표를 가로 스크롤 컨테이너로 감싼다 (열이 많아 넘칠 때). */
  scroll?: boolean;
  /** 좌측 첫 열을 스크롤 중에도 고정 (라벨 열 freeze). `scroll` 과 함께 사용. */
  stickyFirst?: boolean;
  /** scroll 래퍼 `<div>` 에 전달할 className */
  scrollClassName?: string;
}

export function StatsTable({
  className,
  children,
  scroll = false,
  stickyFirst = false,
  scrollClassName,
  ...rest
}: StatsTableProps) {
  const cls = ["nds-stats-table", stickyFirst ? "nds-stats-table--sticky-first" : null, className]
    .filter(Boolean)
    .join(" ");

  const table = (
    <table className={cls} {...rest}>
      {children}
    </table>
  );

  if (!scroll) return table;

  const scrollCls = scrollClassName
    ? `nds-stats-table__scroll ${scrollClassName}`
    : "nds-stats-table__scroll";
  return <div className={scrollCls}>{table}</div>;
}
