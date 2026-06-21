/* Auto-generated from packages/react/src/Toggle.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;
const TG_INNER_LABELS_CLASS = `${TG_CLASS}__inner-labels`;
const TG_INNER_LABEL_CLASS = `${TG_CLASS}__inner-label`;

export const toggleStyles = `
  :where(.${TG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TG_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
  }

  :where(.${TG_CLASS}) input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${TG_CLASS}) input:focus-visible + .${TG_TRACK_CLASS} {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${TG_TRACK_CLASS}) {
    position: relative;
    width: var(--nds-toggle-track-w, 44px);
    height: var(--nds-toggle-track-h, 24px);
    border-radius: ${radius.full}px;
    background: var(--nds-toggle-track-bg, ${cv.borderRole.normal});
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) {
    background: var(--nds-toggle-track-active-bg, ${cv.fill.brand});
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_TRACK_CLASS}) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_TRACK_CLASS}[data-checked="true"]) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${TG_THUMB_CLASS}) {
    position: absolute;
    top: var(--nds-toggle-thumb-offset, 3px);
    left: var(--nds-toggle-thumb-offset, 3px);
    width: var(--nds-toggle-thumb-size, 18px);
    height: var(--nds-toggle-thumb-size, 18px);
    border-radius: ${radius.full}px;
    background: ${cv.surface.default};
    box-shadow: var(--nds-toggle-thumb-shadow, 0 1px 3px rgba(0, 0, 0, 0.15));
    transition: transform 0.2s ease;
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) .${TG_THUMB_CLASS} {
    transform: translateX(var(--nds-toggle-thumb-travel, 20px));
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_THUMB_CLASS}) {
    background: ${cv.surface.subtle};
  }

  :where(.${TG_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }

  /* ─── tone="success" — 노출/활성 status 토글의 초록 트랙 (semantic status-success) ─── */
  :where(.${TG_TRACK_CLASS}[data-tone="success"][data-checked="true"]) {
    background: var(--nds-toggle-track-active-bg, ${cv.iconRole.statusSuccess});
  }

  /* ─── 라벨 내장(status) 변형 — 트랙 안 on/off 텍스트 + 큰 썸 ─── */
  /* 폭은 긴 라벨 기준 고정 — on/off 두 라벨을 한 grid 셀에 겹쳐 셀이 max(label) 폭을 잡으므로
     상태(노출/미노출)가 바뀌어도 트랙 width 가 동일하다(회귀: width:auto 라 라벨 길이대로 폭 변동). */
  :where(.${TG_TRACK_CLASS}[data-labeled="true"]) {
    width: auto;
    min-width: 64px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    padding: 0 var(--nds-toggle-thumb-offset, 2.5px);
  }

  /* labeled: 썸은 absolute/travel 대신 flex item (좌우 위치는 order 로 결정) */
  :where(.${TG_TRACK_CLASS}[data-labeled="true"]) .${TG_THUMB_CLASS},
  :where(.${TG_TRACK_CLASS}[data-labeled="true"][data-checked="true"]) .${TG_THUMB_CLASS} {
    position: static;
    transform: none;
    flex-shrink: 0;
  }

  /* on/off 라벨 셀 — 두 라벨을 같은 grid 셀에 겹쳐 셀 폭 = 긴 라벨 기준(고정폭의 핵심) */
  :where(.${TG_INNER_LABELS_CLASS}) {
    display: grid;
    align-items: center;
    justify-items: center;
  }
  :where(.${TG_INNER_LABELS_CLASS}) .${TG_INNER_LABEL_CLASS} {
    grid-area: 1 / 1;
  }
  /* 활성 라벨만 표시 — 비활성은 자리(폭)만 차지해 고정폭 유지 */
  :where(.${TG_TRACK_CLASS}[data-checked="true"]) .${TG_INNER_LABEL_CLASS}[data-state="off"],
  :where(.${TG_TRACK_CLASS}[data-checked="false"]) .${TG_INNER_LABEL_CLASS}[data-state="on"] {
    visibility: hidden;
  }
  /* 라벨셀 ↔ 썸 좌우 배치 (체크=라벨 좌·썸 우 / 해제=썸 좌·라벨 우) */
  :where(.${TG_TRACK_CLASS}[data-labeled="true"][data-checked="true"]) .${TG_INNER_LABELS_CLASS} { order: 0; }
  :where(.${TG_TRACK_CLASS}[data-labeled="true"][data-checked="true"]) .${TG_THUMB_CLASS} { order: 1; }
  :where(.${TG_TRACK_CLASS}[data-labeled="true"][data-checked="false"]) .${TG_THUMB_CLASS} { order: 0; }
  :where(.${TG_TRACK_CLASS}[data-labeled="true"][data-checked="false"]) .${TG_INNER_LABELS_CLASS} { order: 1; }

  :where(.${TG_INNER_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body3.lineHeight}px;
    padding: 0 6px;
    white-space: nowrap;
    user-select: none;
    color: ${cv.textRole.subtle};
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) .${TG_INNER_LABEL_CLASS} {
    color: var(--nds-toggle-label-active-color, ${cv.button.textDefault});
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_INNER_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }
`;
