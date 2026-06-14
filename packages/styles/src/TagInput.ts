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

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_ROW_CLASS = `${TI_CLASS}__row`;
const TI_ADD_CLASS = `${TI_CLASS}__add`;
const TI_CHIPS_CLASS = `${TI_CLASS}__chips`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;

export const tiStyles = `
  :where(.${TI_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }
  /* label↔input · input↔helper 모두 8 — 단일 root gap(--semantic-gap-label). */

  :where(.${TI_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  /* ─────────────────────────────────────────────
     variant="stacked" (기본) — 입력칸 + 추가 버튼, 칩은 아래 wrap
     ───────────────────────────────────────────── */
  :where(.${TI_ROW_CLASS}) {
    display: flex;
    align-items: stretch;
    gap: var(--semantic-gap-default);
    width: 100%;
  }

  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    /* Input 과 동일 슬롯 — 캐포비 admin 은 height 48 / radius 10 / padding inset-input 로 cascade */
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    box-sizing: border-box;
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid ${cv.input.borderDefault};
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: ${cv.input.bg};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    outline: none;
    transition: border-color ${transition.default};
  }
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_INPUT_CLASS}:focus) {
    border-color: ${cv.input.borderFocus};
  }
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_INPUT_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_INPUT_CLASS}:disabled) {
    background: ${cv.input.bgDisabled};
    border-color: ${cv.input.borderDisabled};
    cursor: not-allowed;
  }
  :where(.${TI_INPUT_CLASS}::placeholder) { color: ${cv.input.placeholder}; }

  /* 추가 버튼 — 입력칸에 붙는 정사각 affordance: 높이/라운드는 입력 슬롯을 그대로 추종
     (캐포비 40/4, base 48/8). 색은 button 시멘틱(검정 채움 CTA). */
  :where(.${TI_ADD_CLASS}) {
    flex: 0 0 auto;
    width: var(--nds-input-height, ${sizing.input.default}px);
    height: var(--nds-input-height, ${sizing.input.default}px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--nds-input-radius, ${radius.md}px);
    /* 캐포비는 Secondary tone 부재 → 검정 neutral 로 통일(브랜드 슬롯 override). 타 브랜드 base secondary. */
    background: var(--nds-tag-input-add-bg, ${cv.button.bgSecondary});
    color: var(--nds-tag-input-add-color, ${cv.button.textSecondary});
    cursor: pointer;
    transition: background-color ${transition.default}, opacity ${transition.default};
  }
  :where(.${TI_ADD_CLASS}:disabled) {
    background: ${cv.surface.disabled};
    color: ${cv.textRole.disabled};
    cursor: not-allowed;
  }

  :where(.${TI_CHIPS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--semantic-gap-default);
  }

  /* stacked 칩 — 중립 회색 pill + 원형 X (이미지 정합) */
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_TAG_CLASS}) {
    height: 32px;
    padding: 0 ${spacing[6]}px 0 var(--semantic-inset-input);
    background: var(--nds-tag-input-stacked-bg, ${cv.surface.subtle});
    border-radius: var(--nds-tag-input-stacked-radius, 9999px);
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS}) {
    background: ${cv.iconRole.disabled};
    color: ${cv.surface.default};
    opacity: 1;
  }
  :where(.${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS}:hover) {
    background: ${cv.iconRole.normal};
  }

  /* ─── 캐포비(cashwalk-biz) stacked 태그 삭제 글리프 — SelectedItemRow 와 동일(Figma 3001:18463) ───
     솔리드 원형 X(svg) 숨기고 ::before serchdelete mask 로 swap (요소 교체=구조적 → [data-brand] 유지).
     색 gray(iconRole.normal)→hover red(statusError). gray fill·radius 10 은 브랜드 슬롯(components.tag-input)으로 이전. */
  :where([data-brand="cashwalk-biz"] .${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS}) {
    background: transparent;
    color: ${cv.iconRole.normal};
    opacity: 1;
  }
  :where([data-brand="cashwalk-biz"] .${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS}:hover) {
    background: transparent;
    color: ${cv.textRole.statusError};
  }
  :where([data-brand="cashwalk-biz"] .${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS}) svg {
    display: none;
  }
  :where([data-brand="cashwalk-biz"] .${TI_ROOT_CLASS}[data-variant="stacked"] .${TI_REMOVE_CLASS})::before {
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='10' fill='black' fill-opacity='0.4'/><path d='M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z' fill='black'/><path d='M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z' fill='black'/></svg>") center / contain no-repeat;
    mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='10' fill='black' fill-opacity='0.4'/><path d='M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z' fill='black'/><path d='M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z' fill='black'/></svg>") center / contain no-repeat;
  }

  /* ─────────────────────────────────────────────
     variant="inline" — tokenfield (칩이 입력칸 안쪽, 구 기본 동작)
     ───────────────────────────────────────────── */
  :where(.${TI_FIELD_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[6]}px;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: var(--semantic-inset-chip) var(--nds-input-padding-x, var(--semantic-inset-input));
    border: 1px solid ${cv.input.borderDefault};
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: ${cv.input.bg};
    transition: border-color ${transition.default};
    cursor: text;
  }
  :where(.${TI_FIELD_CLASS}:focus-within) {
    border-color: ${cv.input.borderFocus};
  }
  :where(.${TI_FIELD_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }
  :where(.${TI_FIELD_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    cursor: not-allowed;
  }
  :where(.${TI_FIELD_CLASS} .${TI_INPUT_CLASS}) {
    flex: 1;
    min-width: 60px;
    height: 26px;
    border: none;
    background: transparent;
    outline: none;
    padding: 0 ${spacing[2]}px;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 26px;
    color: ${cv.textRole.normal};
  }

  /* inline 칩 — 브랜드 tint pill (해시태그식) */
  :where(.${TI_ROOT_CLASS}[data-variant="inline"] .${TI_TAG_CLASS}) {
    height: 26px;
    padding: 0 ${spacing[4]}px 0 ${spacing[10]}px;
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.semibold};
  }

  /* ─── 공통 칩 / X ─── */
  :where(.${TI_TAG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    border-radius: 9999px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 1;
  }

  :where(.${TI_REMOVE_CLASS}) {
    width: 18px;
    height: 18px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    opacity: 0.7;
    transition: opacity ${transition.default}, background-color ${transition.default};
  }
  :where(.${TI_REMOVE_CLASS}:hover) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
  }
  /* 공유 RemoveIcon(viewBox 14, non-scaling-stroke)은 크기를 CSS 가 정한다 — TagInput 은 10px 렌더(통일 전 사본과 동일). */
  :where(.${TI_REMOVE_CLASS} svg) {
    width: 10px;
    height: 10px;
  }

  /* helper 폰트·색·margin·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text(HelperText.ts) 소유 */
`;
