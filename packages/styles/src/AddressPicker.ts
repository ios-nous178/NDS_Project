/* Auto-generated from packages/react/src/AddressPicker.tsx during the @nudge-design/styles split. */
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

const AS_CLASS = "nds-address-picker";
const AS_LABEL_CLASS = `${AS_CLASS}__label`;
const AS_FIELD_ROW_CLASS = `${AS_CLASS}__field-row`;
const AS_INPUT_CLASS = `${AS_CLASS}__input`;
const AS_RESULT_CLASS = `${AS_CLASS}__result`;
const AS_RESULT_LIST_CLASS = `${AS_CLASS}__result-list`;
const AS_RESULT_ITEM_CLASS = `${AS_CLASS}__result-item`;
const AS_DETAIL_CLASS = `${AS_CLASS}__detail`;

export const apStyles = `
  :where(.${AS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${AS_LABEL_CLASS}) {
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.normal};
  }

  :where(.${AS_FIELD_ROW_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
  }

  :where(.${AS_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.input.bg});
    color: ${cv.textRole.normal};
    /* Input Value — Input Typography 표준 value(15/22 · Regular). */
    font: ${cv.inputTypography.value.font};
    transition: border-color ${transition.default};
    /* border-box: height 토큰(48)이 곧 실제 높이가 되도록 — 없으면 1px border 가 더해져
       옆의 검색 Button(border-box 48) 과 2px 어긋난다. */
    box-sizing: border-box;
  }
  :where(.${AS_INPUT_CLASS}:focus) { outline: none; border-color: ${cv.input.borderFocus}; }
  :where(.${AS_INPUT_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }

  /* 검색 버튼은 DS Button(.nds-button) 을 합성 — 비주얼은 Button 토큰이 SSOT.
     여기서는 field-row 안에서 줄어들지 않도록 레이아웃만 고정한다.
     (react: <button class="nds-button">, html: <nds-button>(display:contents) > inner .nds-button — 둘 다 descendant 매칭) */
  :where(.${AS_FIELD_ROW_CLASS}) :where(.nds-button) { flex-shrink: 0; }

  :where(.${AS_RESULT_LIST_CLASS}) {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
    max-height: 240px;
    overflow-y: auto;
  }

  :where(.${AS_RESULT_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    border-bottom: 1px solid ${cv.borderRole.subtle};
    cursor: pointer;
    transition: background-color ${transition.default};
  }
  :where(.${AS_RESULT_ITEM_CLASS}:last-child) { border-bottom: 0; }
  :where(.${AS_RESULT_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${AS_RESULT_ITEM_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
  }
  :where(.${AS_RESULT_ITEM_CLASS}) > span {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${AS_RESULT_CLASS}[data-empty="true"]) {
    padding: var(--semantic-inset-card);
    color: ${cv.textRole.subtle};
    text-align: center;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-size: ${typeScale.body3.fontSize}px;
  }

  :where(.${AS_DETAIL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    padding: var(--semantic-inset-input);
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
  }

  :where(.${AS_DETAIL_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AS_DETAIL_CLASS}) input {
    height: 40px;
    padding: 0 var(--semantic-inset-input);
    border: 1px solid ${cv.input.borderDefault};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    /* Input Value — Input Typography 표준 value(15/22 · Regular). */
    font: ${cv.inputTypography.value.font};
    margin-top: ${spacing[4]}px;
  }

  /* helper 폰트·색·margin·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text(HelperText.ts) 소유 */
`;
