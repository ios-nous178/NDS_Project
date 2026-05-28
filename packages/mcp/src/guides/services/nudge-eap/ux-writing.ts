import type { ServiceOverlay } from "../types.js";

/**
 * NudgeEAP UX Writing overlay.
 * Source: 기존 UX_WRITING_GUIDE 의 voiceTone 마지막 문장 + eapDomain 6개 (guides.ts:4068, 4129-4136).
 *
 * 멘탈케어/EAP 도메인 한정 룰. base UX_WRITING_GUIDE 는 brand-agnostic 토스 식 보이스톤만 유지.
 * (Trost 도 멘탈케어 brand 이므로 추후 category overlay 도입 시 이쪽으로 옮길 후보.)
 */
export const UxWritingOverlay: ServiceOverlay = {
  copyTone: {
    voiceToneAddendum:
      "(NudgeEAP/멘탈케어 추가) 사용자 평가 어휘와 의료 단정 표현에 추가 룰 적용 — base voiceTone 위에 아래 eapDomain 룰을 더 따른다.",
    eapDomain: [
      "위기·자해·자살 관련 표현은 사실 중심으로. 자극적 단어(`극단적 선택`, `~해버리다`) 금지. 위기 콜아웃은 직접적 안내(`24시간 정신건강 위기상담 1577-0199`)와 차분한 톤으로.",
      "평가 어휘 금지: `정상/비정상`, `심각/괜찮음`을 진단처럼 단정하지 않는다. `현재 점수가 OO 구간이에요` 처럼 구간/맥락으로 표현.",
      "의료 행위 단정 금지: `진단`, `처방`, `치료` 같은 용어는 실제 의료진의 행위에만 사용. 자가검사·자기관리 컨텍스트에서는 `자가검사`, `점검`, `관리` 로 표현.",
      "사용자 동의 기반 표현: `~하셔야 합니다` 대신 `~할까요?` / `원하시면 ~할 수 있어요`. 강요·재촉 어휘(`반드시`, `당장`) 금지.",
      "익명성·프라이버시 안내는 명시적으로. `회사에 공유되지 않아요`, `이름을 입력하지 않아도 돼요` 처럼 사용자가 안심할 수 있는 문장을 우선 노출.",
      "검사 결과 라벨은 임상 진단처럼 들리지 않게: `위험군` 대신 `관심 필요`, `정상` 대신 `안정`. 검사 결과 상세에서는 점수·구간·해석을 한 묶음으로.",
    ],
  },
};
