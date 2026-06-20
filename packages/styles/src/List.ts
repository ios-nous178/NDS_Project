/* Auto-generated from packages/react/src/List.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const LIST_CLASS = "nds-list";
const LIST_ROOT_CLASS = `${LIST_CLASS}__root`;
const LIST_HEADER_CLASS = `${LIST_CLASS}__header`;
const LIST_FOOTER_CLASS = `${LIST_CLASS}__footer`;
const LIST_ITEM_CLASS = `${LIST_CLASS}-item`;
const LIST_ITEM_LEADING_CLASS = `${LIST_ITEM_CLASS}__leading`;
const LIST_ITEM_BODY_CLASS = `${LIST_ITEM_CLASS}__body`;
const LIST_ITEM_TITLE_CLASS = `${LIST_ITEM_CLASS}__title`;
const LIST_ITEM_DESC_CLASS = `${LIST_ITEM_CLASS}__description`;
const LIST_ITEM_META_CLASS = `${LIST_ITEM_CLASS}__metadata`;
const LIST_ITEM_TRAILING_CLASS = `${LIST_ITEM_CLASS}__trailing`;
const LIST_ITEM_ACTION_LINK_CLASS = `${LIST_ITEM_CLASS}__action-link`;

export const listStyles = `
  :where(.${LIST_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"]) {
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  /* ── header/footer 슬롯 (presentation li — 리스트 아이템 아님) ── */
  :where(.${LIST_HEADER_CLASS}),
  :where(.${LIST_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
  }

  :where(.${LIST_HEADER_CLASS}) {
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.subtle};
  }

  /* footer 는 '더 보기' full-width 버튼·Pagination 을 담는다 — 자식이 폭을 결정 */
  :where(.${LIST_FOOTER_CLASS}) {
    justify-content: center;
  }

  /* card/divided 변형: header↔첫 아이템, 마지막 아이템↔footer 사이 구분선 */
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_HEADER_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_HEADER_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS} + .${LIST_FOOTER_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS} + .${LIST_FOOTER_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  /* 밀도 = min-height floor (sizing.listRow). 짧은 행은 이 높이로 맞추고, leading(Avatar 48 ·
     Thumbnail 72)이 더 크면 그만큼 자란다. 모든 밀도가 py12/px16/gap12 로 통일되어 Figma 와
     일치한다 (md 56 / lg 72 = Avatar 48 + py24 / xl 96 = Thumb 72 + py24). sm 만 compact. */
  :where(.${LIST_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    min-height: ${sizing.listRow.md}px;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  :where(.${LIST_ITEM_CLASS}[data-size="sm"]) {
    padding: var(--semantic-inset-chip) var(--semantic-inset-input);
    gap: var(--semantic-gap-default);
    min-height: ${sizing.listRow.sm}px;
  }

  /* lg = Avatar 레이아웃 (h72) — 48 원형 + 이름 + (액션). py12 로 48 아바타 + 24 = 72. */
  :where(.${LIST_ITEM_CLASS}[data-size="lg"]) {
    min-height: ${sizing.listRow.lg}px;
  }

  /* xl = Thumbnail 레이아웃 (h96) — 72×72 radius8 썸네일 + Title/Description/Metadata.
     py12 로 72 썸네일 + 24 = 96. */
  :where(.${LIST_ITEM_CLASS}[data-size="xl"]) {
    min-height: ${sizing.listRow.xl}px;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]) {
    cursor: pointer;
    font-family: inherit;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]:hover),
  :where(.${LIST_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${LIST_ITEM_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${LIST_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}),
  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}) {
    color: ${cv.iconRole.strong};
  }

  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    color: ${cv.iconRole.normal};
    margin-left: auto;
  }

  :where(.${LIST_ITEM_BODY_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  :where(.${LIST_ITEM_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${LIST_ITEM_DESC_CLASS}) {
    margin-top: ${spacing[4]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${LIST_ITEM_META_CLASS}) {
    margin-top: ${spacing[2]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.muted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ════════════════════════════════════════════════════════════════════
     Trost List 가이드 (5169:118) — 모두 OPT-IN. 새 룰은 platform/layout 을
     "명시"했을 때만(=[data-layout-explicit="true"]·[data-platform="pc"]) 발화한다.
     폐기 size 별칭만 쓰는 기존 행은 위쪽 [data-size] 룰 그대로 = byte-identical.
     ════════════════════════════════════════════════════════════════════ */

  /* ── PC 밀도: horizontal padding 24, gap 16 (table 은 24) ── */
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"]) {
    padding-left: ${spacing[24]}px;
    padding-right: ${spacing[24]}px;
    gap: ${spacing[16]}px;
  }

  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="table"]) {
    gap: ${spacing[24]}px;
  }

  /* ── Layout 별 min-height floor (mobile = 기본 platform) ──
     default/action = md(56) · avatar = lg(72) · thumbnail = thumbnailMobile(124) ·
     compact = md(56, 모바일은 48 floor 보장이라 compactPc 미적용). table 은 PC 전용. */
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="default"]),
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="action"]) {
    min-height: ${sizing.listRow.md}px;
  }
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="avatar"]) {
    min-height: ${sizing.listRow.lg}px;
  }
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="thumbnail"]) {
    min-height: ${sizing.listRow.thumbnailMobile}px;
  }
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="compact"]) {
    min-height: ${sizing.listRow.md}px;
  }

  /* ── PC min-height floor (마우스 밀도) ──
     default=md(56) · avatar=avatarPc(80) · thumbnail=thumbnailPc(106) ·
     compact=compactPc(42) · table=tablePc(64) · action=md(56). */
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="avatar"]) {
    min-height: ${sizing.listRow.avatarPc}px;
  }
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="thumbnail"]) {
    min-height: ${sizing.listRow.thumbnailPc}px;
  }
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="compact"]) {
    min-height: ${sizing.listRow.compactPc}px;
  }
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="table"]) {
    min-height: ${sizing.listRow.tablePc}px;
  }

  /* ── Inset divider (가이드 룰 #3) — NEW layout 행만. 기존 full-width divider 는 그대로.
     content 시작점까지 인셋: 16(좌 padding) + leading 폭 + gap(12). text-only = 16.
     border-top 을 행 자신에 ::before 로 그려 인셋 가능하게 한다(상단 행은 안 그림). */
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"] + .${LIST_ITEM_CLASS}[data-layout-explicit="true"]),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"] + .${LIST_ITEM_CLASS}[data-layout-explicit="true"]) {
    border-top-color: transparent;
    position: relative;
  }
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"] + .${LIST_ITEM_CLASS}[data-layout-explicit="true"])::before,
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"] + .${LIST_ITEM_CLASS}[data-layout-explicit="true"])::before {
    content: "";
    position: absolute;
    top: 0;
    /* text-only 기본 인셋 = 좌 padding(16). leading 이 있으면 아래 룰이 덮어 늘린다. */
    left: var(--nds-list-divider-inset, var(--semantic-inset-card));
    right: 0;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
  /* leading 폭별 인셋: 16 + leading + gap(12). 행이 leading 슬롯의 실제 폭을 모르므로
     layout 별 표준 leading(avatar 48 / thumbnail mobile 72·pc 80)로 슬롯 기본값을 준다. */
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="avatar"]) {
    --nds-list-divider-inset: calc(${spacing[16]}px + 48px + ${spacing[12]}px);
  }
  :where(.${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="thumbnail"]) {
    --nds-list-divider-inset: calc(${spacing[16]}px + 72px + ${spacing[12]}px);
  }
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="thumbnail"]) {
    --nds-list-divider-inset: calc(${spacing[24]}px + 80px + ${spacing[16]}px);
  }
  /* PC 의 좌 padding 은 24 라 text-only/기본 인셋도 24 로 맞춘다. */
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"]:not([data-layout="avatar"]):not([data-layout="thumbnail"])) {
    --nds-list-divider-inset: ${spacing[24]}px;
  }
  :where(.${LIST_ROOT_CLASS}[data-platform="pc"] .${LIST_ITEM_CLASS}[data-layout-explicit="true"][data-layout="avatar"]) {
    --nds-list-divider-inset: calc(${spacing[24]}px + 48px + ${spacing[16]}px);
  }

  /* ── Table layout: body = 가로 컬럼 행 (date│category│name│flex-spacer│status) ── */
  :where(.${LIST_ITEM_BODY_CLASS}[data-layout="table"]) {
    flex-direction: row;
    align-items: center;
    gap: ${spacing[16]}px;
  }
  /* 직속 컬럼 span 들 — 기본은 내용폭. name(보통 2번째 식별 컬럼)이 flex-spacer 역할로 늘어난다. */
  :where(.${LIST_ITEM_BODY_CLASS}[data-layout="table"] > *) {
    flex: 0 0 auto;
    min-width: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* data-col="name" 컬럼이 남은 공간을 먹어 status 를 우측으로 민다(flex-spacer 역할). */
  :where(.${LIST_ITEM_BODY_CLASS}[data-layout="table"] > [data-col="name"]) {
    flex: 1 1 auto;
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }
  /* status 컬럼 = project 색 (가이드: table status text = Text/Brand). */
  :where(.${LIST_ITEM_BODY_CLASS}[data-layout="table"] > [data-col="status"]) {
    margin-left: auto;
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.bold};
  }

  /* ── Thumbnail(모바일) 3번째 줄 액션 링크 — project 인라인 링크, metadata 와 구분 ── */
  :where(.${LIST_ITEM_ACTION_LINK_CLASS}) {
    align-self: flex-start;
    margin-top: ${spacing[4]}px;
    padding: 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
    cursor: pointer;
    text-decoration: none;
  }
  :where(.${LIST_ITEM_ACTION_LINK_CLASS}:hover) {
    text-decoration: underline;
  }
  :where(.${LIST_ITEM_ACTION_LINK_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: ${radius.sm}px;
  }
`;
