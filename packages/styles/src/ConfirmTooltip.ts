/* ConfirmTooltip — 캐포비 어드민 popconfirm (Figma 7dCJU5lNPfgcAjFPwbbLIu 4018:1226 정합).
 * 흰 배경 말풍선 + 제목/본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail.
 * Tooltip(다크 hover 안내)과 분리 — 이건 "사용자의 응답/결정이 필요한" 가벼운 확인 팝업.
 *
 * 색은 전부 semantic role 토큰 (프로젝트 cascade 로 해석) — 컴포넌트엔 hex 없음.
 *   · 본문 표면      : surface.default (캐포비 #FFF)
 *   · 제목           : textRole.strong (캐포비 #111 — Figma #212121 근사)
 *   · 본문 설명      : textRole.subtle (캐포비 #666 — Figma #595959 근사)
 *   · confirm 버튼   : button.bgNeutral / textNeutralSolid (캐포비 검정 CTA — tone=Primary+Neutral, Secondary 없음)
 *   · cancel 버튼    : 검정 CTA 의 outlined 형제 — border = button.bgNeutral
 * radius(10/6) 와 본문 폭(280) 은 geometry raw px (skill 규칙: 특정 radius/치수 허용).
 */
import {
  cv,
  fontFamily,
  fontWeight,
  shadow,
  spacing,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const CT_CLASS = "nds-confirm-tooltip";
const CT_TRIGGER_CLASS = `${CT_CLASS}__trigger`;
const CT_CONTENT_CLASS = `${CT_CLASS}__content`;
const CT_TITLE_CLASS = `${CT_CLASS}__title`;
const CT_DESC_CLASS = `${CT_CLASS}__desc`;
const CT_ACTIONS_CLASS = `${CT_CLASS}__actions`;
const CT_BTN_CLASS = `${CT_CLASS}__btn`;
const CT_BTN_CANCEL_CLASS = `${CT_CLASS}__btn--cancel`;
const CT_BTN_CONFIRM_CLASS = `${CT_CLASS}__btn--confirm`;
const CT_ARROW_CLASS = `${CT_CLASS}__arrow`;

export const confirmTooltipStyles = `
  :where(.${CT_CLASS}) {
    position: relative;
    display: inline-flex;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CT_TRIGGER_CLASS}) {
    display: inline-flex;
  }

  :where(.${CT_CONTENT_CLASS}) {
    position: absolute;
    z-index: ${zIndex.popup};
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    box-sizing: border-box;
    padding: ${spacing[16]}px ${spacing[20]}px;
    background: ${cv.surface.default};
    border-radius: 10px;
    box-shadow: ${shadow[2]};
    text-align: left;
  }

  :where(.${CT_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: normal;
    color: ${cv.textRole.strong};
    white-space: nowrap;
  }

  :where(.${CT_DESC_CLASS}) {
    margin: 0;
    width: var(--nds-confirm-tooltip-body-width, 280px);
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 18px;
    color: ${cv.textRole.subtle};
    word-break: keep-all;
  }

  :where(.${CT_ACTIONS_CLASS}) {
    display: flex;
    justify-content: flex-end;
    gap: ${spacing[8]}px;
    width: var(--nds-confirm-tooltip-body-width, 280px);
    padding-top: ${spacing[8]}px;
  }

  :where(.${CT_BTN_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[6]}px;
    min-height: 40px;
    padding: ${spacing[10]}px ${spacing[14]}px;
    border: 1px solid transparent;
    border-radius: 6px;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    cursor: pointer;
    box-sizing: border-box;
    transition: opacity 0.15s ease;
  }

  :where(.${CT_BTN_CLASS}:active) {
    opacity: 0.85;
  }

  /* confirm = 캐포비 검정 CTA. 캐포비 tone 은 Primary + Neutral 뿐(Secondary 없음) →
     Modal/Popup 과 동일하게 button.bgNeutral(#111)/textNeutralSolid(흰) 로 통일. */
  :where(.${CT_BTN_CONFIRM_CLASS}) {
    background: ${cv.button.bgNeutral};
    border-color: ${cv.button.bgNeutral};
    color: ${cv.button.textNeutralSolid};
  }

  /* cancel = 검정 CTA 의 outlined 형제 — neutral fill 슬롯(검정 #111)을 border/text 로 차용
     (Figma 는 neutral-900 #111 바인딩). */
  :where(.${CT_BTN_CANCEL_CLASS}) {
    background: ${cv.surface.default};
    border-color: ${cv.button.bgNeutral};
    color: ${cv.textRole.strong};
  }

  /* ─── tail (12×8 삼각형) ─── */
  :where(.${CT_ARROW_CLASS}) {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  :where(.${CT_CONTENT_CLASS}[data-placement="top"]) {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }
  :where(.${CT_CONTENT_CLASS}[data-placement="top"]) .${CT_ARROW_CLASS} {
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 8px 6px 0 6px;
    border-color: ${cv.surface.default} transparent transparent transparent;
  }

  :where(.${CT_CONTENT_CLASS}[data-placement="bottom"]) {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }
  :where(.${CT_CONTENT_CLASS}[data-placement="bottom"]) .${CT_ARROW_CLASS} {
    bottom: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 0 6px 8px 6px;
    border-color: transparent transparent ${cv.surface.default} transparent;
  }

  :where(.${CT_CONTENT_CLASS}[data-placement="left"]) {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }
  :where(.${CT_CONTENT_CLASS}[data-placement="left"]) .${CT_ARROW_CLASS} {
    left: 100%;
    top: 50%;
    margin-top: -6px;
    border-width: 6px 0 6px 8px;
    border-color: transparent transparent transparent ${cv.surface.default};
  }

  :where(.${CT_CONTENT_CLASS}[data-placement="right"]) {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }
  :where(.${CT_CONTENT_CLASS}[data-placement="right"]) .${CT_ARROW_CLASS} {
    right: 100%;
    top: 50%;
    margin-top: -6px;
    border-width: 6px 8px 6px 0;
    border-color: transparent ${cv.surface.default} transparent transparent;
  }
`;
