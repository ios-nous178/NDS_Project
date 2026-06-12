/* Chart — 캐포비 어드민 통계 화면 차트 스타일 (line / grouped-bar).
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (node 3001:47404)
 * 데이터 시리즈 색은 --nds-chart-* 슬롯 토큰 (기본값 = base theme components.chart → tokens.css :root).
 *   line  = Primary Yellow #FFD200 (브랜드)
 *   bar 1 = Blue #007AFF (남성)
 *   bar 2 = Orange #FF8437 (여성)
 */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const CHART_CLASS = "nds-chart";
const CHART_SVG_CLASS = `${CHART_CLASS}__svg`;
const CHART_GRID_CLASS = `${CHART_CLASS}__grid`;
const CHART_AXIS_CLASS = `${CHART_CLASS}__axis`;
const CHART_LABEL_CLASS = `${CHART_CLASS}__label`;
const CHART_TOOLTIP_CLASS = `${CHART_CLASS}__tooltip`;
const CHART_LEGEND_CLASS = `${CHART_CLASS}__legend`;
const CHART_LEGEND_ITEM_CLASS = `${CHART_CLASS}__legend-item`;
const CHART_LEGEND_DOT_CLASS = `${CHART_CLASS}__legend-dot`;

export const chartStyles = `
  :where(.${CHART_CLASS}) {
    /* --nds-chart-* 기본값은 tokens.css :root 가 emit (base theme components.chart).
       요소 레벨에 정의하면 브랜드 :root override 를 마스킹하므로 여기 두지 말 것. */
    display: block;
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${CHART_SVG_CLASS}) {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  :where(.${CHART_GRID_CLASS}) {
    stroke: ${cv.borderRole.subtle};
    stroke-width: 1;
  }

  :where(.${CHART_AXIS_CLASS}) {
    stroke: ${cv.borderRole.normal};
    stroke-width: 1;
  }

  :where(.${CHART_LABEL_CLASS}) {
    fill: ${cv.textRole.subtle};
    font-size: 13px;
    font-family: ${fontFamily.web};
  }

  :where(.${CHART_TOOLTIP_CLASS}__box) {
    fill: ${cv.textRole.strong};
  }

  :where(.${CHART_TOOLTIP_CLASS}__text) {
    fill: ${cv.textRole.inverse};
    font-size: 13px;
    font-weight: ${fontWeight.medium};
    font-family: ${fontFamily.web};
  }

  :where(.${CHART_LEGEND_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    margin-top: 12px;
  }

  :where(.${CHART_LEGEND_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${cv.textRole.normal};
  }

  :where(.${CHART_LEGEND_DOT_CLASS}) {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    flex: none;
  }

  /* 도넛 — SVG(좌) + 세로 범례(점 + 라벨 + 굵은 %, 우). Figma 성별 분포(3001:30475). */
  :where(.${CHART_CLASS}--donut) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }

  :where(.${CHART_CLASS}--donut .${CHART_SVG_CLASS}) {
    width: 180px;
    flex: none;
  }

  :where(.${CHART_CLASS}--donut .${CHART_LEGEND_CLASS}) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;
    margin-top: 0;
  }

  :where(.${CHART_CLASS}--donut .${CHART_LEGEND_DOT_CLASS}) {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  :where(.${CHART_CLASS}__legend-pct) {
    margin-left: 2px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
  }
`;
