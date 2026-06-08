/* Auto-generated from packages/react/src/Tooltip.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const TT_CLASS = "nds-tooltip";
const TT_TRIGGER_CLASS = `${TT_CLASS}__trigger`;
const TT_CONTENT_CLASS = `${TT_CLASS}__content`;
const TT_ARROW_CLASS = `${TT_CLASS}__arrow`;

export const tooltipStyles = `
  :where(.${TT_CLASS}) {
    position: relative;
    display: inline-flex;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TT_TRIGGER_CLASS}) {
    display: inline-flex;
    cursor: default;
  }

  :where(.${TT_CONTENT_CLASS}) {
    position: absolute;
    z-index: ${zIndex.popup};
    padding: var(--semantic-inset-chip) var(--semantic-inset-input);
    /* --nds-tooltip-bg 슬롯: 미설정 시 surface.inverse (기존 동작) — 브랜드 cascade override 여지. */
    background: var(--nds-tooltip-bg, ${cv.surface.inverse});
    color: ${cv.textRole.inverse};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    border-radius: ${radius.md}px;
    pointer-events: none;
    max-width: 240px;
    white-space: normal;
    word-break: keep-all;
  }

  /* 리치 본문(<template slot="content">) — 제목+불릿 등 멀티라인 안내. 좌측 정렬·본문 타이포 16/24. */
  :where(.${TT_CONTENT_CLASS}[data-rich="true"]) {
    text-align: left;
    font-size: 16px;
    line-height: 24px;
  }
  :where(.${TT_CONTENT_CLASS}[data-rich="true"] strong) { font-weight: ${fontWeight.bold}; }
  :where(.${TT_CONTENT_CLASS}[data-rich="true"] p) { margin: 0; }
  :where(.${TT_CONTENT_CLASS}[data-rich="true"] ul) { margin: 4px 0 0; padding-left: 22px; }
  :where(.${TT_CONTENT_CLASS}[data-rich="true"] li) { list-style: disc; }
  :where(.${TT_CONTENT_CLASS}[data-rich="true"] li + li) { margin-top: 4px; }

  :where(.${TT_CONTENT_CLASS}[data-placement="top"]) {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="bottom"]) {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="left"]) {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="right"]) {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  :where(.${TT_ARROW_CLASS}) {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--nds-tooltip-bg, ${cv.surface.inverse});
    transform: rotate(45deg);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="top"]) .${TT_ARROW_CLASS} {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="bottom"]) .${TT_ARROW_CLASS} {
    top: -4px;
    left: 50%;
    margin-left: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="left"]) .${TT_ARROW_CLASS} {
    right: -4px;
    top: 50%;
    margin-top: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="right"]) .${TT_ARROW_CLASS} {
    left: -4px;
    top: 50%;
    margin-top: -4px;
  }

  /* ─── 캐포비(cashwalk-biz) 어드민 Tooltip — Figma 7dCJU5lNPfgcAjFPwbbLIu 4018:1161 정합.
     · 배경(#333): --nds-tooltip-bg 슬롯을 brand 토큰맵에서 --semantic-fill-neutral-default 로 override
       (cashwalk-biz.ts components.tooltip.bg). 컴포넌트 CSS 엔 hex 없음 — 시멘틱 cascade.
     · 리치 본문: Figma compact 스펙(padding 14/16, gap 6, 제목 13 Medium · 본문 12/18).
     다른 브랜드는 슬롯 미설정 → surface.inverse · 16/24 rich 유지(영향 없음). ─── */
  :where([data-brand="cashwalk-biz"] .${TT_CONTENT_CLASS}[data-rich="true"]) {
    gap: ${spacing[6]}px;
    padding: ${spacing[14]}px ${spacing[16]}px;
    border-radius: ${radius.md}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 18px;
  }
  :where([data-brand="cashwalk-biz"] .${TT_CONTENT_CLASS}[data-rich="true"] p:first-child) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: normal;
  }
  :where([data-brand="cashwalk-biz"] .${TT_CONTENT_CLASS}[data-rich="true"] ul) {
    margin: 0;
    padding-left: 18px;
  }
  :where([data-brand="cashwalk-biz"] .${TT_CONTENT_CLASS}[data-rich="true"] li + li) {
    margin-top: ${spacing[6]}px;
  }
`;
