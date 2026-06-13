/* 입력류 공용 헬퍼텍스트 — Input·Textarea·Select·FormField 가 각자 그리던
 * 헬퍼/에러 텍스트(+ 캐포비 에러 아이콘 ::before)의 SSOT. 각 컴포넌트는 자기 헬퍼
 * element 에 `nds-helper-text` 클래스를 부여하고, 폰트·색·아이콘·캐포비 ::before 는
 * 전부 이 파일이 소유한다(컴포넌트 styles 는 footer flex 등 레이아웃 통합만 남김).
 *
 * extract-styles 는 src/*.ts 를 알파벳순으로 concat 한다(파일 간 import 불가) →
 * 이 파일은 토큰만 의존하는 self-contained 모듈. concat 위치: FormField < HelperText
 * < Input < Select < Textarea. 색 규칙이 0-specificity(:where) 라 source order 가
 * 걸리는 곳은 FormField admin density override 한 곳뿐 — 거기서 specificity 를 줘 해결.
 *
 * 에러 신호는 두 마크업을 모두 받는다: Input(react)=`data-variant="error"`(success/disabled
 * variant 도 표현) · Textarea/Select/FormField(+html nds-input)=`data-error="true"`. */
import { cv, fontWeight, spacing, typeScale } from "@nudge-design/tokens";

const HELPER_TEXT_CLASS = "nds-helper-text";

export const helperTextStyles = `
  /* Helper text — Figma Section_Input(294:12) Input/HelperText/* 토큰.
   *   default  = Input/HelperText/Default  (nudge #999 · capo #666)
   *   success  = Input/HelperText/Success  (폼 검증 통과 — brand 톤, 일반 success 녹색과 구분)
   *   error    = Input/HelperText/Error    (nudge #F13F00 · capo #FC3500)
   *   disabled = Input/HelperText/Disabled
   * 폰트는 caption2(12/16) 로 4종 통일(2026-06-13 결정). */
  :where(.${HELPER_TEXT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    /* 헬퍼 element 가 <p> 여도 UA margin(1em) 이 새지 않게 — 간격은 부모 레이아웃(root gap / margin-top)이 소유 */
    margin: 0;
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.input.helpertextDefault};
  }

  :where(.${HELPER_TEXT_CLASS}[data-variant="error"]),
  :where(.${HELPER_TEXT_CLASS}[data-error="true"]) {
    color: ${cv.input.helpertextError};
  }

  :where(.${HELPER_TEXT_CLASS}[data-variant="success"]) {
    color: ${cv.input.helpertextSuccess};
  }

  :where(.${HELPER_TEXT_CLASS}[data-variant="disabled"]) {
    color: ${cv.input.helpertextDisabled};
  }

  /* Helper icon 은 부모 helper 의 color 를 currentColor 로 상속 — variant 색을 자동 따라간다. */
  :where(.${HELPER_TEXT_CLASS}__icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: inherit;
  }

  :where(.${HELPER_TEXT_CLASS}__icon svg) {
    width: 16px;
    height: 16px;
  }

  /* 캐포비(cashwalk-biz) admin 전용 — 에러 헬퍼 앞 빨간 경고 아이콘(Figma 04ic/report/red).
   * 구 Input/Textarea/Select/FormField 4벌 → 여기 1벌로 통합. 다른 브랜드 미노출. */
  [data-brand="cashwalk-biz"] :where(.${HELPER_TEXT_CLASS}[data-variant="error"]),
  [data-brand="cashwalk-biz"] :where(.${HELPER_TEXT_CLASS}[data-error="true"]) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }
  [data-brand="cashwalk-biz"] :where(.${HELPER_TEXT_CLASS}[data-variant="error"])::before,
  [data-brand="cashwalk-biz"] :where(.${HELPER_TEXT_CLASS}[data-error="true"])::before {
    content: "";
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
  }
`;
