/**
 * <nds-stats-table> — DS StatsTable 의 vanilla Web Component 버전.
 *
 * 캐포비 어드민 통계/집계 리포트 테이블 (병합셀 + 합계행). react 와 동일하게
 * native `<table>` 에 `.nds-stats-table` 클래스를 입히는 구조형 컴포넌트 —
 * 자식 markup(`<table>` + rowspan/colspan)을 그대로 보존하고 클래스만 부여한다.
 * 동적 정렬/모바일 카드뷰가 필요하면 <nds-data-table> 사용.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계(3001:47404) · 인구통계별 리포트(3001:30014)
 *
 * 사용 예 (2단 그룹 슈퍼헤더 + 가로 스크롤 + 좌측 고정):
 *   <nds-stats-table scroll sticky-first>
 *     <table>
 *       <thead>
 *         <tr>
 *           <th rowspan="2">날짜</th>
 *           <th colspan="6" data-align="center">남성</th>
 *           <th colspan="6" data-align="center">여성</th>
 *         </tr>
 *         <tr><th>10대</th><th>20대</th>…</tr>
 *       </thead>
 *       <tbody>…</tbody>
 *     </table>
 *   </nds-stats-table>
 *
 * 속성:
 *   scroll       — 호스트를 가로 스크롤 컨테이너로 만든다 (열이 많아 넘칠 때).
 *                  react 는 래퍼 <div> 를 추가하지만, html 은 children 불가침 원칙에 따라
 *                  호스트 자신에게 `.nds-stats-table__scroll` 을 적용한다 (동일 CSS).
 *   sticky-first — 좌측 첫 열(날짜/항목 라벨)을 스크롤 중에도 고정. scroll 과 함께 사용.
 *
 * 합계/요약 행은 `<tr class="is-summary">` 또는 `<tr data-summary>` → 전체 셀 Bold.
 * 셀 정렬은 `data-align="right" | "center"`. (모두 stylesheet 가 처리 — JS 불관여)
 */

import { NdsElement, define } from "../base/nds-element.js";

const ST_CLASS = "nds-stats-table";
const ST_SCROLL_CLASS = `${ST_CLASS}__scroll`;
const ST_STICKY_CLASS = `${ST_CLASS}--sticky-first`;

export class NdsStatsTable extends NdsElement {
  static elementName = "nds-stats-table";

  static get observedAttributes(): readonly string[] {
    return ["scroll", "sticky-first"];
  }

  protected update(): void {
    // children 은 파싱 타이밍에 따라 늦게 도착할 수 있어 매 update 마다 재조회
    // (구조형 래퍼라 input 류와 달리 재조회 비용/포커스 부작용이 없다).
    const table = this.querySelector(":scope > table");
    if (table) {
      table.classList.add(ST_CLASS);
      table.classList.toggle(ST_STICKY_CLASS, this.boolAttr("sticky-first"));
    }
    this.classList.toggle(ST_SCROLL_CLASS, this.boolAttr("scroll"));
    if (this.style.display !== "block") this.style.display = "block";
  }
}

define(NdsStatsTable);
