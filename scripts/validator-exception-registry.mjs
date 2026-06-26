// 예외(waiver) 레지스트리 — 공통 UX 문서의 "예외 케이스"를 데이터로 선언한다 (SSOT, 1차 패스).
//
// 목적: "예외에 해당하지 않으면 차단" 을 AI·사람·validator 가 **같은 선언을 읽고** 판단하게 한다.
//   PRINCIPLE_MAP(scripts/validator-principle-map.mjs) 의 각 룰이 참조하는 exception id 를 여기서 정의.
//   드리프트(맵이 참조하는 id ≠ 레지스트리 키)는 validator-rule-report.mjs --check 가 차단.
//
// ── 핵심 축: evaluation(평가 종류) — 이게 "차단 승격이 안전한가" 를 결정한다 ──────────────
//   auto            검출 신호로 validator 가 마크업에서 자동 판정 → 차단 안전(자동 면제)
//   structural      선언된 컨텍스트(surface 마커)·카탈로그 조회로 판정 → 차단 안전
//   policy          프로젝트 프로필(브랜드 정책)로 판정 → 차단 안전
//   explicit-waiver 코드가 의도를 못 가림 → 사람/AI 가 사유 달아 명시 → 차단 시 마찰(waiver 필요)
//
// ── explicit-waiver 토큰 규약 (// allow-native 의 일반화) ────────────────────────────────
//   HTML 목업: 위반 요소(또는 가장 가까운 조상)에
//     data-nudge-allow="<exception-id> — <사유>"
//     예) <div class="card" data-nudge-allow="ux:p2-card-justified — 독립 요약 카드">
//   validator 는 em-dash(—) 앞을 id 로 파싱, 뒤를 사유로 기록. id 가 이 레지스트리에 없거나
//   해당 룰의 appliesTo 에 없으면 무효 waiver 로 보고 차단 유지. (런타임 흡수는 ③ 승격 단계에서 배선)
//
// fields:
//   principle  관련 UX 원칙
//   title      짧은 이름
//   appliesTo  이 예외가 면제하는 룰 id (PRINCIPLE_MAP 의 exception 과 1:1 역참조)
//   policy     허용 조건 서술 — 공통 UX 문서 기준. AI·사람이 "예외인가" 판단하는 본문.
//   evaluation auto | structural | policy | explicit-waiver
//   detect     auto/structural/policy 일 때 validator 가 보는 신호. explicit-waiver 면 토큰 예시.

/** @type {Record<string, { principle: "1"|"2"|"3"|"4"|"5", title: string, appliesTo: string[], policy: string, evaluation: "auto"|"structural"|"policy"|"explicit-waiver", detect: string }>} */
export const EXCEPTION_REGISTRY = {
  "ux:p2-multi-judgment-unit": {
    principle: "2",
    title: "복수 판단 단위",
    appliesTo: ["primary-cta-overuse", "primary-cta-per-container", "card-footer-button-overuse"],
    policy:
      "Primary 1개 제한은 '같은 판단 단위' 안에서만 따진다. 판단 단위 = 화면 · 모달 등 별도 레이어 · 반복 구조의 카드·행 · 목적이 다른 독립 섹션. 단위가 여럿이면 한 화면에 Primary 가 여러 개 보일 수 있고 정당하다. 한 단위 안에서 2개 이상 경쟁할 때만 위반.",
    evaluation: "auto",
    detect:
      "Primary 를 화면 전체가 아니라 판단-단위 경계별로 카운트. 단위 경계 = nds-modal/오버레이, 반복 카드·행 컨테이너, heading 으로 분리된 독립 섹션. (primary-cta-per-container 가 이미 컨테이너 스코프 — 이 축의 모범. primary-cta-overuse=화면 전역 카운트라 과검출 → 승격 대신 per-container 로 수렴 권장)",
  },
  "ux:p2-card-justified": {
    principle: "2",
    title: "정당한 카드",
    appliesTo: ["card-everything", "nested-card"],
    policy:
      "카드는 독립 정보 묶음·액션·요약·공지에만 쓴다. 단순 구분은 간격(spacing). 위 목적의 카드면 정당하며 위반 아님 — '단순 구분용 카드 남용'만 위반.",
    evaluation: "explicit-waiver",
    detect:
      'data-nudge-allow="ux:p2-card-justified — <사유>" (코드만으론 "독립 묶음인지" 판별 불가 → 명시). 예: 요약 카드·공지 카드.',
  },
  "ux:p2-real-float": {
    principle: "2",
    title: "실제로 떠 있는 요소",
    appliesTo: ["decorative-shadow"],
    policy:
      "그림자·elevation 은 실제로 떠 있어야 하는 요소에만 — 오버레이·드롭다운·팝오버·모달·toast/snackbar. 평면 카드·섹션에 장식 그림자 ❌.",
    evaluation: "auto",
    detect:
      "그림자 부여 요소가 알려진 floating 컴포넌트(nds-modal/popup/tooltip/snackbar/dropdown/select 팝오버 등)이거나 position:fixed/absolute 오버레이면 면제.",
  },
  "ux:p2-independent-section": {
    principle: "2",
    title: "독립 섹션 반복",
    appliesTo: ["repeated-h2"],
    policy:
      "목적이 다른 독립 섹션이 여럿이면 같은 레벨 heading(h2) 반복은 정당하다. 같은 섹션 안 중복 h2 만 위반.",
    evaluation: "auto",
    detect:
      "h2 들이 서로 다른 독립 섹션(section/독립 컨테이너) 경계에 속하면 면제. 한 컨테이너 안 중복만 위반. (경계 추정 노이즈 커서 차단 비권장 — hold)",
  },
  "ux:p5-no-ds-component": {
    principle: "5",
    title: "DS 에 컴포넌트 없음",
    appliesTo: ["avoidable-reinvention"],
    policy:
      "DS 에 해당 역할의 컴포넌트가 아직 없으면 직접 구현(재발명)은 정당하다. DS 에 있는데 재발명한 경우만 위반 — 없는 컴포넌트는 추가 대상.",
    evaluation: "structural",
    detect:
      "재발명 의심 역할(파일업로드·페이지네이션·스텝퍼·검색 등)에 대응하는 DS 컴포넌트가 catalog 에 존재하는지 조회 → 존재하면 위반, 없으면 면제.",
  },
  "ux:surface-declared": {
    principle: "5",
    title: "선언된 표면",
    appliesTo: ["service-surface-admin-shell"],
    policy:
      "표면(admin/service) 불일치는 화면 제목이 아니라 선언된 surface(brief/CLAUDE.md + nudge.surface 마커) 기준으로 판단. 선언과 셸이 일치하면 면제.",
    evaluation: "structural",
    detect: "nudge.surface 마커/brief 선언을 읽어 실제 셸과 대조. 선언 일치 시 면제.",
  },
  "ux:p5-brand-cta-policy": {
    principle: "5",
    title: "브랜드 CTA 정책",
    appliesTo: ["neutral-solid-cta", "project-denied-button-color"],
    policy:
      "검정 solid CTA 의 허용/금지는 프로젝트별로 다르다 — 캐포비=neutral 검정 CTA 정상, 타 브랜드=금지일 수 있음. 프로젝트 정책에 부합하면 면제.",
    evaluation: "policy",
    detect:
      "프로젝트 프로필의 CTA color 정책(allow/denylist)으로 판정. (project-denied-button-color 가 이미 프로필 denylist 참조 — 이 축의 모범)",
  },
  "ux:p5-modal-policy": {
    principle: "5",
    title: "프로젝트 모달 정책",
    appliesTo: [
      "project-modal-footer-stacked",
      "project-modal-footer-button-shape",
      "project-modal-single-button-fullwidth",
    ],
    policy:
      "모달 푸터의 배치·버튼 형태는 프로젝트 모달 정책을 따른다 — 캐포비=가로 hug pill, 단일버튼 우측 hug(full-width 금지). 정책에 부합하면 면제.",
    evaluation: "policy",
    detect: "프로젝트 프로필의 modal footer 규약(정렬·shape·width)으로 판정.",
  },
  "ux:p5-brand-form-policy": {
    principle: "5",
    title: "브랜드 폼 컨트롤 규약",
    appliesTo: ["cashwalk-biz-gender-selection-control"],
    policy:
      "프로젝트 전용 폼 컨트롤 규약 — 캐포비 성별 타겟팅=SelectionButtonGroup(전체/특정)+selection chip. 규약대로면 면제.",
    evaluation: "policy",
    detect: "프로젝트 프로필의 폼 컨트롤 규약으로 판정.",
  },
  "ux:p5-selection-pattern": {
    principle: "5",
    title: "선택 패턴 규모",
    appliesTo: ["selected-items-modal-missing-panel"],
    policy:
      "대형 다중 선택 모달은 우측 SelectedItemsPanel 동반이 정석이나, 소규모 단일/경량 선택은 패널 없이 정당하다.",
    evaluation: "explicit-waiver",
    detect:
      'data-nudge-allow="ux:p5-selection-pattern — <사유>" (선택 규모/방식은 의도라 명시). 자동화하려면 선택 항목 수·다중여부 임계 필요.',
  },
  "ux:p4-inline-compose": {
    principle: "4",
    title: "불가피한 인라인 합성",
    appliesTo: ["verification-manual-assembly"],
    policy:
      "인증코드 입력의 남은시간 타이머 등 앱 도메인 합성이 불가피한 인라인은 허용. 컴포넌트로 대체 가능한 손조립만 위반.",
    evaluation: "explicit-waiver",
    detect: 'data-nudge-allow="ux:p4-inline-compose — <사유>" (타이머 등 앱 합성 사유 명시).',
  },
};
