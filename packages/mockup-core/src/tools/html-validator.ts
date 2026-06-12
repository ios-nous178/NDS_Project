/**
 * validate_html_mockup — HTML 입력 (mockup HTML 또는 .tsx 의 build:html 산출물)을
 * 검사하는 도구. mockup-validator.ts 의 format-agnostic 룰을 cheerio 로 적용 +
 * nds-* dialect 인식.
 *
 * 검출 룰:
 * 검출 룰 (format-agnostic — 토큰 / 색상 / 스페이싱):
 *  - inline-color         : style="" 의 hex / rgb (var(--..) 없을 때)
 *  - inline-spacing       : style="" 의 px/rem (transform 류 제외)
 *  - non-4pt-spacing      : 4 의 배수 아닌 px 값
 *  - non-semantic-spacing : style 의 padding/margin/gap 이 var(--spacing-*) 직접 사용
 *  - nds-host-box-style   : <nds-*> 호스트(display:contents)에 직접 준 box 스타일(margin/padding/width/flex…) — 드롭됨, wrapper/부모 gap 으로
 *  - gradient-banned      : linear/radial/conic-gradient
 *  - emoji-banned         : 이모지 텍스트
 *  - text-symbol-banned   : → ✓ ★ • 같은 기호 텍스트
 *  - inline-svg           : <svg> (DS 아이콘 화이트리스트와 대조)
 *  - native-interactive   : <button>/<input>/<select> 가 nds-* 클래스/태그 없이 사용됨
 *  - raw-landmark         : sidebar/footer/header 를 raw landmark 로 구현했지만 nds-* 대체재가 있음
 *  - manual-brand-header  : 브랜드 화면(data-brand/nds-brand-*)인데 base nds-header 에 로고/메뉴/auth 손수 조립
 *  - non-inlinable-img-src: 단일 파일 빌드에 inline 안 되는 로컬 이미지 경로 (src/srcset)
 *  - text-icon-substitute : x/× 같은 텍스트를 아이콘 대체로 사용
 *  - unknown-token        : var(--xxx) 의 --xxx 가 카탈로그에 없음
 *  - unknown-nds-tag      : <nds-foo> 가 카탈로그(@nudge-design/html) 에 없는 태그
 *  - unknown-nds-class    : class="nds-foo" 가 React DS stylesheet 에 없는 클래스
 *  - invalid-nds-attr-value : nds-* attribute enum 위반
 *  - button-without-interaction : 활성 버튼에 click/submit 동작 연결 근거가 없음
 *  - cashwalk-biz-gender-selection-control : 캐포비 admin 성별 타겟팅을 SelectionButtonGroup + selection chip 이 아닌 입력 컴포넌트로 구현
 *  - raw-shell-pattern    : <style> 안 raw .page / .topbar / .section / .form-row 정의 (admin-shell 가이드 위반)
 *
 * 검출 룰 (JSX 에서 포팅 — 컨테이너 / 카운팅 / 시각 위계):
 *  - card-slot-double-padding   : <nds-card-header|body|footer> 에 외곽 padding
 *  - neutral-solid-cta        : <nds-button color="neutral"> 가 solid (variant 미지정, 캐포비 제외)
 *  - brand-denied-button-color: 캐포비 <nds-button color="secondary"> — 캐포비엔 secondary tone 없음(neutral 사용)
 *  - heading-decorative-icon    : <h3>/<h4> 안에 <svg> / icon 들어감
 *  - nested-card                : <nds-card> 안에 <nds-card>
 *  - card-badge-overuse         : 1 nds-card 안 nds-chip + nds-badge ≥ 3
 *  - card-footer-button-overuse : nds-card-footer 안 nds-button ≥ 3
 *  - primary-cta-per-container  : 영역 1개 안 primary solid nds-button > 1
 *  - brand-modal-single-button-fullwidth : 캐포비 모달 단일 footer 버튼이 full-width (우측 hug 여야 함)
 *  - brand-modal-confirm-cta : 캐포비 확인/팝업 모달 footer 주 action 이 primary(노랑)/색생략 (검정 neutral 이어야 함)
 *  - brand-modal-footer-stacked : 모달 footer 두 버튼 세로 스택 (가로 유지 + 라벨 축약)
 *  - primary-cta-overuse        : 페이지 레벨 primary solid nds-button > 1
 *  - chip-overuse               : nds-chip > 8
 *  - card-everything            : nds-card ≥ 5
 *  - repeated-h1                : <h1> ≥ 2
 *  - repeated-h2                : <h2> ≥ 4
 *  - bold-overuse               : inline font-weight bold/700+ ≥ 5
 *  - brand-bg-overuse           : --semantic-bg-brand-* 사용 ≥ 2
 *  - decorative-shadow          : inline box-shadow (focus ring 제외) ≥ 4
 *  - tone-on-tone-filled        : 연한 primary bg + filled/soft chip/badge
 *  - visual-emphasis-overload   : gradient / chip / badge / brand-bg / icon 동시 ≥ 4
 *  - primary-color-role-overload: primary 계열 색상이 여러 역할로 과다 사용
 *
 * 의도적으로 포팅하지 않은 JSX 룰:
 *  - antd-import / mixed-icon-style / unknown-react-export — HTML 에는 import 가 없다.
 *  - chip-missing-label / chip-decorative-use — HTML 의 <nds-chip> 은 children 텍스트라 label attr 검사 무의미.
 *  - icon-default-color / button-arrow-overuse — HTML 의 아이콘은 익명 <svg> 라 식별 불가.
 *
 * 구조: 이 파일은 오케스트레이터 + per-element 패스 — validateHtmlSource 의 거대 루프는 룰들이
 * 한 traversal 을 공유하는 성능 구조라 이 파일에 남긴다. 함수 단위로 분리된 룰 그룹
 * (document-level / container / selected-items)과 공유 타입/헬퍼는 validator-rules/ 에 있다.
 */

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import {
  canonicalBrandSlug,
  canonicalPagePattern,
  CASHWALK_BIZ_PAGE_PATTERNS,
  type CashwalkBizPagePattern,
  listStandaloneBrands,
} from "./standalone-assets.js";
import {
  type DomElement,
  type HtmlSurface,
  type HtmlViolation,
  type HtmlViolationSeverity,
  describeElement,
  lineNumberAt,
} from "./validator-rules/types.js";
import { collectContainerViolations } from "./validator-rules/container.js";
import { collectDocumentLevelViolations } from "./validator-rules/document-level.js";
import { collectSelectedItemsPanelViolations } from "./validator-rules/selected-items.js";

// 공유 타입은 validator-rules/types.ts 로 이동(순수 이동) — 기존 모듈 경로 호환을 위해 re-export.
export type {
  HtmlSurface,
  HtmlViolation,
  HtmlViolationSeverity,
} from "./validator-rules/types.js";

export interface HtmlValidationContext {
  tokenSet: Set<string>;
  ndsTagSet: Set<string>;
  ndsClassPrefixSet: Set<string>;
  /** 각 nds-* 의 attribute enum. tag → attrName → 허용값 배열. */
  ndsAttrEnums?: Map<string, Map<string, string[]>>;
}

const EMPTY: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set(),
  ndsClassPrefixSet: new Set(),
  ndsAttrEnums: new Map(),
};

let configured: HtmlValidationContext = EMPTY;
export function configureHtmlValidator(ctx: HtmlValidationContext) {
  configured = ctx;
}

/**
 * 룰별 기본 severity. push 시점에 명시되지 않은 violation 은 이 맵에서 채워진다.
 *
 *  error : DS 컨트랙트 위반. 디자이너/PM 이 산출물을 봤을 때 명백한 결함.
 *  warn  : 시각 위계 / 패턴 가이드 위반. 의도된 trade-off 일 수 있음.
 *  info  : 정보성 권고.
 *
 * raw-landmark 는 컨텍스트에 따라 (brand 변형 가용 vs 아님) 달라지므로 push 시점에 명시.
 */
/**
 * 룰 분류(kind) — 수명 정책의 입력. 분류는 1차 패스이며 재분류 환영.
 *
 *  invariant   : DS/목업 계약 위반 — 저작 주체(사람/AI)와 무관하게 항상 틀림.
 *                토큰·시멘틱·시각 위계·표면 계약·단일파일 규약. 폐기 대상 아님.
 *  model-guard : 특정 시점 AI 생성 실수 패턴 가드 — 환각(unknown-*)·손조립 재발명·
 *                인코딩 깨짐 등. 모델 세대가 바뀌면 히트가 0 으로 갈 수 있음 →
 *                텔레메트리(rule-stats) 기준 30일 히트 0 인 warn/info 룰은 폐기 후보
 *                (/ds-audit 가 리포트. error 룰은 "룰이 효과적이라 위반이 사라진" 경우와
 *                구분이 안 되므로 후보에서 제외).
 *  brand-policy: 특정 브랜드의 의미/정책 분기 — 브랜드 프로필(brand-profiles)이 발화를 결정.
 *
 * brand-policy 네이밍 컨벤션:
 *  - `brand-*`        : 프로필 데이터로 일반화된 정책 룰 — 어떤 브랜드든 같은 정책을 선언하면 발화.
 *  - `cashwalk-biz-*` : 캐포비 어드민 Page Pattern System 의 콘텐츠 룰(onboarding/sidebar/페이지 패턴
 *                       골격) — 패턴 내용 자체가 캐포비 어드민 DS 라 브랜드명 유지. 발화 게이트만
 *                       프로필(admin.pagePatternSystem)이 결정.
 *
 * 2026-06 룰 id 일반화(텔레메트리 조인 시 legacy 매핑):
 *  - cashwalk-biz-no-secondary                → brand-denied-button-color
 *  - cashwalk-biz-toast                       → brand-banned-notification
 *  - cashwalk-biz-modal-primary-cta           → brand-modal-confirm-cta
 *  - cashwalk-biz-modal-single-button-fullwidth → brand-modal-single-button-fullwidth
 *  - cashwalk-biz-modal-footer-stacked        → brand-modal-footer-stacked
 */
export type RuleKind = "invariant" | "model-guard" | "brand-policy";
export const RULE_META: Record<string, { severity: HtmlViolationSeverity; kind: RuleKind }> = {
  // contract / DS 미사용
  "native-interactive": { severity: "error", kind: "invariant" },
  // DS 반영도(dsRatio)가 최소선 미달 — "DS 반영"을 강제하는 집계 게이트(E1).
  "low-ds-ratio": { severity: "error", kind: "invariant" },
  "raw-landmark": { severity: "warn", kind: "invariant" },
  // 브랜드 화면인데 base nds-header 를 손수 조립 (회고: brand chrome 미사용 안티패턴)
  "manual-brand-header": { severity: "warn", kind: "model-guard" },
  // 선언 표면=admin 인데 소비자 brand chrome(header/footer/bottom-nav) 사용 (회고: 가입 admin 화면을 소비자 플로우로 오제작)
  "admin-surface-consumer-chrome": { severity: "error", kind: "invariant" },
  // 선언 표면=service 인데 어드민 사이드바(nds-sidebar) 사용 — 표면 불일치(역방향)
  "service-surface-admin-shell": { severity: "warn", kind: "invariant" },
  // 캐포비 어드민(surface=admin + brand=cashwalk-biz)인데 5종 Page Pattern 중 하나를 선언 안 함 / 미지 값
  "cashwalk-biz-admin-page-pattern": { severity: "error", kind: "brand-policy" },
  // 캐포비 어드민 onboarding 패턴인데 shell(사이드바/풀하이트 셸)이 있음 — 온보딩은 비로그인 진입 화면이라 shell 금지
  "cashwalk-biz-onboarding-no-shell": { severity: "error", kind: "brand-policy" },
  // 캐포비 어드민 onboarding 인데 중앙 카드+로고 골격이 안 보임 — 권고(레이아웃 계약 환기)
  "cashwalk-biz-onboarding-skeleton": { severity: "info", kind: "brand-policy" },
  // 온보딩 카드에 <nds-brand-logo> 컴포넌트가 없음 — raw img/svg 로고 조립 또는 누락(skeleton 의 빈틈 보완)
  "onboarding-missing-brand-logo": { severity: "warn", kind: "model-guard" },
  // 소셜 로그인을 텍스트/이니셜(G/K/N)로 때움 — sns-logos 자산 미사용
  "onboarding-social-bare-text": { severity: "warn", kind: "model-guard" },
  // 성공/완료 상태를 체크 없는 민무늬 초록 원으로 표현 — check-circle 아이콘 미사용
  "onboarding-success-plain-circle": { severity: "warn", kind: "model-guard" },
  // 온보딩 단일 액션 주 CTA(Primary solid)가 full-width 가 아님 — 모달 단일버튼(hug)과 혼동.
  // 단일 액션 온보딩은 카드 폭 가득(FILL)이 하드 계약 → error. (멀티스텝=이전버튼 있으면 면제)
  "onboarding-cta-not-fullwidth": { severity: "error", kind: "invariant" },
  // 멀티스텝 온보딩의 [이전 단계] 버튼이 카드 안에 있음 — 카드와 분리해 하단 푸터에 둬야 함.
  "onboarding-back-button-inside-card": { severity: "warn", kind: "invariant" },
  // 온보딩에 상단 GNB/글로벌 헤더(raw <header>/.topbar/nds-header 등) 부착 — 비로그인 진입 화면은
  // shell·GNB 없는 탈색 캔버스 중앙 카드. 브랜드 식별은 카드 안 <nds-brand-logo> 에셋만(텍스트 로고 금지).
  "cashwalk-biz-onboarding-no-gnb": { severity: "error", kind: "brand-policy" },
  // 온보딩 카드에 inset 패딩이 없어 컨텐츠/CTA 가 카드 모서리에 full-bleed 로 붙음 — 가이드 카드 padding 48 미적용.
  "onboarding-card-no-padding": { severity: "error", kind: "invariant" },
  // 멀티스텝 온보딩(Stepper 존재)인데 제출 CTA 가 카드 안에 있음 — 카드 *아래* 분리 footer-nav(hug)로 빼야 함.
  "onboarding-multistep-cta-inside-card": { severity: "error", kind: "invariant" },
  // 인증번호 입력/타이머를 손으로 조립 — verification-code-input + countdown-timer + field-action-row 미사용
  "verification-manual-assembly": { severity: "warn", kind: "model-guard" },
  // 약관 동의를 raw <input type=checkbox> 로 조립 — checkbox-group([필수]/[선택]·전체동의) 미사용
  "consent-raw-checkbox": { severity: "warn", kind: "model-guard" },
  // 캐포비 사이드바인데 로고 / 계정 블록(account slot) 누락 — 회귀 #1(로고+로그인영역 유실)
  "cashwalk-biz-sidebar-incomplete": { severity: "error", kind: "brand-policy" },
  // 캐포비 사이드바인데 로그아웃(footer-actions) 누락 — 권고
  "cashwalk-biz-sidebar-logout": { severity: "warn", kind: "brand-policy" },
  // 사이드바가 풀하이트 셸(.nds-shell) 밖 — 100vh 가 화면을 못 채움(회귀: 높이 안 참)
  "cashwalk-biz-sidebar-shell": { severity: "error", kind: "brand-policy" },
  // 캐포비 모달 단일 버튼은 우측 정렬 hug 검정 pill — full-width 금지(회귀: 퍼포멘토 등의 full-width 를 잘못 가져옴)
  "brand-modal-single-button-fullwidth": { severity: "warn", kind: "brand-policy" },
  // 캐포비 확인/팝업 모달 footer 의 주 action 이 primary(노랑) — 색 생략 시 Button 기본값이 primary 라
  // 자동으로 노랑이 됨. 캐포비 확인 모달 주 action = 검정 CTA(color="neutral"). 5회+ 재발한 회귀의 근본.
  "brand-modal-confirm-cta": { severity: "error", kind: "brand-policy" },
  // 모달 footer 의 두 버튼이 세로로 스택됨 — 라벨이 길어도 가로 유지 + 라벨 축약이 원칙(세로 금지).
  "brand-modal-footer-stacked": { severity: "warn", kind: "brand-policy" },
  // data-brand / brand-* 에 미지 slug → base(블루)로 조용히 폴백돼 색이 틀림 (회고: cashpobi)
  "unknown-brand-slug": { severity: "error", kind: "model-guard" },
  // 단일 파일 빌드에 inline 안 되는 로컬 이미지 경로 (회고: 내부/외부 모두 깨짐)
  "non-inlinable-img-src": { severity: "warn", kind: "invariant" },
  "unknown-nds-tag": { severity: "error", kind: "model-guard" },
  "unknown-nds-class": { severity: "error", kind: "model-guard" },
  "invalid-nds-attr-value": { severity: "error", kind: "model-guard" },
  // nds-* 의 JSON 속성(items/options/reward 등)이 파싱 불가 — 컴포넌트가 조용히 빈 값 렌더(메뉴 유실)
  "nds-json-attr-unparseable": { severity: "error", kind: "model-guard" },
  // UTF-8 한글을 Latin-1/unicode_escape 로 잘못 디코딩 → 모지바케(Ã/ë…). 깨진 JSON 도 파싱은 되므로
  // nds-json-attr-unparseable 로는 안 잡힘 (회귀: 사이드바 한글 전부 깨짐 + 로고 유실)
  "mojibake-encoding": { severity: "error", kind: "model-guard" },
  // 선택 결과(지역/카테고리/멤버 등)를 Chip 으로 인라인 표현 — SelectionButton 과 혼동 + 제거/개수
  // affordance 누락. SelectedItemsPanel + SelectedItemRow 로 그려야 함 (회귀: 캐포비 타겟팅 폼)
  "region-as-chip": { severity: "warn", kind: "model-guard" },
  // SelectedItemsPanel 바로 아래 helper 텍스트를 sibling 으로 붙이면 패널과 helper 가 붙어 보임.
  // FormField helper 슬롯/속성으로 넣어 control gap 을 타게 해야 함 (회귀: 캐포비 타겟팅 폼).
  "selected-items-helper-outside-form-field": { severity: "error", kind: "invariant" },
  // 목업 버튼은 장식이 아니라 실제 동작해야 함. 정적 검증에서는 버튼별 식별자와
  // addEventListener/click/submit 연결 근거를 확인한다.
  "button-without-interaction": { severity: "error", kind: "invariant" },
  // 날짜/기간을 raw text input(placeholder 'YYYY-MM-DD')으로 구현 — DatePicker/DateRangePicker 미사용
  "date-as-text-input": { severity: "warn", kind: "model-guard" },
  "address-as-text-input": { severity: "warn", kind: "model-guard" },
  // 금액/수량을 일반 input 으로 구현 — AmountInput(콤마·단위·clamp) 미사용
  "amount-as-text-input": { severity: "warn", kind: "model-guard" },
  // 입력 필드 자리에 정적 숫자(콤마+단위)를 박음 — 폼 값인데 AmountInput 이 아님(회귀: 캐포비 '목표 참여자 수')
  "amount-as-static-display": { severity: "warn", kind: "model-guard" },
  // div+role/onclick 로 특정 DS 컴포넌트(파일업로드·페이지네이션·스텝퍼·검색)를 재발명 — dsRatio 만으론
  //   90%대로 통과해 invisible 하던 사각지대를 named warn 으로 표면화(회귀: 캐포비 자작 페이저·스텝바).
  "avoidable-reinvention": { severity: "warn", kind: "model-guard" },
  // <script> 에서 nds-* 호스트의 textContent/innerText/innerHTML 직접 대입 — 컴포넌트 내부 렌더가
  //   통째로 지워져 빈 박스/깨진 버튼이 됨(회귀: nds-button 라벨을 textContent 로 갈아끼움).
  "nds-custom-element-content-mutation": { severity: "warn", kind: "model-guard" },
  // 캐포비 admin 성별 타겟팅은 SelectionButtonGroup(전체/특정) + selection chip 묶음으로 고정.
  "cashwalk-biz-gender-selection-control": { severity: "warn", kind: "brand-policy" },
  // 선택 결과 add 어포던스 중복(외부 추가 + 패널 '추가 선택') — 모달 1개로 통일해야 함.
  // 가이드(SelectedItemsPanel 3641)가 "검증룰이 막음"이라 명시한 회귀이고, 현장에서 재발("또 두개
  // 노출")했으므로 warn→error 로 승격해 빌드 게이트가 실제로 막게 함.
  "selected-item-add-affordance-duplicated": { severity: "error", kind: "invariant" },
  // SelectedItemsPanel 안에 같은 선택 항목이 중복 — 선택 결과는 유니크해야 함
  "selected-item-row-duplicated": { severity: "warn", kind: "invariant" },
  // nds-selected-item-row / nds-region-row 가 nds-selected-items-panel 밖에 sibling 으로 떨어짐 — 패널 body 의 gap(8)을
  // 못 타서 행끼리 간격 없이 붙고 회색 패널 밖에 렌더된다(회귀: 캐포비 타겟팅 추가 후 누적분이
  // 패널 밖으로 샘). 갱신은 패널 body 안 자식만 교체해야 함.
  "selected-item-row-outside-panel": { severity: "warn", kind: "invariant" },
  // 선택 모달(시/도+시/군/구)인데 우측 SelectedItemsPanel 이 빠짐 — 단순 2컬럼 팝오버로 떴음.
  // 정답은 대형 2단 모달(좌 검색+체크박스 트리 / 우 SelectedItemsPanel hide-add + 풀폭 '적용').
  "selected-items-modal-missing-panel": { severity: "warn", kind: "invariant" },
  "unknown-token": { severity: "error", kind: "model-guard" },
  "ds-badge-missing": { severity: "error", kind: "invariant" },
  // 토큰 / 시멘틱
  "inline-color": { severity: "error", kind: "invariant" },
  "inline-spacing": { severity: "warn", kind: "invariant" },
  "non-4pt-spacing": { severity: "warn", kind: "invariant" },
  "non-semantic-spacing": { severity: "warn", kind: "invariant" },
  // nds-* 호스트(display:contents)에 직접 준 box 스타일 — 브라우저가 드롭(딱 붙음/여백 사라짐 근본원인)
  "nds-host-box-style": { severity: "warn", kind: "invariant" },
  // 금지 패턴
  "gradient-banned": { severity: "error", kind: "invariant" },
  "emoji-banned": { severity: "error", kind: "invariant" },
  "text-symbol-banned": { severity: "error", kind: "invariant" },
  "text-icon-substitute": { severity: "error", kind: "invariant" },
  // 아이콘 / 시각
  // inline-svg = info(권고). find_icon 이 HTML 용으로 내려주는 DS 아이콘 인라인은 불가피한
  // 정상 패턴이라 게이트 점수를 깎으면 안 됨(warn=8 → info=3). standalone <svg> 권고로만 노출.
  "inline-svg": { severity: "info", kind: "invariant" },
  "heading-decorative-icon": { severity: "warn", kind: "invariant" },
  // 컨테이너 / 카운팅
  "card-slot-double-padding": { severity: "warn", kind: "invariant" },
  "neutral-solid-cta": { severity: "warn", kind: "brand-policy" },
  "brand-denied-button-color": { severity: "warn", kind: "brand-policy" },
  // 캐포비 알림 SSOT 는 Snackbar(흰 카드·우측 상단·상태 칩·닫기 X). Toast 는 캐포비에서 미사용 — 전면 금지.
  "brand-banned-notification": { severity: "error", kind: "brand-policy" },
  "nested-card": { severity: "warn", kind: "invariant" },
  "card-badge-overuse": { severity: "warn", kind: "invariant" },
  "card-footer-button-overuse": { severity: "warn", kind: "invariant" },
  "primary-cta-per-container": { severity: "warn", kind: "invariant" },
  "primary-cta-overuse": { severity: "warn", kind: "invariant" },
  "chip-overuse": { severity: "warn", kind: "invariant" },
  "card-everything": { severity: "warn", kind: "invariant" },
  "repeated-h1": { severity: "error", kind: "invariant" },
  "repeated-h2": { severity: "warn", kind: "invariant" },
  "bold-overuse": { severity: "warn", kind: "invariant" },
  "brand-bg-overuse": { severity: "warn", kind: "invariant" },
  "decorative-shadow": { severity: "warn", kind: "invariant" },
  "tone-on-tone-filled": { severity: "warn", kind: "invariant" },
  "visual-emphasis-overload": { severity: "warn", kind: "invariant" },
  "primary-color-role-overload": { severity: "warn", kind: "invariant" },
  // admin-shell 강제 (pattern:admin-shell)
  "raw-shell-pattern": { severity: "error", kind: "model-guard" },
};
/** 룰별 기본 severity — RULE_META 에서 파생(기존 소비처 호환). */
const RULE_SEVERITY: Record<string, HtmlViolationSeverity> = Object.fromEntries(
  Object.entries(RULE_META).map(([rule, meta]) => [rule, meta.severity]),
);

/**
 * raw-shell-pattern detector — <style> 안 layout primitive 재정의 감지.
 * mock-test 류 어드민 페이지마다 200-600 줄 .page/.topbar/.section/.form-row CSS 를
 * 매번 손으로 쓰는 패턴을 차단. @nudge-design/styles 의 nds-shell / nds-section /
 * nds-form-row 클래스로 교체해야 함. 가이드: get_guide({ topic: 'pattern:admin-shell' }).
 *
 * 매칭 전략 — 흔한 선택자 이름 + 시그니처 CSS 속성 조합으로만 잡음 (false positive 회피):
 *   .page/.shell/.layout + display: grid + 1fr + 3자리 px        → nds-shell
 *   .topbar/.app-bar/.header-bar + position: sticky + top: 0      → nds-shell__topbar
 *   .section/.panel/.surface-card + background + border + radius  → nds-section
 *   .form-row/.field-row + display: grid + 1fr                    → nds-form-row
 *
 * 선택자에 nds- prefix 가 있으면 제외 (DS 클래스 본인 정의는 패스).
 */
const RAW_SHELL_PATTERNS: Array<{
  name: string;
  selectorRe: RegExp;
  requireAll: RegExp[];
  ndsClass: string;
}> = [
  {
    name: "page shell (sidebar + main grid)",
    selectorRe: /\.(?:page|shell|app-shell|app-root|layout)\b(?![-_\w])[^{,]*\{([^}]+)\}/gi,
    requireAll: [/display\s*:\s*grid/i, /grid-template-columns/i, /\b1fr\b/, /\b\d{3}px\b/],
    ndsClass: 'class="nds-shell"',
  },
  {
    name: "sticky topbar",
    selectorRe: /\.(?:topbar|top-bar|app-bar|header-bar|app-header)\b(?![-_\w])[^{,]*\{([^}]+)\}/gi,
    requireAll: [/position\s*:\s*sticky/i, /top\s*:\s*0/i],
    ndsClass: 'class="nds-shell__topbar"',
  },
  {
    name: "section card (white surface + border + radius)",
    selectorRe: /\.(?:section|panel|surface-card|card-box|box-card)\b(?![-_\w])[^{,]*\{([^}]+)\}/gi,
    requireAll: [/background\s*:/i, /border\s*:\s*1px/i, /border-radius/i],
    ndsClass: 'class="nds-section"',
  },
  {
    name: "form row (label + control grid)",
    selectorRe: /\.(?:form-row|field-row|label-row)\b(?![-_\w])[^{,]*\{([^}]+)\}/gi,
    requireAll: [/display\s*:\s*grid/i, /grid-template-columns/i, /\b1fr\b/],
    ndsClass: 'class="nds-form-row"',
  },
];

function severityFor(rule: string): HtmlViolationSeverity {
  return RULE_SEVERITY[rule] ?? "warn";
}

/**
 * "회피가능 재발명" 판정 — 인터랙티브 의도를 명시했는데 DS 컴포넌트가 **아닌** 요소.
 * DS 에 대체재가 있는데 raw 마크업으로 그린 avoidable 미스다(forced 와 구분되는 개념).
 *
 * native <button>/<input>/<select>/<textarea> 는 별도(native-interactive)로 집계하므로 여기선 제외하고,
 *  (a) raw landmark <header>/<footer>/<aside>  — nds-brand-header/footer/sidebar 대체재 존재
 *  (b) 인터랙티브 ARIA role 을 선언한 div/span  — role="button|tab|checkbox…" = 컨트롤 재발명
 *  (c) onclick 핸들러가 달린 div/span           — 버튼 재발명(DS 는 addEventListener+nds-button 권장)
 * 만 잡는다. role/onclick 은 작성자가 인터랙션 의도를 명시한 강한 신호라 오탐이 낮다.
 *
 * countHtmlUsage(스탬프·usage 리포트 비율)와 low-ds-ratio 게이트가 **같은 판정**을 쓰도록 공유한다
 * (두 비율 계산기가 어긋나는 드리프트 방지 — 이 레포의 SSOT 패턴). admin-shell 이 처방하는 셸 chrome
 * (<header class="nds-shell__topbar"> 등)은 raw landmark 가 정답이므로 제외한다.
 *
 * 호출부 책임: nds-* 태그/클래스로 이미 채택 집계된 요소, nds-* 래퍼 내부 요소는 넘기기 전에 걸러야 한다.
 */
const RAW_LANDMARK_TAGS = new Set(["header", "footer", "aside"]);
const INTERACTIVE_ARIA_ROLES = new Set([
  "button",
  "tab",
  "tablist",
  "checkbox",
  "radio",
  "switch",
  "menuitem",
  "combobox",
  "slider",
  "dialog",
]);
export function avoidableReinventionKind(
  tag: string,
  attrs: Record<string, string>,
): "landmark" | "role-widget" | null {
  // admin-shell 처방 chrome 은 raw landmark 가 정답 → 제외
  if (/\bnds-shell__/.test(attrs.class ?? "")) return null;
  if (RAW_LANDMARK_TAGS.has(tag)) return "landmark";
  if (tag === "div" || tag === "span") {
    const role = (attrs.role ?? "").toLowerCase();
    if (role && INTERACTIVE_ARIA_ROLES.has(role)) return "role-widget";
    if (attrs.onclick) return "role-widget";
  }
  return null;
}

/**
 * role-widget 재발명(div/span + role/onclick)이 특정 DS 컴포넌트를 흉내 낸 것인지 시그니처로 판정.
 * 매칭되면 named warn(avoidable-reinvention)으로 "무엇을" 재발명했는지 알린다. dsRatio 게이트와 무관.
 * 오탐을 줄이려고 구체 시그니처(페이지 번호+이전/다음, Step N, 파일/이미지 업로드 문구, role=search)만 잡는다.
 */
function reinventedComponentHint(
  attrs: Record<string, string>,
  text: string,
): { component: string; tag: string; guide: string } | null {
  const t = text.replace(/\s+/g, " ").trim();
  const role = (attrs.role ?? "").toLowerCase();
  // pagination: 페이지 번호 나열(1 2 3 / 123) + 이전/다음(또는 ‹ › « »)
  //   span 분리 마크업이면 $(el).text() 가 "‹123›" 로 붙으므로 자릿수 사이 구분자는 \D{0,3} 로 허용.
  if (/(이전|다음|prev|next|‹|›|◀|▶|«|»)/i.test(t) && /1\D{0,3}2\D{0,3}3/.test(t)) {
    return { component: "Pagination", tag: "nds-pagination", guide: "component:Pagination" };
  }
  // stepper: Step N / N단계 / 1—2—3 진행 표시
  if (/step\s*\d/i.test(t) || /\d\s*단계/.test(t) || /1\s*[—–\-·>]\s*2\s*[—–\-·>]\s*3/.test(t)) {
    return { component: "Stepper", tag: "nds-stepper", guide: "component:Stepper" };
  }
  // file/image upload: 파일/이미지 첨부·업로드·드래그
  if (/(파일\s*(첨부|선택|업로드)|이미지\s*(첨부|추가|업로드)|드래그|drag\s*&?\s*drop)/i.test(t)) {
    return /(이미지|image|사진)/i.test(t)
      ? { component: "ImageUpload", tag: "nds-image-upload", guide: "component:ImageUpload" }
      : { component: "FileUpload", tag: "nds-file-upload", guide: "component:FileUpload" };
  }
  // search: 검색 입력을 role=search/searchbox 위젯으로 (raw <input> 재발명은 native-interactive 가 잡음)
  if (role === "search" || role === "searchbox") {
    return { component: "SearchInput", tag: "nds-search-input", guide: "component:SearchInput" };
  }
  return null;
}

// E1 low-ds-ratio 게이트 파라미터.
//   MIN_ELIGIBLE: DS 대상(nds 채택 + native 미교체) 요소가 이 수 미만이면 단순 화면으로 보고 면제 —
//   폼 1개짜리 화면이 억울하게 막히지 않도록 한다. FLOOR: DS 반영 최소 비율(%).
const LOW_DS_MIN_ELIGIBLE = 4;
const LOW_DS_FLOOR = 50;

const STRICT_SYMBOL_RE = /[→←↑↓↔↕➜➔⮕›‹»«▶◀▲▼◆◇✓✗✘✕☑☒★☆⭐♥♡❤•]/;
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;

/** 소스의 모든 <style> 블록 텍스트를 이어붙여 반환 (클래스/id 단위 padding 해석용). */
function collectStyleText(source: string): string {
  const re = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) out += `\n${m[1]}`;
  return out;
}

const PADDING_DECL_RE =
  /padding(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?\s*:\s*([^;{}]+)/gi;

/** CSS 조각 안에 0 이 아닌 padding 선언이 하나라도 있는지. var(--*) 는 값 있음으로 인정. */
function hasNonZeroPadding(cssChunk: string): boolean {
  if (!cssChunk) return false;
  PADDING_DECL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = PADDING_DECL_RE.exec(cssChunk))) {
    const val = m[1].trim();
    if (/var\(\s*--/.test(val)) return true; // 시멘틱 inset 토큰 등
    // "0" / "0px 0px" 류는 zero — 0 과 단위를 지운 뒤 1-9 가 남으면 실제 padding 있음.
    if (/[1-9]/.test(val.replace(/0(?:px|rem|em|%|vh|vw|pt)?/gi, ""))) return true;
  }
  return false;
}

function escapeForSelectorRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 카드형 요소가 inset 패딩(인라인 또는 <style> 클래스/id 규칙)을 갖는지. nds-card 는 padding 내장 → true. */
function elementHasInsetPadding(source: string, el: DomElement): boolean {
  const tag = (el.tagName ?? "").toLowerCase();
  if (tag === "nds-card") return true; // DS 카드가 패딩을 굽는다
  const attribs = el.attribs ?? {};
  if (hasNonZeroPadding(attribs.style ?? "")) return true;
  const styleText = collectStyleText(source);
  if (!styleText) return false;
  const tokens = [
    ...(attribs.class ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((c) => `\\.${escapeForSelectorRe(c)}`),
    ...(attribs.id ? [`#${escapeForSelectorRe(attribs.id)}`] : []),
  ];
  for (const tk of tokens) {
    const re = new RegExp(`${tk}\\b[^{}]*\\{([^}]*)\\}`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(styleText))) {
      if (hasNonZeroPadding(m[1])) return true;
    }
  }
  return false;
}

const CARDISH_CLASS_RE = /\b(?:card|section|panel|box|surface|sheet)\b/;
/** el 의 가장 가까운 카드형 조상(nds-card / card-ish 클래스 / 흰 배경+radius 인라인). 없으면 null. */
function nearestCardAncestor($: cheerio.CheerioAPI, el: DomElement): DomElement | null {
  for (const p of $(el as unknown as never)
    .parents()
    .toArray()) {
    const pe = p as unknown as DomElement;
    const ptag = (pe.tagName ?? "").toLowerCase();
    if (ptag === "body" || ptag === "html" || !ptag) break;
    if (ptag === "nds-card") return pe;
    const cls = (pe.attribs?.class ?? "").toLowerCase();
    if (CARDISH_CLASS_RE.test(cls)) return pe;
    const style = (pe.attribs?.style ?? "").toLowerCase();
    if (/background(?:-color)?\s*:/.test(style) && /border-radius/.test(style)) return pe;
  }
  return null;
}

/**
 * 단일 HTML 빌드(build_singlefile_html)에 살아남지 못하는 로컬 이미지 참조인지.
 * 인라인되거나 보존되는 것:
 *   - data: / blob:                         → 이미 인라인
 *   - http(s):// , //                       → 외부 절대 URL (빌드가 보존)
 *   - @nudge-design/assets/files/…          → 빌드가 base64 inline (규약)
 * 그 외(/foo.png, ./foo, ../foo, foo.png)는 단일 파일에서 깨진다 → 위반.
 */
const INLINABLE_IMG_PREFIXES = [
  "data:",
  "blob:",
  "http://",
  "https://",
  "//",
  "@nudge-design/assets/",
];
function isNonInlinableImgRef(rawUrl: string): boolean {
  const url = rawUrl.trim();
  if (!url) return false;
  if (url.startsWith("#")) return false;
  return !INLINABLE_IMG_PREFIXES.some((p) => url.startsWith(p));
}

function resolveDocumentBrand($: cheerio.CheerioAPI, declaredBrand?: string): string | undefined {
  const classBrand = ($("body").attr("class") ?? "").match(/\bbrand-([a-z0-9-]+)\b/i)?.[1];
  return (
    canonicalBrandSlug(declaredBrand) ??
    canonicalBrandSlug($("html").attr("data-brand")) ??
    canonicalBrandSlug($("body").attr("data-brand")) ??
    canonicalBrandSlug(classBrand)
  );
}

function resolveDocumentPagePattern($: cheerio.CheerioAPI): CashwalkBizPagePattern | undefined {
  const candidates = [
    $("html").attr("data-page-pattern"),
    $("body").attr("data-page-pattern"),
    $(".mockup-screen[data-page-pattern]").first().attr("data-page-pattern"),
    $("[data-page-pattern]").first().attr("data-page-pattern"),
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const pattern = canonicalPagePattern(raw);
    if (pattern) return pattern;
  }
  return undefined;
}

/** srcset 의 각 URL 토큰을 추출 (descriptor 제외). */
function srcsetUrls(srcset: string): string[] {
  return srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean);
}

/** style="..." 문자열 안에 hex/rgb/gradient/px 등을 검사. */
function checkStyleString(
  style: string,
  line: number,
  selector: string,
  ctx: HtmlValidationContext,
  out: HtmlViolation[],
): void {
  const stripped = style.replace(/var\([^)]*\)/g, "");

  // hex / rgb (var() 안에 폴백으로 들어있는 경우는 strip 됨)
  if (/#[0-9a-fA-F]{3,8}\b/.test(stripped) || /rgba?\s*\(/.test(stripped)) {
    out.push({
      rule: "inline-color",
      line,
      selector,
      detail: style.trim(),
      suggestion: "토큰 var(--color-*) 또는 var(--semantic-*) 로 교체. find_token({ query }) 사용.",
    });
  }

  // gradient
  if (/(linear|radial|conic)-gradient\s*\(/.test(stripped)) {
    out.push({
      rule: "gradient-banned",
      line,
      selector,
      detail: style.trim(),
      suggestion: "그라데이션 금지. 단색 토큰만 사용. get_guide({ topic: 'principles' }).",
    });
  }

  // px / rem (transform 류 제외)
  const isMotion = /transform|translate|scale|rotate|matrix/.test(stripped);
  if (!isMotion) {
    const pxMatches = [...stripped.matchAll(/\b(\d+(?:\.\d+)?)(px|rem)\b/g)];
    if (pxMatches.length > 0) {
      out.push({
        rule: "inline-spacing",
        line,
        selector,
        detail: style.trim(),
        suggestion: "spacing 토큰으로 교체. find_token({ group: 'spacing' }).",
      });
      for (const m of pxMatches) {
        const v = parseFloat(m[1]);
        if (m[2] !== "px" || v <= 0) continue;
        if (v % 4 !== 0) {
          out.push({
            rule: "non-4pt-spacing",
            line,
            selector,
            detail: `${v}px (4 의 배수 아님)`,
            suggestion:
              "4 의 배수 (4/8/12/16/20/24…) 또는 var(--semantic-gap-*|--semantic-inset-*) semantic 토큰.",
          });
        }
      }
    }
  }

  // padding/margin/gap 에 primitive --spacing-* 직접 사용
  if (
    /\b(padding(?:-(?:top|right|bottom|left))?|margin(?:-(?:top|right|bottom|left))?|gap|column-gap|row-gap)\s*:\s*var\(--spacing-[\w-]+/i.test(
      style,
    )
  ) {
    out.push({
      rule: "non-semantic-spacing",
      line,
      selector,
      detail: style.trim(),
      suggestion:
        "padding/margin/gap 은 var(--spacing-*) 가 아니라 semantic var(--semantic-gap-*|--semantic-inset-*) 만 사용.",
    });
  }

  // var() 안의 알 수 없는 토큰
  for (const m of style.matchAll(/var\((--[\w-]+)/g)) {
    const tokenName = m[1];
    if (!ctx.tokenSet.has(tokenName)) {
      out.push({
        rule: "unknown-token",
        line,
        selector,
        detail: tokenName,
        suggestion: "find_token({ query: ... }) 으로 올바른 토큰 검색.",
      });
    }
  }
}

/**
 * nds-* 호스트(display:contents)에 직접 준 box/layout inline 스타일 프로퍼티명을 반환.
 * display:contents 는 호스트 박스를 없애므로 아래 프로퍼티는 브라우저가 전부 드롭한다.
 * 허용: --nds-* / --semantic-* 커스텀 프로퍼티(슬롯·토큰 전달), display(:contents / :none 등 의도적 토글).
 * 제외 태그: display:contents 를 안 쓰는 소수 컴포넌트.
 */
const HOST_CONTENTS_EXEMPT_TAGS = new Set(["nds-brand-chrome", "nds-input-group", "nds-inspector"]);
const HOST_DROPPED_PROP =
  /^(?:margin|padding|width|height|min-width|max-width|min-height|max-height|flex|align-self|justify-self|gap|row-gap|column-gap|background|border|box-shadow|position|top|right|bottom|left|transform|overflow)(?:-[a-z]+)*$/;

function ndsHostBoxStyleProps(tag: string, style: string): string[] {
  if (!tag.startsWith("nds-")) return [];
  if (HOST_CONTENTS_EXEMPT_TAGS.has(tag)) return [];
  const found: string[] = [];
  for (const decl of style.split(";")) {
    const prop = decl.split(":")[0]?.trim().toLowerCase();
    if (!prop || prop.startsWith("--")) continue; // 커스텀 프로퍼티는 허용
    if (HOST_DROPPED_PROP.test(prop) && !found.includes(prop)) found.push(prop);
  }
  return found;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasScriptReference(scriptText: string, candidates: string[]): boolean {
  if (!scriptText.trim()) return false;
  const hasEventBinding =
    /addEventListener\s*\(\s*["'](?:click|submit)["']/i.test(scriptText) ||
    /\.onclick\s*=/i.test(scriptText) ||
    /\.onsubmit\s*=/i.test(scriptText);
  if (!hasEventBinding) return false;
  return candidates.some((candidate) => {
    const c = candidate.trim();
    if (!c) return false;
    return new RegExp(escapeRegExp(c)).test(scriptText);
  });
}

function isButtonLike(tag: string, attrs: Record<string, string>): boolean {
  if (tag === "button") return true;
  if (tag === "nds-button" || tag === "nds-icon-button" || tag === "nds-text-button") return true;
  const cls = (attrs.class ?? "").split(/\s+/).filter(Boolean);
  return cls.some((c) => c === "nds-button" || c.startsWith("nds-button__"));
}

function buttonHandlerCandidates(tag: string, attrs: Record<string, string>): string[] {
  const candidates = new Set<string>();
  if (attrs.id) {
    candidates.add(`#${attrs.id}`);
    candidates.add(`getElementById("${attrs.id}")`);
    candidates.add(`getElementById('${attrs.id}')`);
  }
  const classes = (attrs.class ?? "").split(/\s+/).filter(Boolean);
  for (const c of classes.slice(0, 4)) candidates.add(`.${c}`);
  for (const attrName of ["data-action", "data-testid", "aria-controls"]) {
    const value = attrs[attrName];
    if (!value) continue;
    candidates.add(`[${attrName}="${value}"]`);
    candidates.add(`[${attrName}='${value}']`);
    candidates.add(value);
  }
  return Array.from(candidates);
}

export function validateHtmlSource(
  source: string,
  options?: { context?: HtmlValidationContext; surface?: HtmlSurface; brand?: string },
): HtmlViolation[] {
  const ctx = options?.context ?? configured;
  const surface = options?.surface ?? null;
  const declaredBrand = options?.brand;
  const violations: HtmlViolation[] = [];
  // E1 집계: DS 반영도(dsRatio) 게이트용. nds-* 태그/실재 nds 클래스(채택) vs native 미교체(미반영).
  let ndsTagCount = 0;
  let ndsClassCount = 0;
  let nativeUnwrappedCount = 0;
  // E1: native 외 회피가능 재발명(raw landmark / role·onclick 위젯)도 "DS 로 교체 가능한데 raw 로 그린"
  //     eligible 미스로 분모에 가산 — div 로 재발명한 컴포넌트가 비율에서 invisible 하던 사각지대를 막는다.
  let avoidableReinventionCount = 0;
  const $ = cheerio.load(source, { xmlMode: false });
  const documentBrand = resolveDocumentBrand($, declaredBrand);
  const pagePattern = resolveDocumentPagePattern($);
  const scriptText = $("script")
    .map((_i, el) => $(el).text())
    .get()
    .join("\n");

  // ─── 인코딩 깨짐(모지바케) 감지 — 문서 전역 1회 ───
  //   UTF-8 한글을 Latin-1 / Python decode('unicode_escape') 로 잘못 디코딩하면 글자당 3개의
  //   라틴-1 보충 문자(Ã/ë/¬ …)로 망가진다. 큰 가이드 마크업(사이드바 등)을 스크립트로 추출·
  //   재인코딩하다 자주 발생 — 깨진 한글도 여전히 valid JSON 이라 nds-json-attr-unparseable 로는
  //   안 잡힌다. UTF-8 한글(U+AC00+) 3바이트(lead 0xEA–0xED + continuation 0x80–0xBF)를 Latin-1 로
  //   읽으면 글자당 U+0080–U+00FF 3자가 나오므로, 그 범위 4자 이상 연속을 모지바케 신호로 본다.
  //   정상 목업은 한글=Hangul·영문/base64=ASCII 라 이 범위 연속이 거의 없다(저오탐).
  {
    const fffdIdx = source.indexOf("\uFFFD");
    const runMatch = new RegExp("[\\u0080-\\u00FF]{4,}").exec(source);
    const hitIdx = fffdIdx >= 0 ? fffdIdx : runMatch ? (runMatch.index ?? -1) : -1;
    if (hitIdx >= 0) {
      const sample = source.slice(hitIdx, hitIdx + 24).replace(/\s+/g, " ");
      violations.push({
        rule: "mojibake-encoding",
        line: lineNumberAt(source, hitIdx),
        selector: "(document)",
        detail: `한글 인코딩이 깨졌습니다(모지바케) — 예: "${sample}". UTF-8 한글이 Latin-1 로 잘못 디코딩된 흔적입니다.`,
        suggestion:
          '가이드/컴포넌트 마크업을 Python decode(\'unicode_escape\') 나 Latin-1 로 추출·재인코딩하지 마세요 — UTF-8 그대로 복붙하거나 json.loads(UTF-8) 만 사용. <nds-sidebar> 는 items/account/footer-actions 를 <script type="application/json" slot="..."> 텍스트 노드로 받으면 이스케이프·인코딩 사고가 원천 차단됩니다.',
        severity: "error",
      });
    }
  }

  // ─── 네이티브 alert()/confirm()/prompt() 사용 감지 — 문서 전역 1회 ───
  //   목업에서 알림·확인·완료를 네이티브 다이얼로그로 처리하지 말 것 — OS 기본 회색 박스라
  //   브랜드 스타일이 0 이고 디자인 일관성이 깨진다(흔한 회귀: "완료"를 alert() 로 띄움).
  //   DS 는 <nds-modal>(확인/완료/안내) 과 Toast 패턴(일시 알림)을 제공한다.
  //   선행 `.`/식별자를 lookbehind 로 배제해 `el.alert(` 같은 메서드 오탐을 막고,
  //   window./globalThis. prefix 만 허용 매칭한다.
  if (scriptText.trim()) {
    const dialogSeen = new Set<string>();
    for (const m of scriptText.matchAll(
      /(?<![.\w$])(?:window\s*\.\s*|globalThis\s*\.\s*)?(alert|confirm|prompt)\s*\(/g,
    )) {
      const fn = m[1];
      if (dialogSeen.has(fn)) continue;
      dialogSeen.add(fn);
      const idx = source.indexOf(m[0]);
      violations.push({
        rule: "native-dialog-in-mockup",
        line: idx >= 0 ? lineNumberAt(source, idx) : 1,
        selector: "(script)",
        detail: `<script> 에서 네이티브 ${fn}() 사용 — OS 기본 회색 다이얼로그라 브랜드 스타일이 0 이고 디자인 일관성이 깨집니다(흔한 회귀: "완료"를 alert 로 처리).`,
        suggestion:
          "확인/완료/안내는 <nds-modal>(open 속성 토글) 로, 일시적 알림은 Toast 패턴으로 띄우세요. window.alert/confirm/prompt 는 목업에서 쓰지 않습니다.",
        severity: "warn",
      });
    }
  }

  // ─── nds-* 커스텀 엘리먼트 내부 텍스트 직접 변경 감지 — 문서 전역 1회 ───
  //   <script> 에서 nds-* 엘리먼트의 textContent/innerText/innerHTML 을 대입하면 컴포넌트가 렌더한
  //   내부 구조(슬롯/버튼/라벨)가 통째로 지워져 빈 박스/깨진 버튼이 된다(회귀: nds-button 라벨을
  //   textContent 로 갈아끼워 내부가 날아감). 정적 분석이라 런타임 렌더 자체는 못 보지만, "nds-* 참조에
  //   textContent= 대입" 이라는 코드 패턴은 잡는다. raw <div> 등에 대한 textContent 대입은 정상이므로 제외.
  if (scriptText.trim() && /(textContent|innerText|innerHTML)/.test(scriptText)) {
    // 1) nds-* 엘리먼트의 id / class 수집 → 셀렉터가 nds-* 를 가리키는지 판정용
    const ndsIds = new Set<string>();
    const ndsClasses = new Set<string>();
    $("*").each((_i, e) => {
      if (e.type !== "tag" || !e.tagName.toLowerCase().startsWith("nds-")) return;
      const a = e.attribs ?? {};
      if (a.id) ndsIds.add(a.id);
      for (const c of (a.class ?? "").split(/\s+/).filter(Boolean)) ndsClasses.add(c);
    });
    const selectorHitsNds = (sel: string, byId: boolean): boolean => {
      if (byId) return ndsIds.has(sel);
      if (/(^|[\s,>+~(])nds-[a-z0-9-]+/.test(sel)) return true; // nds-* 태그 셀렉터
      for (const m of sel.matchAll(/#([\w-]+)/g)) if (ndsIds.has(m[1])) return true;
      for (const m of sel.matchAll(/\.([\w-]+)/g)) if (ndsClasses.has(m[1])) return true;
      return false;
    };
    // 2) script 내 변수 → 셀렉터 매핑 (const x = document.querySelector('...') / getElementById('id'))
    const varSelector = new Map<string, { sel: string; byId: boolean }>();
    for (const m of scriptText.matchAll(
      /(?:const|let|var)\s+([\w$]+)\s*=\s*(?:document\s*\.\s*)?(querySelector(?:All)?|getElementById)\s*\(\s*(['"`])([^'"`]+)\3/g,
    )) {
      varSelector.set(m[1], { sel: m[4], byId: m[2] === "getElementById" });
    }
    // 3) textContent / innerText / innerHTML 대입을 찾고, 좌변이 nds-* 참조면 위반
    const seen = new Set<string>();
    for (const m of scriptText.matchAll(
      /((?:document\s*\.\s*)?(?:querySelector(?:All)?|getElementById)\s*\(\s*['"`][^'"`]+['"`]\s*\)|[\w$]+(?:\s*\.\s*[\w$]+|\s*\[[^\]]+\])*)\s*\.\s*(textContent|innerText|innerHTML)\s*=(?!=)/g,
    )) {
      const lhs = m[1];
      const prop = m[2];
      let isNds = false;
      const inline = lhs.match(/(querySelector(?:All)?|getElementById)\s*\(\s*(['"`])([^'"`]+)\2/);
      if (inline) {
        isNds = selectorHitsNds(inline[3], inline[1] === "getElementById");
      } else {
        const head = lhs.match(/^[\w$]+/)?.[0] ?? "";
        const mapped = varSelector.get(head);
        if (mapped) isNds = selectorHitsNds(mapped.sel, mapped.byId);
      }
      if (!isNds) continue;
      const key = `${lhs}.${prop}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const idx = source.indexOf(m[0]);
      violations.push({
        rule: "nds-custom-element-content-mutation",
        line: idx >= 0 ? lineNumberAt(source, idx) : 1,
        selector: "(script)",
        detail: `<script> 에서 nds-* 커스텀 엘리먼트의 ${prop} 를 직접 설정 — 컴포넌트가 렌더한 내부 구조가 지워집니다(빈 박스/깨진 버튼).`,
        suggestion:
          "nds-* 호스트의 textContent/innerText/innerHTML 을 덮어쓰지 마세요. 값은 .value/.checked 프로퍼티, 라벨 텍스트는 슬롯 자식 텍스트 노드, 표시 토글은 속성(setAttribute)으로 바꿉니다.",
      });
    }
  }

  // 모든 element 순회 — style / class / svg / native button 검사
  $("*").each((_idx, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    const attrs = el.attribs ?? {};
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);

    // E1 집계: DS 반영도 — nds-* 태그 / 실재 nds 클래스(채택) 카운트.
    let countedAsNds = false;
    if (tag.startsWith("nds-")) {
      ndsTagCount++;
      countedAsNds = true;
    } else {
      const elClasses = (attrs.class ?? "").split(/\s+/).filter(Boolean);
      const ndsBase = elClasses.find(
        (c) => /^nds-[a-z0-9-]+$/.test(c) && !c.includes("__") && !c.includes("--"),
      );
      // 실재 nds 클래스만 채택으로 카운트(E4 와 동일 기준) — 가짜 nds-foo 로 비율 부풀리기 차단.
      if (ndsBase && (ctx.ndsClassPrefixSet.size === 0 || ctx.ndsClassPrefixSet.has(ndsBase))) {
        ndsClassCount++;
        countedAsNds = true;
      }
    }
    // E1 집계: 회피가능 재발명 — native 4종(별도 집계)·nds 채택을 제외한 raw landmark / role·onclick 위젯.
    //   nds-* 래퍼 내부(우리 WC 가 만든 inner 마크업)는 제외. countHtmlUsage 와 동일 판정(avoidableReinventionKind).
    const reinvKind =
      !countedAsNds &&
      tag !== "button" &&
      tag !== "input" &&
      tag !== "select" &&
      tag !== "textarea" &&
      !hasAncestorNdsTag(el)
        ? avoidableReinventionKind(tag, attrs)
        : null;
    if (reinvKind !== null) {
      avoidableReinventionCount++;
      // 추가: div+role/onclick 로 특정 DS 컴포넌트를 재발명했으면 named warn 으로 표면화한다.
      //   (count 는 dsRatio 게이트용으로 그대로 유지 — 이건 비율과 무관하게 "무엇을" 재발명했는지 알린다.)
      if (reinvKind === "role-widget") {
        const hint = reinventedComponentHint(attrs, $(el).text());
        if (hint) {
          violations.push({
            rule: "avoidable-reinvention",
            line,
            selector,
            detail: `<${tag}> 가 role/onclick 로 ${hint.component} 를 재발명했습니다 — DS 컴포넌트 대체재가 있습니다.`,
            suggestion: `<${hint.tag}> 를 사용하세요. get_guide({ topic: '${hint.guide}', target: 'html' }) 참조.`,
          });
        }
      }
    }

    // 1. style="..." 검사
    if (attrs.style) {
      checkStyleString(attrs.style, line, selector, ctx, violations);
      // 1-bis. nds-* 호스트는 display:contents (light-DOM 미러) — 호스트에 직접 준 box 스타일은
      //   브라우저가 전부 드롭한다(margin/padding/width/flex/gap/background…). '컴포넌트 딱 붙음 /
      //   모달 헤더 사라짐 / 여백 사라짐' 의 단일 근본 원인. 간격·크기는 wrapper div 또는 부모 gap 으로.
      //   가이드: get_guide({ topic: 'pattern:host-spacing' }).
      const droppedProps = ndsHostBoxStyleProps(tag, attrs.style);
      if (droppedProps.length > 0) {
        violations.push({
          rule: "nds-host-box-style",
          line,
          selector,
          detail: `<${tag}> 호스트에 ${droppedProps.join(" / ")} — display:contents 라 무시됨`,
          suggestion:
            "nds-* 호스트는 display:contents 라 박스 스타일이 안 먹는다. 일반 <div> 로 감싸 wrapper 에 주거나(간격), 부모 컨테이너를 flex/grid 로 만들어 gap(var(--semantic-gap-*))으로 띄울 것. 호스트엔 --nds-*/--semantic-* 변수만 허용. get_guide({ topic: 'pattern:host-spacing' }).",
        });
      }
    }

    // 2. native interactive 가 nds-* 태그 / 클래스 없이 사용
    if (tag === "button" || tag === "input" || tag === "select" || tag === "textarea") {
      const cls = (attrs.class ?? "").split(/\s+/).filter(Boolean);
      // E4: 실재하는 nds 베이스 클래스만 native-interactive 를 무력화한다. 가짜 nds-foo 를 붙여
      //     에러를 잠재우거나 dsRatio 게이트를 우회하지 못하게(컨텍스트 미설정이면 prefix 만으로 하위호환).
      const hasNdsClass = cls.some((c) => {
        if (!/^nds-[\w-]+/.test(c)) return false;
        if (ctx.ndsClassPrefixSet.size === 0) return true;
        const base = c.replace(/__.+$/, "").replace(/--.+$/, "");
        return ctx.ndsClassPrefixSet.has(base);
      });
      // <nds-input> 안에 들어있는 inner <input> 은 우리 WC 가 만든 것 — 검사 제외
      const insideNdsWrapper = (el as unknown as { parent?: DomElement }).parent
        ? hasAncestorNdsTag(el)
        : false;
      if (!hasNdsClass && !insideNdsWrapper) {
        nativeUnwrappedCount++;
        violations.push({
          rule: "native-interactive",
          line,
          selector,
          detail: `<${tag}> 가 nds-* 없이 사용됨`,
          suggestion:
            tag === "button"
              ? '<nds-button> 사용 (예: <nds-button color="primary">제출</nds-button>)'
              : tag === "input"
                ? "<nds-input> 사용. find_component({ name: 'Input' }) 참조."
                : tag === "select"
                  ? "<nds-select> + <nds-select-option> 사용."
                  : "<nds-textarea> 사용.",
        });
      }
    }

    // 2-ter. 날짜/기간·금액/수량은 전용 입력 컴포넌트로. raw <input> / <nds-input> 로
    //   날짜·금액을 그리면 달력 팝오버·천단위 콤마·단위 suffix·min/max clamp 가 전부 빠진다.
    //   (회귀: 캐포비 어드민 폼에서 '노출 기간' 을 placeholder 'YYYY-MM-DD' text input 2개로,
    //    '목표 참여자 수' 를 큰 정적 숫자로 그린 사고.)
    if (tag === "input" || tag === "nds-input") {
      // nds-date-picker / nds-amount-input 등 DS 래퍼 안의 inner <input> 은 우리 WC 가 만든 것 → 제외
      const insideDsWrapper = tag === "input" && hasAncestorNdsTag(el);
      if (!insideDsWrapper) {
        const ph = String(attrs.placeholder ?? "");
        const lbl = `${attrs.label ?? ""} ${attrs["aria-label"] ?? ""} ${attrs.name ?? ""}`;
        const inputType = String(attrs.type ?? "").toLowerCase();
        const isDateLike =
          inputType === "date" ||
          /\d{4}\s*[-/.]\s*\d{1,2}\s*[-/.]\s*\d{1,2}/.test(ph) ||
          /(시작일|종료일|날짜|연도|YYYY)/i.test(`${ph} ${lbl}`);
        if (isDateLike) {
          const isRange = /(시작|종료|기간|부터|까지|~)/.test(`${ph} ${lbl}`);
          violations.push({
            rule: "date-as-text-input",
            line,
            selector,
            detail: `날짜 입력으로 보이는 <${tag}${ph ? ` placeholder="${ph.slice(0, 24)}"` : ""}> 를 일반 텍스트 입력으로 구현함`,
            suggestion: isRange
              ? "기간(시작~종료)은 <nds-date-range-picker> 한 컴포넌트로 — text input 두 개를 손수 붙이지 말 것(간격·검증·달력 누락). get_guide({ topic: 'component:DateRangePicker', target: 'html' }) 참조."
              : "단일 날짜는 <nds-date-picker>(달력 팝오버). placeholder 'YYYY-MM-DD' text input 금지. get_guide({ topic: 'component:DatePicker', target: 'html' }) 참조.",
          });
        }
        const isAmountLike =
          inputType === "number" ||
          /(금액|[0-9]\s*원\b|\b명\b|개수|수량|참여자\s*수|규모|건수|회원\s*수|포인트|캐시)/.test(
            `${ph} ${lbl}`,
          );
        if (!isDateLike && isAmountLike) {
          violations.push({
            rule: "amount-as-text-input",
            line,
            selector,
            detail: `금액/수량 입력으로 보이는 <${tag}> 를 일반 텍스트 입력으로 구현함`,
            suggestion:
              "숫자(금액/수량)는 <nds-amount-input unit='명|원|개'>(천단위 콤마·단위 suffix·min/max clamp). 일반 text input 금지. get_guide({ topic: 'component:AmountInput', target: 'html' }) 참조.",
          });
        }
        // 우편/도로명 주소 수집을 plain input 으로 손조립 (address-as-text-input).
        //   강한 신호(도로명/지번/우편번호/상세주소/배송지)이거나, "주소"이되 이메일/URL 맥락이 아닐 때.
        //   시/도▸시/군구 계층 선택(CheckboxTree)이나 "이메일 주소"/"사이트 주소"엔 발화하지 않는다.
        const addrText = `${ph} ${lbl}`;
        const isAddressLike =
          /(도로명|지번|우편번호|상세\s*주소|주소\s*검색|배송\s*지|배송\s*주소)/.test(addrText) ||
          (/주소/.test(addrText) &&
            !/(이메일|메일|e-?mail|url|https?|링크|link|사이트|홈페이지|도메인|domain)/i.test(
              addrText,
            ));
        if (!isDateLike && !isAmountLike && isAddressLike) {
          violations.push({
            rule: "address-as-text-input",
            line,
            selector,
            detail: `주소 입력으로 보이는 <${tag}${ph ? ` placeholder="${ph.slice(0, 24)}"` : ""}> 를 일반 텍스트/select 로 손조립함`,
            suggestion:
              "주소 수집은 <nds-address-picker> 한 컴포넌트(도로명/지번 검색 → 결과 선택 → 상세주소). 검색 API(카카오/네이버)는 results 로만 전달, plain input/select 손조립 금지. get_guide({ topic: 'component:AddressPicker', target: 'html' }) 참조. (시/도▸시/군구 계층 선택은 별개 — get_guide({ topic: 'pattern:cashwalk-biz-page-targeting-regions' }).)",
          });
        }
      }
    }

    // 2-bis. 활성 버튼은 장식으로 끝나면 안 된다. HTML 목업은 정적 산출물이지만,
    // 버튼별 식별자(id/data-action/class)와 script 의 addEventListener/click binding 이
    // 연결돼 있어야 "누르면 뭔가 동작"하는 목업으로 인정한다.
    if (isButtonLike(tag, attrs)) {
      const insideNdsWrapper =
        tag === "button" && (el as unknown as { parent?: DomElement }).parent
          ? hasAncestorNdsTag(el)
          : false;
      const disabled =
        "disabled" in attrs ||
        attrs["aria-disabled"] === "true" ||
        attrs.disabled === "true" ||
        attrs.disabled === "";
      if (!insideNdsWrapper && !disabled) {
        const hasInlineHandler = !!attrs.onclick;
        const hasScriptHandler = hasScriptReference(
          scriptText,
          buttonHandlerCandidates(tag, attrs),
        );
        if (!hasInlineHandler && !hasScriptHandler) {
          violations.push({
            rule: "button-without-interaction",
            line,
            selector,
            detail: `<${tag}> "${$(el).text().trim().slice(0, 40)}" 버튼에 click/submit 동작 연결 근거가 없습니다.`,
            suggestion:
              "버튼은 시각 요소로만 두지 말고 data-action/id 를 부여한 뒤 <script> 에서 addEventListener('click', ...) 로 실제 상태 변경/모달 열기/필터 적용/다음 단계 이동/토스트 표시 중 하나를 구현하세요. inline onclick 보다는 addEventListener 패턴을 사용.",
          });
        }
      }
    }

    if (
      (tag === "aside" && ctx.ndsTagSet.has("nds-sidebar")) ||
      (tag === "footer" &&
        (ctx.ndsTagSet.has("nds-brand-footer") ||
          ctx.ndsTagSet.has("nds-footer") ||
          ctx.ndsTagSet.has("nds-footer-info"))) ||
      (tag === "header" &&
        (ctx.ndsTagSet.has("nds-brand-header") || ctx.ndsTagSet.has("nds-header")))
    ) {
      // 예외: admin-shell 이 처방하는 셸 chrome 은 raw <header>/<aside> 가 정답이다.
      //   pattern:admin-shell SSOT 가 <header class="nds-shell__topbar"> / <aside class="nds-shell__sidebar">
      //   를 명시한다(guides.ts). 이 landmark 들을 raw-landmark 로 잡으면 가이드와 검증이 모순돼,
      //   작성자가 빠져나가려 셸 chrome 을 <div> 로 strip(=admin-shell 패턴 파괴)하게 된다.
      //   회고: 캐포비 어드민(업용) 목업에서 헤더/사이드바가 검증에 걸려 <div> 로 다운그레이드된 사고.
      const landmarkClass = String(attrs.class ?? "");
      const isAdminShellChrome = /\bnds-shell__/.test(landmarkClass);
      if (!isAdminShellChrome) {
        const hasBrandHeader = ctx.ndsTagSet.has("nds-brand-header");
        const hasBrandFooter = ctx.ndsTagSet.has("nds-brand-footer");
        // brand-header/footer 가 있는데도 raw <header>/<footer> 를 쓰는 건 contract 위반에 가까움.
        // (회고: validator 추천을 "soft suggestion" 으로 오해해 reference 스크린샷 fidelity 우선)
        // 이 경우엔 error 로 승격, brand 변형이 없는 일반 landmark 대체는 warn.
        const isBrandReplaceable =
          (tag === "footer" && hasBrandFooter) || (tag === "header" && hasBrandHeader);
        // 표면=admin 이면 소비자 brand/nds-header 가 아니라 admin-shell chrome 으로 유도해야 한다.
        //   (admin-surface-consumer-chrome 룰이 brand chrome 을 error 로 막으므로, 여기서 nds-header/
        //    brand-header 를 권하면 두 룰이 서로 모순된다.)
        const adminSuggestion =
          tag === "aside"
            ? "어드민 사이드바는 admin-shell 슬롯으로 둔다: <aside class=\"nds-shell__sidebar\"><nds-sidebar>…</nds-sidebar></aside>. get_guide({ topic: 'pattern:admin-shell' }) 참조 (소비자 chrome 금지)."
            : tag === "header"
              ? "어드민 톱바는 <header class=\"nds-shell__topbar\"> (admin-shell). nds-header/nds-brand-header(소비자 chrome)로 바꾸지 말 것 — admin-surface-consumer-chrome 룰에 걸린다. get_guide({ topic: 'pattern:admin-shell' }) 참조."
              : "어드민 화면은 보통 푸터가 없다 — admin-shell(사이드바+톱바+content) 위에 콘텐츠만 둔다. get_guide({ topic: 'pattern:admin-shell' }) 참조.";
        violations.push({
          rule: "raw-landmark",
          line,
          selector,
          severity: isBrandReplaceable ? "error" : "warn",
          detail: `<${tag}> 를 raw landmark 로 구현함`,
          suggestion:
            surface === "admin"
              ? adminSuggestion
              : tag === "aside"
                ? "사이드바는 <nds-sidebar> 우선 사용. get_guide({ topic: 'component:Sidebar', target: 'html' }) 참조."
                : tag === "footer"
                  ? hasBrandFooter
                    ? "[error] 사용자 앱/브랜드 화면의 푸터는 raw <footer> 금지. <nds-brand-footer brand='geniet|trost|nudge-eap|cashwalk-biz' surface='web|app' asset-base-url='/brand-logos'> 로 반드시 교체. get_guide({ topic: 'component:BrandFooter', target: 'html' }) 참조."
                    : "푸터는 <nds-footer-info> / <nds-footer-web> 우선 사용. get_guide({ topic: 'component:Footer', target: 'html' }) 참조."
                  : hasBrandHeader
                    ? "[error] 사용자 앱/브랜드 화면의 헤더는 raw <header> 또는 nds-header 손수 조립 금지. <nds-brand-header brand='geniet|trost|nudge-eap|cashwalk-biz' surface='web|mobile|webview' active-key='...' asset-base-url='/brand-logos'> 로 반드시 교체. get_guide({ topic: 'component:BrandHeader', target: 'html' }) 참조."
                    : "헤더는 <nds-header> 우선 사용. get_guide({ topic: 'component:Header', target: 'html' }) 참조.",
        });
      }
    }

    const text = $(el).text().trim();
    const classOrAria = `${attrs.class ?? ""} ${attrs["aria-label"] ?? ""}`.toLowerCase();
    if (/^(x|×)$/i.test(text) && /close|delete|remove|clear|삭제|닫기|제거/.test(classOrAria)) {
      violations.push({
        rule: "text-icon-substitute",
        line,
        selector,
        detail: `"${text}" 텍스트를 아이콘처럼 사용함`,
        suggestion:
          "텍스트 기호 대신 find_icon({ query: 'close' }) / 브랜드 전용 아이콘을 사용하세요.",
      });
    }

    // 3. inline svg — DS 아이콘 사용 권장
    // inline svg — find_icon 으로 받은 DS 아이콘 인라인은 HTML 목업의 정상(불가피) 패턴이다.
    // nds-* 컴포넌트 안의 아이콘(버튼/사이드바 슬롯 등)은 DS-driven 이므로 아예 제외하고,
    // 그 외 standalone <svg> 만 info(권고)로 남긴다 — 게이트 점수(icon 차원)를 깎지 않게.
    // (룰 주석의 'DS 아이콘 화이트리스트' 를 실제로 구현. 회고: inline-svg warn 이 icon 차원을
    //  0 으로 끌어내려 DS 100% 목업이 81점으로 보이던 채점 불공정 수정.)
    if (tag === "svg" && !hasAncestorNdsTag(el)) {
      violations.push({
        rule: "inline-svg",
        line,
        selector,
        detail: "<svg> 직접 사용",
        suggestion:
          "먼저 find_icon 으로 @nudge-design/icons 에 적합 아이콘 있는지 확인. (find_icon 이 준 DS 아이콘 인라인은 정상 — info 권고)",
      });
    }

    // 3-bis. 단일 파일 빌드에 안 박히는 로컬 이미지 경로 — src / srcset.
    //   회고: 상대경로(/marathon-events/…) 이미지가 내부 미리보기·외부 단독 파일 모두 깨짐.
    //   build_singlefile_html 은 @nudge-design/assets/files/… 규약만 base64 inline 하고
    //   외부 http(s)·data: 만 보존한다. 나머지 로컬 경로는 살아남지 못한다.
    if (tag === "img" || tag === "source") {
      const offenders: string[] = [];
      if (attrs.src && isNonInlinableImgRef(attrs.src)) offenders.push(attrs.src);
      if (attrs.srcset) {
        for (const u of srcsetUrls(attrs.srcset)) {
          if (isNonInlinableImgRef(u)) offenders.push(u);
        }
      }
      if (offenders.length > 0) {
        violations.push({
          rule: "non-inlinable-img-src",
          line,
          selector,
          detail: `${offenders.slice(0, 2).join(", ")}${offenders.length > 2 ? " …" : ""}`,
          suggestion:
            "이 경로는 단일 HTML 빌드에 inline 되지 않아 내부 미리보기·외부 단독 파일 모두 깨집니다. " +
            "DS 자산이면 @nudge-design/assets/files/{category}/{id}.png 규약(get_brand 의 inlineRef)으로 바꾸면 build_singlefile_html 이 base64 inline 합니다. " +
            "외부 이미지는 http(s):// 절대 URL 또는 data: URI 를 사용하세요. (상대경로 /…, ./…, ../… 는 호스팅 앱 전용)",
        });
      }
    }

    // 4. unknown nds-* 태그
    if (tag.startsWith("nds-") && ctx.ndsTagSet.size > 0 && !ctx.ndsTagSet.has(tag)) {
      violations.push({
        rule: "unknown-nds-tag",
        line,
        selector,
        detail: `<${tag}> 는 @nudge-design/html 에 없는 custom element`,
        suggestion:
          "find_component({ query }) 또는 get_guide({ target: 'html', topic: 'component:<name>' }) 로 실제 nds-* 태그명을 확인.",
      });
    }

    // 4-bis. nds-* 의 attribute enum 검사 (예: <nds-button color="weird">)
    if (tag.startsWith("nds-") && ctx.ndsAttrEnums && ctx.ndsAttrEnums.has(tag)) {
      const attrEnumMap = ctx.ndsAttrEnums.get(tag)!;
      for (const [attrName, allowed] of attrEnumMap) {
        const value = attrs[attrName];
        if (value === undefined) continue; // 미지정 = 컴포넌트 기본값 → 통과
        if (allowed.includes(value)) continue;
        violations.push({
          rule: "invalid-nds-attr-value",
          line,
          selector,
          detail: `<${tag} ${attrName}="${value}"> — 허용값 아님.`,
          suggestion: `${tag}.${attrName} 허용값: ${allowed.map((v) => `"${v}"`).join(", ")}.`,
        });
      }
    }

    // 4-ter. nds-* 의 JSON 속성이 파싱 안 되면 컴포넌트가 조용히 빈 값으로 렌더된다
    //   (예: nds-sidebar 메뉴 통째 유실 — 로고만 보임). 휴리스틱: nds-* 속성 값이 [ 또는 {
    //   로 시작하면 JSON 으로 간주하고 파싱 시도. 가장 흔한 원인 = 단일따옴표 속성에서
    //   구조용 따옴표까지 \" 로 과이스케이프(items='[{\"key\"...]'). build_singlefile_html 의
    //   자동 validate 단계에서 빌드를 막아 "로고만 뜨는" 침묵 실패를 차단한다.
    if (tag.startsWith("nds-")) {
      for (const [attrName, attrValue] of Object.entries(attrs)) {
        if (typeof attrValue !== "string") continue;
        const trimmed = attrValue.trim();
        if (trimmed[0] !== "[" && trimmed[0] !== "{") continue;
        try {
          JSON.parse(trimmed);
        } catch {
          violations.push({
            rule: "nds-json-attr-unparseable",
            line,
            selector,
            detail: `<${tag} ${attrName}="${trimmed.slice(0, 40)}…"> — JSON 파싱 실패. 컴포넌트가 빈 값으로 렌더됨(메뉴/옵션 유실).`,
            suggestion:
              'JSON 속성의 구조용 따옴표를 \\" 로 이스케이프하지 마세요 — 단일따옴표 속성 안에서는 bare 가 맞고 SVG 내부 따옴표만 \\" 입니다. ' +
              '큰 데이터는 <nds-...><script type="application/json" slot="items">[...]</script> 가 더 안전합니다.',
          });
        }
      }
    }

    // 5. unknown nds-* 클래스 (베이스 클래스 prefix 단위로 검사)
    if (attrs.class && ctx.ndsClassPrefixSet.size > 0) {
      const ndsClasses = attrs.class.split(/\s+/).filter((c) => /^nds-[\w-]+/.test(c));
      for (const c of ndsClasses) {
        const base = c.replace(/__.+$/, "").replace(/--.+$/, "");
        if (!ctx.ndsClassPrefixSet.has(base)) {
          violations.push({
            rule: "unknown-nds-class",
            line,
            selector,
            detail: `class="${c}" 의 베이스 "${base}" 가 stylesheet 에 없음`,
            suggestion: "오타 또는 미존재 컴포넌트. find_component({ query }) 로 확인.",
          });
        }
      }
    }

    // 6. card slot 이중 padding — nds-card-header/body/footer 는 자체 padding 보유.
    //    외곽 style 로 padding 을 또 주면 이중 패딩으로 어긋남.
    if (
      (tag === "nds-card-header" || tag === "nds-card-body" || tag === "nds-card-footer") &&
      attrs.style &&
      /\bpadding(?:-(?:top|right|bottom|left))?\s*:/i.test(attrs.style)
    ) {
      violations.push({
        rule: "card-slot-double-padding",
        line,
        selector,
        detail: attrs.style.trim(),
        suggestion:
          "nds-card-header/body/footer 는 자체 padding 을 가짐. 외곽 padding 을 또 주면 이중 패딩. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }

    // 7. nds-button color="neutral" + solid(default) — base/cool-gray 브랜드에선 비활성처럼 보임.
    //    명시적으로 variant 가 outlined/soft/text 계열이면 OK.
    //    ※ 검정 CTA 슬롯이 neutral 인 브랜드(프로필 cta.blackCta="neutral" — 현재 캐포비)는
    //      neutral solid = 정당한 검정 CTA 라 면제.
    if (
      tag === "nds-button" &&
      attrs.color === "neutral" &&
      getBrandProfile(documentBrand)?.cta?.blackCta !== "neutral"
    ) {
      const variant = attrs.variant;
      const isNonSolid =
        variant === "outlined" || variant === "soft" || variant === "text" || variant === "ghost";
      if (!isNonSolid) {
        violations.push({
          rule: "neutral-solid-cta",
          line,
          selector,
          detail: `<nds-button color="neutral">${variant ? ` variant="${variant}"` : ""}`,
          suggestion:
            'nds-button color="neutral" + solid 는 비활성처럼 보임. 활성 CTA 면 color="primary"/"secondary", 보조면 variant="outlined" 또는 "text". get_guide({ topic: \'component:Button\' }) 참조.',
        });
      }
    }

    // 7b. 브랜드 금지 Button color — 프로필 cta.deniedButtonColors 선언 브랜드에서 발화.
    //     (현재 선언 = 캐포비 secondary: ButtonGuide(3098:1032) tone 은 Primary + Neutral 둘뿐.)
    if (tag === "nds-button" && attrs.color) {
      const denied = getBrandProfile(documentBrand)?.cta?.deniedButtonColors?.find(
        (d) => d.color === attrs.color,
      );
      if (denied) {
        violations.push({
          rule: "brand-denied-button-color",
          line,
          selector,
          detail: `<nds-button color="${attrs.color}">`,
          suggestion: `이 브랜드(${documentBrand})에는 color="${attrs.color}" tone 이 없습니다. ${denied.useInstead}. get_guide({ topic: 'component:Button' }) 참조.`,
        });
      }
    }

    // 7c. 브랜드 금지 알림 컴포넌트 — 프로필 notifications.bannedComponents 선언 브랜드에서 발화.
    //     (현재 선언 = 캐포비 nds-toast: 알림 SSOT 는 Snackbar(흰 카드 chrome·우측 상단 고정·
    //      상태 칩 아이콘·닫기 X). 예외 없음.)
    {
      const banned = getBrandProfile(documentBrand)?.notifications?.bannedComponents?.find(
        (b) => b.tag === tag,
      );
      if (banned) {
        violations.push({
          rule: "brand-banned-notification",
          line,
          selector,
          detail: `<${tag}>`,
          suggestion: `이 브랜드(${documentBrand})에서 <${tag}> 는 금지 — 알림 SSOT 는 <${banned.useInstead}> 입니다. 캐포비 기준: <nds-snackbar-host brand="cashwalk-biz"> + <nds-snackbar> (흰 카드 chrome·우측 상단 고정·상태 칩 아이콘·닫기 X). get_guide({ topic: 'component:Snackbar', brand: '${documentBrand}' }) 참조.`,
        });
      }
    }
  });

  // 8. text 노드 + attribute 값 + <style> 안의 emoji / strict symbol
  //    (attribute: placeholder / title / alt / aria-label / label / content 등 사용자 노출 텍스트)
  const TEXT_ATTR_KEYS = [
    "placeholder",
    "title",
    "alt",
    "aria-label",
    "label",
    "data-label",
    "content",
    "value",
  ];
  $("*").each((_idx, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    if (tag === "script") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);

    if (tag !== "style") {
      const text = $(el)
        .contents()
        .filter((_i, c) => c.type === "text")
        .text();
      if (text) {
        if (EMOJI_RE.test(text)) {
          violations.push({
            rule: "emoji-banned",
            line,
            selector,
            detail: text.trim().slice(0, 60),
            suggestion:
              "이모지 금지. 아이콘이 필요하면 find_icon({ query }) → @nudge-design/icons 인라인 SVG. 차선책으로 MockupLinear*/MockupBold* 패키지.",
          });
        }
        if (STRICT_SYMBOL_RE.test(text)) {
          violations.push({
            rule: "text-symbol-banned",
            line,
            selector,
            detail: text.trim().slice(0, 60),
            suggestion: "→ ← ✓ ★ • 같은 기호 텍스트 금지. 의미 컴포넌트 또는 DS 아이콘 사용.",
          });
        }
      }

      const attrs = el.attribs ?? {};
      for (const key of TEXT_ATTR_KEYS) {
        const v = attrs[key];
        if (!v) continue;
        if (EMOJI_RE.test(v)) {
          violations.push({
            rule: "emoji-banned",
            line,
            selector,
            detail: `${key}="${v.slice(0, 60)}"`,
            suggestion: `${key} 속성에 이모지 사용 금지. 평문으로 작성하거나 아이콘은 find_icon 으로 DS 아이콘 사용.`,
          });
        }
      }
    }
  });

  // <style> 블록 안의 content: '😀' 류 — cheerio 의 element 순회에서는 style 자식
  // 텍스트가 일관되게 노출되지 않으므로 source 문자열을 직접 스캔한다.
  const styleBlockRe = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  for (const styleMatch of source.matchAll(styleBlockRe)) {
    const cssBody = styleMatch[1] ?? "";
    const blockStart = styleMatch.index ?? 0;
    const blockLine = lineNumberAt(source, blockStart);
    for (const m of cssBody.matchAll(/content\s*:\s*(["'])((?:(?!\1).)*)\1/g)) {
      const v = m[2];
      if (EMOJI_RE.test(v) || STRICT_SYMBOL_RE.test(v)) {
        violations.push({
          rule: "emoji-banned",
          line: blockLine,
          selector: "<style>",
          detail: `content: "${v.slice(0, 40)}"`,
          suggestion:
            "CSS content 속성 안 이모지/기호 사용 금지. ::before / ::after 장식은 텍스트가 아니라 SVG mask / 배경 또는 DS 아이콘 컴포넌트로 표현.",
        });
      }
    }

    // raw-shell-pattern — admin-shell 가이드 강제 (nds-shell / nds-section / nds-form-row).
    for (const pattern of RAW_SHELL_PATTERNS) {
      // matchAll 마다 lastIndex 가 진행되도록 매번 새 RegExp 인스턴스가 필요한 건 아니지만,
      // global flag 가 매번 매치되도록 source 를 cssBody 로 한정해 호출.
      for (const match of cssBody.matchAll(pattern.selectorRe)) {
        const ruleBody = match[1] ?? "";
        if (!pattern.requireAll.every((re) => re.test(ruleBody))) continue;
        const offsetInBody = match.index ?? 0;
        const linesBefore = cssBody.slice(0, offsetInBody).split("\n").length - 1;
        const line = blockLine + linesBefore;
        const selectorHead = match[0].slice(0, match[0].indexOf("{")).trim();
        violations.push({
          rule: "raw-shell-pattern",
          line,
          selector: "<style>",
          detail: `${pattern.name} 을 raw CSS 로 정의: ${selectorHead.slice(0, 60)}`,
          suggestion:
            `${pattern.ndsClass} 사용. @nudge-design/styles/styles.css 한 줄 import 로 활성화. ` +
            `상세: get_guide({ topic: 'pattern:admin-shell' }).`,
        });
      }
    }
  }

  // ─── 컨테이너 패스 (Card / Footer / 영역별 CTA) ───
  //
  // cheerio 의 .find() 는 후손 전체를 검색하므로 중첩 카드 카운팅에 그대로 활용.
  // 카드별 / Footer별 / 영역별 카운트를 도출해 패턴 위반을 잡는다.
  collectContainerViolations(source, $, violations);
  collectSelectedItemsPanelViolations(source, $, violations);

  // ─── 브랜드 화면에서 base nds-header 손수 조립 감지 ───
  //   회고: RunmileWebHeader 가이드가 "HTML 대응 없음" 이라 base <nds-header> 에
  //   로고/메뉴/auth 를 손으로 붙여 브랜드 GNB 를 조립 = 안티패턴. surface 분기도 안 됨.
  //   브랜드 컨텍스트(<html data-brand> 또는 nds-brand-* chrome 사용)가 있는데
  //   base nds-header 에 GNB 자식(logo/menu/auth)을 직접 박았으면 nds-brand-header 로 유도.
  const hasDataBrand = $("html[data-brand], body[data-brand]").length > 0;
  const hasBrandChrome = $("nds-brand-header, nds-brand-footer, nds-brand-bottom-nav").length > 0;
  if (hasDataBrand || hasBrandChrome) {
    $("nds-header").each((_i, el) => {
      if (el.type !== "tag") return;
      const $el = $(el);
      const hasGnbChildren =
        $el.find("nds-header-menu, nds-header-menu-item, nds-header-logo, nds-header-auth-button")
          .length > 0;
      if (!hasGnbChildren) return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      violations.push({
        rule: "manual-brand-header",
        line: lineNumberAt(source, offset),
        selector: describeElement(el as unknown as DomElement),
        detail: "브랜드 화면에서 base <nds-header> 에 로고/메뉴/auth 를 손수 조립함.",
        suggestion:
          "브랜드 헤더는 손수 조립 금지. <nds-brand-header brand='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' active-key='...' asset-base-url='/brand-logos'> 한 줄로 교체하면 로고/메뉴/auth 가 BRAND_DATA 에서 자동 렌더되고 surface 로 PC·모바일·웹뷰가 분기됩니다. get_guide({ topic: 'component:BrandHeader', target: 'html' }) 참조.",
      });
    });
  }

  // ─── 선언 표면(surface) ↔ 화면 chrome 불일치 ───
  //   회고(2026-06): cashwalk-biz 는 admin/service 가 둘 다 intent='html' 로 붕괴해(resolveIntent),
  //   import 기반 context 감지로는 어드민/소비자를 구분 못 한다. 선언된 surface(nudge.surface 마커)를
  //   지배 변수로 삼아, '가입/로그인/온보딩' 같은 화면 이름 통념 때문에 admin 을 소비자 플로우로
  //   오제작하는 것을 차단한다. (표면이 화면 이름 통념을 지배한다.)
  if (surface === "admin") {
    // admin 화면 = admin-shell(사이드바+톱바) 또는 어드민 온보딩(중앙 카드). 소비자 brand chrome 은
    // 마케팅/앱 표면 전용이라 admin 에 쓰이면 표면을 잘못 잡은 것 → error.
    $("nds-brand-header, nds-brand-footer, nds-brand-bottom-nav").each((_i, el) => {
      if (el.type !== "tag") return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      violations.push({
        rule: "admin-surface-consumer-chrome",
        line: lineNumberAt(source, offset),
        selector: describeElement(el as unknown as DomElement),
        detail: `선언된 표면=admin 인데 소비자 brand chrome <${el.tagName.toLowerCase()}> 사용.`,
        suggestion:
          "표면=admin 화면은 소비자 brand chrome(nds-brand-header/footer/bottom-nav)을 쓰지 않는다. admin-shell(사이드바+톱바: get_guide({ topic: 'pattern:admin-shell' })) 또는 어드민 온보딩 카드로 만들 것. 캐포비 어드민 패턴: get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }). 표면 자체가 잘못 선언됐다면 nudge.surface 마커/brief 의 표면을 먼저 확인.",
      });
    });

    // ─── Page Pattern System 브랜드 어드민이면 5종 Page Pattern 중 하나를 선언했는지 강제 ───
    //   (현재 선언 브랜드 = cashwalk-biz. 적용 여부는 브랜드 프로필 admin.pagePatternSystem 이 결정.)
    //   어드민 화면은 Onboarding/Dashboard/List/Detail/Form 5종으로 표준화돼 있다.
    //   "분류 없이 컴포넌트부터 배치하지 않는다"(pattern:cashwalk-biz-page-patterns)를 권고가 아닌
    //   하드 게이트로: 루트(html/body/.mockup-screen)에 data-page-pattern 마커가 없거나 5종이 아니면 error.
    const effBrand =
      canonicalBrandSlug(declaredBrand) ??
      canonicalBrandSlug($("html").attr("data-brand") ?? $("body").attr("data-brand")) ??
      canonicalBrandSlug(($("body").attr("class") ?? "").match(/\bbrand-([a-z0-9-]+)\b/i)?.[1]);
    if (getBrandProfile(effBrand)?.admin?.pagePatternSystem) {
      const markerNodes = $("[data-page-pattern]");
      if (markerNodes.length === 0) {
        violations.push({
          rule: "cashwalk-biz-admin-page-pattern",
          line: 1,
          selector: "<html|body|.mockup-screen>",
          detail:
            "캐포비 어드민 화면(surface=admin, brand=cashwalk-biz)인데 Page Pattern 선언이 없습니다.",
          suggestion: `루트 요소에 data-page-pattern="${CASHWALK_BIZ_PAGE_PATTERNS.join(
            "|",
          )}" 중 하나를 선언하세요(예: <html data-brand="cashwalk-biz" data-page-pattern="list">). 어떤 패턴인지 먼저 고르고 그 골격에 컴포넌트를 끼웁니다 — get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }) 로 5종(Onboarding/Dashboard/List/Detail/Form) 확인.`,
        });
      } else {
        markerNodes.each((_i, el) => {
          if (el.type !== "tag") return;
          const raw = (el as unknown as DomElement).attribs?.["data-page-pattern"] ?? "";
          if (canonicalPagePattern(raw)) return; // 유효 — OK
          const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
          violations.push({
            rule: "cashwalk-biz-admin-page-pattern",
            line: lineNumberAt(source, offset),
            selector: describeElement(el as unknown as DomElement),
            detail: `data-page-pattern="${raw}" 는 캐포비 어드민 5종 패턴이 아닙니다.`,
            suggestion: `허용값: ${CASHWALK_BIZ_PAGE_PATTERNS.join(
              "|",
            )}. get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }) 참조.`,
          });
        });
      }

      // ─── onboarding 패턴은 shell(사이드바/풀하이트 셸) 금지 ───
      //   회고(2026-06): pagePattern '분류 누락'은 하드 게이트지만 onboarding 의 레이아웃 계약
      //   (로그인/아이디·비번 찾기 = 비로그인 진입 화면 → shell 없이 480px 중앙 카드 1개)은
      //   검증 안 됐다. data-page-pattern="onboarding" 으로 선언해 놓고 사이드바/셸을 붙여도
      //   통과하던 빈틈을 닫는다. (분류는 하드, 분류 위반은 소프트이던 비대칭 해소.)
      const declaredPattern = resolveDocumentPagePattern($);
      const isOnboarding = declaredPattern === "onboarding";
      if (isOnboarding) {
        $("nds-sidebar, .nds-shell").each((_i, el) => {
          if (el.type !== "tag") return;
          const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
          const tag = el.tagName.toLowerCase();
          violations.push({
            rule: "cashwalk-biz-onboarding-no-shell",
            line: lineNumberAt(source, offset),
            selector: describeElement(el as unknown as DomElement),
            detail: `data-page-pattern="onboarding" 인데 어드민 shell(<${tag}>)이 있습니다 — 온보딩(로그인·아이디 찾기·비밀번호 찾기)은 비로그인 진입 화면이라 사이드바/풀하이트 셸이 없습니다.`,
            suggestion:
              "온보딩은 shell 없이 탈색 회색 캔버스(--semantic-bg-surface-subtle) 중앙에 480px 고정 카드 1개(로고 → Form → 풀폭 Primary CTA → TextButton 보조링크)로 만듭니다. 사이드바/셸이 정말 필요하면 dashboard/list/detail/form 중 하나로 다시 분류하세요. get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }).",
          });
        });

        // ─── 상단 GNB/글로벌 헤더도 금지 (cashwalk-biz-onboarding-no-gnb) ───
        //   no-shell 룰은 사이드바/풀하이트 셸만 잡아, 상단에 GNB 바(raw <header>/.topbar/nds-header)를
        //   붙여 로고를 텍스트로 박는 회귀를 놓쳤다. 온보딩은 비로그인 진입 화면 → shell 도 GNB 도 없고,
        //   브랜드 식별은 카드 안 <nds-brand-logo> 에셋 하나뿐. nds-brand-header/footer/bottom-nav 는
        //   admin-surface-consumer-chrome 가 따로 잡으므로 여기선 raw/base 헤더만 본다.
        $(
          'header:not(.nds-shell__topbar), nds-header, .gnb, [class*="gnb" i], .topbar, .top-bar, .app-bar, .app-header, .global-nav, .navbar',
        ).each((_i, el) => {
          if (el.type !== "tag") return;
          const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
          const tag = el.tagName.toLowerCase();
          violations.push({
            rule: "cashwalk-biz-onboarding-no-gnb",
            line: lineNumberAt(source, offset),
            selector: describeElement(el as unknown as DomElement),
            detail: `온보딩에 상단 GNB/글로벌 헤더(<${tag}>)가 있습니다 — 온보딩은 shell 도 GNB 도 없는 탈색 캔버스 중앙 카드입니다(텍스트 로고도 금지).`,
            suggestion:
              "온보딩에서 GNB/상단 헤더를 제거하세요. 브랜드 식별은 카드 상단의 <nds-brand-logo brand=\"cashwalk-biz\"> 에셋 하나뿐 — \"cashwalk for business\" 같은 텍스트 로고나 raw <header> 로 GNB 를 조립하지 않습니다. get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }) · get_guide({ topic: 'component:BrandLogo' }).",
          });
        });

        // 중앙 카드+로고 골격 부재는 권고(info). 정적으로 '중앙 카드'를 단정하기 어려우니
        // false-positive 를 줄이려 둘 다(로고·카드) 안 보일 때만 환기한다(명백히 골격 미완).
        const hasLogo =
          $("nds-brand-logo, [data-nds-logo]").length > 0 ||
          $('img[alt*="logo" i], img[src*="logo" i], [class*="logo" i]').length > 0 ||
          $("svg").length > 0;
        const hasCard =
          $('[class*="card" i], nds-card, [data-page-pattern] [class*="box" i]').length > 0;
        if (!hasLogo && !hasCard) {
          violations.push({
            rule: "cashwalk-biz-onboarding-skeleton",
            line: 1,
            selector: "<onboarding root>",
            detail:
              "onboarding 인데 로고/중앙 카드 골격이 안 보입니다 — 온보딩은 로고 + 480px 카드 + 컨텐츠 구조입니다.",
            suggestion:
              "중앙 480px 카드 안에 로고(컴포넌트, raw SVG 금지) → Form → 풀폭 Primary CTA → TextButton 순으로 채웁니다. get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }) 의 골격 그대로 복붙.",
          });
        }

        // ─── 1) 온보딩 카드에 브랜드 로고 컴포넌트가 없음 (onboarding-missing-brand-logo) ───
        //   skeleton 룰은 로고+카드 둘 다 없을 때만 info 로 환기한다. 카드는 있는데 <nds-brand-logo>
        //   만 빠진(=raw img/svg 로고를 조립했거나 아예 누락한) 케이스를 별도 warn 으로 잡는다.
        if ($("nds-brand-logo").length === 0) {
          violations.push({
            rule: "onboarding-missing-brand-logo",
            line: 1,
            selector: "<onboarding root>",
            detail:
              "온보딩 카드에 브랜드 로고가 없음 — <nds-brand-logo> 컴포넌트가 하나도 없습니다.",
            suggestion:
              '<nds-brand-logo brand="cashwalk-biz" height="40"> 로 카드 상단에 박을 것. raw <img>/<svg> 로 로고를 조립하지 말 것. get_guide({ topic: \'component:BrandLogo\' }).',
          });
        }

        // ─── 2) 소셜 로그인을 텍스트/이니셜로 때움 (onboarding-social-bare-text) ───
        //   "소셜"/"간편" 신호가 명확할 때만 발화(보수적). sns-logos 자산이나 google/kakao/naver/apple
        //   식별자(src/class/alt)가 전혀 없으면 → 로고 자산 미사용으로 본다.
        {
          const docText = $("body").text();
          const hasSocialSignal = /소셜|간편/.test(docText);
          if (hasSocialSignal) {
            const hasSnsAsset =
              $('img[src*="sns-logos" i]').length > 0 ||
              $(
                '[src*="google" i], [src*="kakao" i], [src*="naver" i], [src*="apple" i], [class*="google" i], [class*="kakao" i], [class*="naver" i], [class*="apple" i], [alt*="google" i], [alt*="kakao" i], [alt*="naver" i], [alt*="apple" i]',
              ).length > 0;
            if (!hasSnsAsset) {
              violations.push({
                rule: "onboarding-social-bare-text",
                line: 1,
                selector: "<onboarding root>",
                detail:
                  "소셜 로그인을 텍스트/이니셜(G/K/N 등)로 표현 — sns-logos 자산을 쓰지 않았습니다.",
                suggestion:
                  "@nudge-design/assets 의 sns-logos(google/kakao/naver/apple × main/white/black)를 버튼에 넣을 것. get_guide({ topic: 'pattern:social-login' }).",
              });
            }
          }
        }

        // ─── 3) 성공/완료 화면의 민무늬 색 원(체크 없음) (onboarding-success-plain-circle) ───
        //   "완료/성공/심사" 신호가 있을 때만. 초록 계열 배경의 원형 요소인데 그 안에 svg/아이콘/체크
        //   문자가 없으면 → 민무늬 원으로 본다(보수적).
        {
          const docText = $("body").text();
          const hasSuccessSignal = /완료|성공|심사/.test(docText);
          if (hasSuccessSignal) {
            $("[style], [class]").each((_i, el) => {
              if (el.type !== "tag") return;
              const attribs = (el as unknown as DomElement).attribs ?? {};
              const style = (attribs.style ?? "").toLowerCase();
              const cls = (attribs.class ?? "").toLowerCase();
              const blob = `${style} ${cls}`;
              // 원형 신호: border-radius: 50% / ≥9999px, 또는 class 에 circle
              const isCircle =
                /border-radius\s*:\s*(?:50%|[5-9]\d{3,}px|9999px)/.test(style) ||
                /\bcircle\b/.test(cls);
              if (!isCircle) return;
              // 초록 배경 신호 (보수적): green 키워드 또는 success 시멘틱 토큰만 인정
              const greenBg =
                /background[^;]*green/.test(style) || /--semantic-bg-success/.test(blob);
              if (!greenBg) return;
              // 안에 체크/아이콘이 있으면 OK
              const $el = $(el);
              const hasIcon =
                $el.find("svg, nds-icon, [class*='check' i], [class*='icon' i]").length > 0 ||
                /[✓✔]/.test($el.text());
              if (hasIcon) return;
              const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
              violations.push({
                rule: "onboarding-success-plain-circle",
                line: lineNumberAt(source, offset),
                selector: describeElement(el as unknown as DomElement),
                detail: "성공/완료 상태 아이콘에 체크 표시가 없음(민무늬 원).",
                suggestion:
                  "cashwalk-biz-check-circle-on 등 체크 아이콘을 원 안에 넣을 것. find_icon({ query: 'check circle' }).",
              });
            });
          }
        }

        // ─── 4) 인증번호 입력/타이머를 손으로 조립 (verification-manual-assembly) ───
        //   placeholder 에 "인증번호"/"6자리" 가 있거나, 인증 입력 근처에 카운트다운 텍스트(남은 시간
        //   / mm:ss)가 있는데 <nds-verification-code-input> 도 아니고 <nds-field-action-row> 로
        //   감싸이지도 않은 경우.
        {
          const hasVerificationInputComponent = $("nds-verification-code-input").length > 0;
          const hasFieldActionRow = $("nds-field-action-row").length > 0;
          if (!hasVerificationInputComponent && !hasFieldActionRow) {
            const docText = $("body").text();
            const hasCountdown = /남은\s*시간/.test(docText) || /\b\d{1,2}:\d{2}\b/.test(docText);
            let manualVerifInput: DomElement | null = null;
            $("input").each((_i, el) => {
              if (el.type !== "tag") return;
              const ph = ((el as unknown as DomElement).attribs?.placeholder ?? "").toString();
              if (/인증번호|6자리/.test(ph)) {
                if (!manualVerifInput) manualVerifInput = el as unknown as DomElement;
              }
            });
            const phSignal = manualVerifInput !== null;
            if (phSignal || (hasCountdown && $("input").length > 0)) {
              const el =
                manualVerifInput ?? ($("input").get(0) as unknown as DomElement | undefined);
              const offset =
                (el as unknown as { startIndex?: number } | undefined)?.startIndex ?? 0;
              violations.push({
                rule: "verification-manual-assembly",
                line: el ? lineNumberAt(source, offset) : 1,
                selector: el ? describeElement(el) : "<onboarding root>",
                detail: "인증번호 입력/타이머를 손으로 조립.",
                suggestion:
                  "<nds-verification-code-input length=\"6\"> + <nds-countdown-timer> 를 <nds-field-action-row> 로 합성할 것. get_guide({ topic: 'component:FieldActionRow' }).",
              });
            }
          }
        }

        // ─── 5) 약관 동의를 raw 체크박스로 조립 (consent-raw-checkbox) ───
        //   input[type=checkbox] 가 있고 근처(같은 컨테이너) 텍스트에 약관/동의/필수 신호가 있는데
        //   <nds-checkbox>/<nds-checkbox-group> 가 아닌 경우.
        $('input[type="checkbox"]').each((_i, el) => {
          if (el.type !== "tag") return;
          const $el = $(el);
          // 같은 컨테이너(부모) 텍스트로 약관 신호 판정
          const containerText = $el.parent().text();
          if (!/약관|동의|필수/.test(containerText)) return;
          const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
          violations.push({
            rule: "consent-raw-checkbox",
            line: lineNumberAt(source, offset),
            selector: describeElement(el as unknown as DomElement),
            detail:
              "약관 동의를 raw 체크박스로 조립 — [필수]/[선택] 강조·전체동의 indeterminate 가 누락되기 쉽습니다.",
            suggestion:
              "<nds-checkbox-group> (items 에 badge [필수]/[선택]) 로 조립. get_guide({ topic: 'pattern:consent' }).",
          });
        });

        // ─── 6) 온보딩 주 CTA 너비 + 이전버튼 배치 (단일 vs 멀티스텝 구분) ───
        //   온보딩은 두 레이아웃:
        //   · 단일 액션(로그인 등): 카드 안 Primary CTA = 카드 폭 가득(full-width). 모달 hug 와 혼동 금지.
        //   · 멀티스텝(가입 심사 등): 카드 *아래* 분리된 캔버스 푸터 = [이전 단계](좌 outlined hug) +
        //     [다음/제출](우 primary solid hug). 이땐 제출이 hug 라 full-width 를 강제하지 않는다.
        //   멀티스텝 신호 = Back/이전 버튼 존재. (이전버튼이 있으면 푸터-내브로 보고 full-width 면제)
        const onboardingBackButtons = $("nds-button").filter((_i, el) => {
          if (el.type !== "tag") return false;
          return /이전|뒤로/.test($(el).text());
        });
        // 멀티스텝 신호 = (a) 이전/뒤로 nds-button, 또는 (b) Stepper 존재(nds-stepper, 또는
        //   "Step N"/"N단계" 라벨 ≥ 2개). '이전'이 nds-button 이 아니라 텍스트 링크로 들어가
        //   단일 액션으로 오분류되던 빈틈(회귀: 캐포비 가입 멀티스텝)을 Stepper 감지로 닫는다.
        const onboardingBodyText = $("body").text();
        const stepLabels = onboardingBodyText.match(/step\s*[1-9]|[1-9]\s*단계/gi) ?? [];
        const hasStepper = $("nds-stepper").length > 0 || stepLabels.length >= 2;
        const isMultiStepFooter = onboardingBackButtons.length > 0 || hasStepper;

        // ─── 카드 inset 패딩 검사 (onboarding-card-no-padding) ───
        //   onboarding-cta-not-fullwidth 는 full-width 여부만 봐서, 패딩 없는 카드에 full-width CTA 가
        //   카드 모서리에 full-bleed 로 붙어도 통과했다(사용자 지적). 폼/CTA 를 감싼 카드형 요소가
        //   inset 패딩(가이드 48px)을 안 가지면 error. nds-card 는 패딩 내장이라 면제.
        {
          const anchor = ($(
            "nds-button, nds-input, input, nds-radio-group, nds-checkbox-group",
          ).get(0) ?? undefined) as unknown as DomElement | undefined;
          const card = anchor ? nearestCardAncestor($, anchor) : null;
          if (card && (card.tagName ?? "").toLowerCase() !== "nds-card") {
            if (!elementHasInsetPadding(source, card)) {
              const offset = card.startIndex ?? 0;
              violations.push({
                rule: "onboarding-card-no-padding",
                line: lineNumberAt(source, offset),
                selector: describeElement(card),
                detail:
                  "온보딩 카드에 inset 패딩이 없어 컨텐츠/CTA 가 카드 모서리에 붙습니다(full-bleed) — 가이드 카드 padding 48px 미적용.",
                suggestion:
                  "온보딩 카드는 padding 48px(또는 var(--semantic-inset-*))로 컨텐츠를 안쪽으로 들입니다. full-width CTA 도 패딩 안에서 카드 폭을 채워야지 모서리에 붙으면 안 됩니다. 카드를 <nds-card> 로 쓰면 패딩이 자동 적용됩니다. get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }).",
              });
            }
          }
        }

        if (!isMultiStepFooter) {
          // 단일 액션 — 카드 폭 가득(FILL) 강제(error). primary solid 만 본다.
          $("nds-button").each((_i, el) => {
            if (el.type !== "tag") return;
            const attribs = (el as unknown as DomElement).attribs ?? {};
            const color = (attribs.color ?? "primary").toLowerCase();
            const variant = (attribs.variant ?? "solid").toLowerCase();
            if (color !== "primary" || variant !== "solid") return;
            const hasFullWidth =
              attribs["full-width"] !== undefined || attribs["fullwidth"] !== undefined;
            if (hasFullWidth) return;
            const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
            violations.push({
              rule: "onboarding-cta-not-fullwidth",
              line: lineNumberAt(source, offset),
              selector: describeElement(el as unknown as DomElement),
              detail:
                "온보딩 단일 액션 Primary CTA 에 full-width 가 없음 — 모달 단일버튼(우측 hug)과 혼동한 좁은 버튼.",
              suggestion:
                "단일 액션 온보딩 주 CTA 는 카드 폭 가득(FILL) — <nds-button full-width color=\"primary\" ...>. (이전/다음이 있는 멀티스텝이면 카드 아래 분리 푸터에 hug 로.) get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }).",
            });
          });
        } else {
          // 멀티스텝 — [이전 단계] 버튼은 카드(섹션)와 분리해 카드 *아래* 푸터에 둬야 한다.
          //   카드 안에 들어가 있으면 warn (사용자 지적: 하단에 섹션이랑 분리해서 위치).
          onboardingBackButtons.each((_i, el) => {
            if (el.type !== "tag") return;
            const insideCard = $(el).closest('[class*="card" i], nds-card').length > 0;
            if (!insideCard) return;
            const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
            violations.push({
              rule: "onboarding-back-button-inside-card",
              line: lineNumberAt(source, offset),
              selector: describeElement(el as unknown as DomElement),
              detail:
                "온보딩 멀티스텝의 [이전 단계] 버튼이 카드 안에 있음 — 카드(섹션)와 분리해 하단 푸터에 둬야 함.",
              suggestion:
                "멀티스텝 온보딩 푸터는 카드 *아래* 분리된 캔버스 행 — 좌측 [이전 단계](outlined hug) + 우측 [다음/제출](primary solid hug). 카드 안에 넣지 말 것. get_guide({ topic: 'pattern:cashwalk-biz-page-onboarding' }).",
            });
          });

          // 제출(다음) CTA 도 카드 *아래* footer-nav 로 — 카드 안 Primary solid 금지(error).
          //   회귀: 멀티스텝인데 제출 버튼을 카드 안 full-width 로 박아(패딩 없으면 full-bleed) 단일
          //   액션처럼 그림. 멀티스텝 forward CTA = 카드 밖 hug. 인증 전송 등 인라인은 neutral 이라 제외됨.
          $("nds-button").each((_i, el) => {
            if (el.type !== "tag") return;
            const attribs = (el as unknown as DomElement).attribs ?? {};
            const color = (attribs.color ?? "primary").toLowerCase();
            const variant = (attribs.variant ?? "solid").toLowerCase();
            if (color !== "primary" || variant !== "solid") return;
            if (/이전|뒤로/.test($(el).text())) return; // back 버튼은 별도 룰
            if (nearestCardAncestor($, el as unknown as DomElement) == null) return; // 이미 카드 밖 → OK
            const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
            violations.push({
              rule: "onboarding-multistep-cta-inside-card",
              line: lineNumberAt(source, offset),
              selector: describeElement(el as unknown as DomElement),
              detail:
                "멀티스텝 온보딩(Stepper)인데 제출 Primary CTA 가 카드 안에 있습니다 — 카드 *아래* 분리 footer-nav(hug)로 빼야 합니다.",
              suggestion:
                '멀티스텝 제출 버튼은 카드 밖 하단 footer-nav 우측에 hug 로 둡니다 — <nds-button color="primary" variant="solid">제출</nds-button> (full-width 아님, 카드 안 아님). 좌측엔 [이전 단계](outlined hug). get_guide({ topic: \'pattern:cashwalk-biz-page-onboarding\' }).',
            });
          });
        }
      }

      // ─── 캐포비 사이드바 구성 검증 (회귀: 로고+로그인영역 누락 / 높이 안 참) ───
      //   캐포비 어드민 사이드바는 로고 + 계정 블록(이메일→잔액→충전/내역 CTA)이 항상 노출되고
      //   풀하이트 셸 안에 있어야 한다. 가이드 권고로는 매번 빠지던 것을 validator 로 차단.
      //   단, onboarding 은 사이드바 자체가 금지(위 cashwalk-biz-onboarding-no-shell)라 '완성도'
      //   검사는 건너뛴다 — "사이드바를 채워라"가 아니라 "사이드바를 빼라"가 맞는 메시지.
      if (!isOnboarding)
        $("nds-sidebar").each((_i, el) => {
          if (el.type !== "tag") return;
          const attribs = (el as unknown as DomElement).attribs ?? {};
          const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
          const line = lineNumberAt(source, offset);
          const selector = describeElement(el as unknown as DomElement);
          // 로고: 명시 logo-src 또는 brand= 자동주입 둘 다 인정.
          // 계정/푸터: account/footer-actions 속성 또는 <script type="application/json" slot="..."> 자식 둘 다 인정
          //   (신규 ready-made 폼이 한글 JSON 을 텍스트 노드로 전달 — 속성 이스케이프·인코딩 사고 차단).
          const hasLogo = !!attribs["logo-src"]?.trim() || !!attribs["brand"]?.trim();
          const hasAccount =
            !!attribs["account"]?.trim() || $(el).find('script[slot="account"]').length > 0;
          const hasFooterActions =
            !!attribs["footer-actions"]?.trim() ||
            $(el).find('script[slot="footer-actions"]').length > 0;

          if (!hasLogo || !hasAccount) {
            const missing = [
              !hasLogo && "로고(brand 또는 logo-src)",
              !hasAccount && "계정 블록(account)",
            ]
              .filter(Boolean)
              .join(" + ");
            violations.push({
              rule: "cashwalk-biz-sidebar-incomplete",
              line,
              selector,
              detail: `캐포비 어드민 사이드바에 ${missing} 누락 — 로고+로그인영역이 빠진 채 렌더됩니다.`,
              suggestion:
                '<nds-sidebar brand="cashwalk-biz">(로고 자동 주입) + 계정 블록은 <script type="application/json" slot="account">{"email":…,"balanceLabel":…,"balance":…,"actions":[{"label":"충전하기","variant":"solid"},{"label":"내역보기","variant":"outlined"}]}</script> 로 채울 것. ready-made: get_guide({ topic: \'pattern:cashwalk-biz-admin-sidebar\' }) 의 HTML 그대로 복붙(brand/account/footer-actions 이미 포함). 35KB data URI 를 logo-src 에 붙이거나 header 에 raw div 로 손수 조립하지 말 것.',
            });
          }

          if (!hasFooterActions) {
            violations.push({
              rule: "cashwalk-biz-sidebar-logout",
              line,
              selector,
              detail: "캐포비 어드민 사이드바에 로그아웃(footer-actions) 누락.",
              suggestion:
                '<nds-sidebar footer-actions=\'[{"label":"로그아웃","variant":"outlined"}]\'> 로 최하단 고정 로그아웃을 둘 것 (메뉴 item 으로 섞지 말 것).',
            });
          }

          // 풀하이트 셸(.nds-shell) 밖이면 100vh 가 화면을 못 채우거나 레이아웃이 깨진다.
          if ($(el).closest(".nds-shell").length === 0) {
            violations.push({
              rule: "cashwalk-biz-sidebar-shell",
              line,
              selector,
              detail:
                "사이드바가 풀하이트 셸(.nds-shell) 밖에 있습니다 — full-height(100vh)가 화면을 못 채우거나 레이아웃이 깨집니다.",
              suggestion:
                '<div class="nds-shell" data-brand="cashwalk-biz"><nds-sidebar .../><main class="nds-shell__main">…</main></div> 형태로 감쌀 것. get_guide({ topic: \'pattern:admin-shell\' }) 또는 pattern:cashwalk-biz-admin-sidebar 의 셸 예시 참조.',
            });
          }
        });
    }
  } else if (surface === "service") {
    // 역방향(warn): 소비자 화면에 어드민 사이드바를 쓰면 표면을 잘못 잡았을 가능성.
    $("nds-sidebar").each((_i, el) => {
      if (el.type !== "tag") return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      violations.push({
        rule: "service-surface-admin-shell",
        line: lineNumberAt(source, offset),
        selector: describeElement(el as unknown as DomElement),
        detail: "선언된 표면=service 인데 어드민 사이드바(nds-sidebar) 사용.",
        suggestion:
          "표면=service(소비자) 화면은 어드민 사이드바 대신 브랜드 chrome(nds-brand-header/footer/bottom-nav)을 쓴다. 정말 어드민 화면이라면 표면 선언(nudge.surface)을 admin 으로 바로잡을 것.",
      });
    });
  }

  // ─── 미지 브랜드 slug (회고: cashpobi → base 블루 폴백) ───
  //   data-brand / <body class="brand-*"> 로 브랜드를 선언했는데 정식 slug 가 아니면
  //   loadStandaloneAssets 가 base(nudge-eap)로 조용히 폴백 → 색이 기본값으로 잘못 렌더된다.
  //   별칭(canonicalBrandSlug)으로 정규화해도 정식 brand 가 아니면 error 로 잡아 교정 유도.
  {
    const declared =
      $("html").attr("data-brand") ??
      $("body").attr("data-brand") ??
      ($("body").attr("class") ?? "").match(/\bbrand-([a-z0-9-]+)\b/i)?.[1];
    if (declared?.trim()) {
      let known: string[] = [];
      try {
        known = listStandaloneBrands();
      } catch {
        known = []; // manifest 없으면(단위 테스트 등) 룰 skip
      }
      const canonical = canonicalBrandSlug(declared);
      if (known.length > 0 && (!canonical || !known.includes(canonical))) {
        violations.push({
          rule: "unknown-brand-slug",
          line: 1,
          selector: `data-brand="${declared.trim()}"`,
          detail: `미지 브랜드 slug '${declared.trim()}' — base 로 폴백돼 색이 기본값(블루)으로 렌더됩니다.`,
          suggestion: `정식 slug 로 교정: ${known.join(", ")}. (예: cashpobi/cashwalk → cashwalk-biz)`,
        });
      }
    }
  }

  // ─── 헤딩 안 장식 아이콘 (descendant scan) ───
  for (const headingTag of ["h3", "h4"] as const) {
    $(headingTag).each((_i, el) => {
      if (el.type !== "tag") return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      const line = lineNumberAt(source, offset);
      const selector = describeElement(el);
      const hasSvg = $(el).find("svg").length > 0;
      if (hasSvg) {
        violations.push({
          rule: "heading-decorative-icon",
          line,
          selector,
          detail: `<${headingTag}> 안에 <svg> 발견`,
          suggestion: `<${headingTag}> 안에 SVG / 아이콘 사용 금지 — 헤딩은 텍스트만.`,
        });
      }
    });
  }

  // ─── 문서-레벨 카운트 룰 ───
  //   여러 디바이스 프레임(.mockup-screen)을 한 파일에 그리면 같은 화면이 N벌 반복되므로
  //   "화면당 1개" 류 카운트 임계값을 프레임 수만큼 비례 확대한다(프레임 1개 = 기존과 동일).
  const screenCount = Math.max(1, $(".mockup-screen").length);
  collectDocumentLevelViolations(source, $, violations, screenCount, {
    surface,
    brand: documentBrand,
    pagePattern,
  });

  // E1: DS 반영도(dsRatio) 최소선 게이트.
  //   "DS 반영"이 보고만 되고 강제되지 않던 구멍을 막는다 — nds-* 1개만 있어도 통과하던 문제.
  //   단순 화면(DS 대상 요소가 적음)은 면제해 억울한 차단을 막고(결정: 경고+자동재시도),
  //   대상이 충분한데 반영도가 바닥이면 error 로 띄워 기존 자동수정 루프(hasErrors)가 재시도하게 한다.
  //   build_singlefile_html 은 ok 를 뒤집지 않으므로 빌드/익스포트 자체를 막지는 않는다.
  const dsAdopted = ndsTagCount + ndsClassCount;
  const dsEligible = dsAdopted + nativeUnwrappedCount + avoidableReinventionCount;
  if (dsEligible >= LOW_DS_MIN_ELIGIBLE) {
    const dsRatio = Math.round((dsAdopted / dsEligible) * 100);
    if (dsRatio < LOW_DS_FLOOR) {
      const reinvNote =
        avoidableReinventionCount > 0
          ? ` + 회피가능 재발명 ${avoidableReinventionCount}개(raw landmark / role·onclick 위젯)`
          : "";
      violations.push({
        rule: "low-ds-ratio",
        line: 1,
        selector: "<html>",
        severity: "error",
        detail: `DS 반영도 ${dsRatio}% (nds ${dsAdopted} / 대상 ${dsEligible}) — 최소 ${LOW_DS_FLOOR}% 미달. native ${nativeUnwrappedCount}개가 nds-* 로 미교체${reinvNote}.`,
        suggestion:
          "native <button>/<input>/<select>/<textarea> 를 nds-* 로 교체하고 raw 색/여백을 토큰으로 바꿔 DS 반영도를 올리세요. " +
          "convert_html_to_ds_html 으로 1차 변환 후 손으로 마감, find_component({ query }) 로 매핑. " +
          "HTML 목업을 DS 로 옮기는 작업이면 get_guide({ topic: 'pattern:html-mockup-intake' }) 워크플로우를 따르세요.",
      });
    }
  }

  // push 시점에 severity 를 명시하지 않은 violation 은 RULE_SEVERITY 에서 채운다.
  for (const v of violations) {
    if (!v.severity) v.severity = severityFor(v.rule);
  }
  return violations;
}

function hasAncestorNdsTag(el: DomElement): boolean {
  let cur: DomElement | null = (el as unknown as { parent?: DomElement }).parent ?? null;
  while (cur) {
    if (cur.type === "tag" && cur.tagName?.toLowerCase().startsWith("nds-")) return true;
    cur = (cur as unknown as { parent?: DomElement }).parent ?? null;
  }
  return false;
}

/* ───────── public tool entry ───────── */

export interface ValidateHtmlMockupArgs {
  source?: string;
  filePath?: string;
  /** 워크스페이스 루트(nudge.surface / nudge.brand 마커 탐색 시작점). 없으면 filePath 의 디렉토리에서 위로 탐색. */
  cwd?: string;
  /** 선언된 제작 표면. 없으면 nudge.surface 마커에서 읽는다. 화면 이름 통념을 지배. */
  surface?: HtmlSurface;
  /** 브랜드 slug. 없으면 nudge.brand 마커 → HTML data-brand 순으로 읽는다. 캐포비 어드민 패턴 게이트 입력. */
  brand?: string;
}

/**
 * nudge.brand 마커를 startDir 에서 위로 최대 5단계 탐색해 선언된 브랜드를 읽는다.
 * (readSurfaceMarker 와 동일 SSOT 패턴 — build-html 의 resolveHtmlBrand 가 nudge.brand 를 읽는 것과 일치.)
 */
export function readBrandMarker(startDir: string): string | null {
  let dir = startDir;
  for (let i = 0; i < 5; i++) {
    const marker = path.join(dir, "nudge.brand");
    if (fs.existsSync(marker)) {
      try {
        const value = fs.readFileSync(marker, "utf-8").trim();
        if (value) return value;
      } catch {
        // ignore — 폴백
      }
      return null;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * nudge.surface 마커를 startDir 에서 위로 최대 5단계 탐색해 선언된 표면을 읽는다.
 * (build-html 의 resolveHtmlBrand 가 nudge.brand 를 cwd 에서 읽는 것과 동일 SSOT 패턴.)
 */
export function readSurfaceMarker(startDir: string): HtmlSurface {
  let dir = startDir;
  for (let i = 0; i < 5; i++) {
    const marker = path.join(dir, "nudge.surface");
    if (fs.existsSync(marker)) {
      try {
        const value = fs.readFileSync(marker, "utf-8").trim();
        if (value === "admin" || value === "service") return value;
      } catch {
        // ignore — 폴백
      }
      return null;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * nudge.pagePattern 마커를 startDir 에서 위로 최대 5단계 탐색해 선언된 캐포비 Page Pattern 을 읽는다.
 * (readSurfaceMarker 와 동일 SSOT 패턴 — 데스크탑 intake 추천 카드에서 사용자가 고른 패턴을 이 마커로
 *  박아두면, save_design_spec 가 screen.pagePattern 미선언 시 여기서 자동 주입한다.)
 */
export function readPagePatternMarker(startDir: string): CashwalkBizPagePattern | undefined {
  let dir = startDir;
  for (let i = 0; i < 5; i++) {
    const marker = path.join(dir, "nudge.pagePattern");
    if (fs.existsSync(marker)) {
      try {
        const value = fs.readFileSync(marker, "utf-8").trim();
        return canonicalPagePattern(value);
      } catch {
        // ignore — 폴백
      }
      return undefined;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

/** 결정적 품질 점수 차원 (Kraft 코드기반 scorer 미러, animation 제외). */
export type ScoreDimension = "color" | "typography" | "spacing" | "layout" | "component" | "icon";

export interface MockupScores {
  /** 0~100. 6개 차원 평균(반올림). */
  overall: number;
  dimensions: Record<ScoreDimension, number>;
}

const SCORE_DIMENSIONS: ScoreDimension[] = [
  "color",
  "typography",
  "spacing",
  "layout",
  "component",
  "icon",
];

/** rule → 품질 차원. 매핑 안 된 rule 은 점수에 반영 안 함(보수적). */
const RULE_DIMENSION: Record<string, ScoreDimension> = {
  // color (color-tokens): raw 색·미지 토큰·그라데이션·과한 brand/tone-on-tone 색
  "inline-color": "color",
  "unknown-token": "color",
  "gradient-banned": "color",
  "tone-on-tone-filled": "color",
  "brand-bg-overuse": "color",
  "primary-color-role-overload": "color",
  // typography
  "repeated-h1": "typography",
  "repeated-h2": "typography",
  "bold-overuse": "typography",
  "mojibake-encoding": "typography",
  // spacing (spacing-rules)
  "inline-spacing": "spacing",
  "non-4pt-spacing": "spacing",
  "non-semantic-spacing": "spacing",
  "nds-host-box-style": "spacing",
  "card-slot-double-padding": "spacing",
  // layout (layout-structure): 카드 중첩·CTA 위계·칩 과다·장식
  "cashwalk-biz-sidebar-shell": "layout",
  "cashwalk-biz-admin-page-pattern": "layout",
  "brand-modal-single-button-fullwidth": "layout",
  "brand-modal-confirm-cta": "layout",
  "brand-modal-footer-stacked": "layout",
  "raw-landmark": "layout",
  "nested-card": "layout",
  "card-badge-overuse": "layout",
  "card-footer-button-overuse": "layout",
  "primary-cta-per-container": "layout",
  "primary-cta-overuse": "layout",
  "chip-overuse": "layout",
  "region-as-chip": "layout",
  "selected-item-add-affordance-duplicated": "layout",
  "selected-item-row-duplicated": "layout",
  "selected-item-row-outside-panel": "layout",
  "selected-items-modal-missing-panel": "layout",
  "selected-items-helper-outside-form-field": "layout",
  "card-everything": "layout",
  "decorative-shadow": "layout",
  "visual-emphasis-overload": "layout",
  "raw-shell-pattern": "layout",
  // component (component-compliance): DS 미사용·브랜드 크롬·attr enum·뱃지
  "native-interactive": "component",
  "low-ds-ratio": "component",
  "manual-brand-header": "component",
  "admin-surface-consumer-chrome": "component",
  "service-surface-admin-shell": "component",
  "cashwalk-biz-sidebar-incomplete": "component",
  "cashwalk-biz-sidebar-logout": "component",
  "unknown-brand-slug": "component",
  "non-inlinable-img-src": "component",
  "unknown-nds-tag": "component",
  "unknown-nds-class": "component",
  "invalid-nds-attr-value": "component",
  "nds-json-attr-unparseable": "component",
  "ds-badge-missing": "component",
  "neutral-solid-cta": "component",
  "brand-denied-button-color": "component",
  "button-without-interaction": "component",
  "date-as-text-input": "component",
  "amount-as-text-input": "component",
  "address-as-text-input": "component",
  "amount-as-static-display": "component",
  "avoidable-reinvention": "component",
  "nds-custom-element-content-mutation": "component",
  "cashwalk-biz-gender-selection-control": "component",
  "onboarding-missing-brand-logo": "component",
  "onboarding-social-bare-text": "component",
  "onboarding-success-plain-circle": "component",
  "verification-manual-assembly": "component",
  "consent-raw-checkbox": "component",
  // icon (icon-usage): 이모지/기호·인라인 svg·heading 장식 아이콘
  "emoji-banned": "icon",
  "text-symbol-banned": "icon",
  "text-icon-substitute": "icon",
  "inline-svg": "icon",
  "heading-decorative-icon": "icon",
};

const SCORE_SEVERITY_PENALTY: Record<HtmlViolationSeverity, number> = {
  error: 20,
  warn: 8,
  info: 3,
};

/** 위반 집계(violationsByRule) → 차원별 0~100 점수 + overall. 순수·결정적. */
export function computeScores(byRule: ValidateHtmlMockupResult["violationsByRule"]): MockupScores {
  const penalty: Record<ScoreDimension, number> = {
    color: 0,
    typography: 0,
    spacing: 0,
    layout: 0,
    component: 0,
    icon: 0,
  };
  for (const r of byRule) {
    const dim = RULE_DIMENSION[r.rule];
    if (!dim) continue;
    penalty[dim] += r.count * (SCORE_SEVERITY_PENALTY[r.severity] ?? 5);
  }
  const dimensions: Record<ScoreDimension, number> = {
    color: 0,
    typography: 0,
    spacing: 0,
    layout: 0,
    component: 0,
    icon: 0,
  };
  for (const d of SCORE_DIMENSIONS) dimensions[d] = Math.max(0, 100 - penalty[d]);
  const overall = Math.round(
    SCORE_DIMENSIONS.reduce((s, d) => s + dimensions[d], 0) / SCORE_DIMENSIONS.length,
  );
  return { overall, dimensions };
}

/** validate 가 실행 못 됐을 때(빌드 폴백 등) 쓰는 중립 만점 스코어. */
export const NEUTRAL_SCORES: MockupScores = {
  overall: 100,
  dimensions: { color: 100, typography: 100, spacing: 100, layout: 100, component: 100, icon: 100 },
};

export interface ValidateHtmlMockupResult {
  ok: boolean;
  /** 각 violation. 동일 rule 의 6번째 위반부터는 detail/suggestion 생략 (line 만 보존). */
  violations: HtmlViolation[];
  /** rule 별 총 카운트 + 발생 line 목록. 트림된 violations[] 와 무관하게 정확한 집계. */
  violationsByRule: Array<{
    rule: string;
    count: number;
    severity: HtmlViolationSeverity;
    /** 룰 분류(invariant/model-guard/brand-policy) — 텔레메트리 rule-stats 조인·수명 정책용. */
    kind?: RuleKind;
    lines: number[];
  }>;
  /** severity 별 집계. 사용자가 error 부터 우선 처리할 수 있도록 응답 상단에 노출. */
  severitySummary: {
    error: number;
    warn: number;
    info: number;
    /** error 가 1개 이상이면 true — ship 차단 권장. */
    hasErrors: boolean;
  };
  /** 차원별 0~100 품질 점수 + overall. 위반에서 결정적으로 환산(computeScores). */
  scores: MockupScores;
  jsxOnlyNotice: string;
}

/**
 * 응답 크기 cap. 같은 rule 이 N건씩 터지면 detail/suggestion 텍스트가 누적돼 응답이 폭주한다.
 * - selector 는 HTML 한 줄 통째로 들어올 수 있어 길이만 cap
 * - 룰별 첫 N개는 full 객체로, 그 뒤는 line 만 (rule/detail/suggestion 은 첫 객체와 동일하므로 생략)
 * 결과적으로 응답 토큰을 절반 이하로 줄이면서도 위반 위치/패턴 식별에는 충분.
 */
const SELECTOR_MAX_LENGTH = 120;
const FULL_SAMPLES_PER_RULE = 5;

function trimViolationsForResponse(violations: HtmlViolation[]): HtmlViolation[] {
  const seenPerRule = new Map<string, number>();
  return violations.map((v) => {
    const count = seenPerRule.get(v.rule) ?? 0;
    seenPerRule.set(v.rule, count + 1);
    const selector =
      v.selector && v.selector.length > SELECTOR_MAX_LENGTH
        ? v.selector.slice(0, SELECTOR_MAX_LENGTH) + "…"
        : v.selector;
    if (count < FULL_SAMPLES_PER_RULE) {
      return { ...v, selector };
    }
    // 같은 rule 의 N+1 번째부터는 line 만 (severity / detail / suggestion 은 sample 과 동일).
    // 주의: 첫 N(=5)건은 full 유지 — raw-landmark 처럼 같은 rule 이라도 위반마다 suggestion 이
    // 다른 케이스(header→BrandHeader / footer→BrandFooter)가 있어 무조건 dedup 하면 신호가 샌다.
    return {
      rule: v.rule,
      line: v.line,
      ...(v.severity ? { severity: v.severity } : {}),
      ...(selector ? { selector } : {}),
    };
  });
}

function summarizeByRule(
  violations: HtmlViolation[],
): ValidateHtmlMockupResult["violationsByRule"] {
  const byRule = new Map<string, { severity: HtmlViolationSeverity; lines: number[] }>();
  for (const v of violations) {
    const entry = byRule.get(v.rule) ?? {
      severity: v.severity ?? severityFor(v.rule),
      lines: [],
    };
    entry.lines.push(v.line);
    byRule.set(v.rule, entry);
  }
  const SEVERITY_ORDER: Record<HtmlViolationSeverity, number> = { error: 0, warn: 1, info: 2 };
  return Array.from(byRule.entries())
    .map(([rule, { severity, lines }]) => ({
      rule,
      severity,
      ...(RULE_META[rule] ? { kind: RULE_META[rule].kind } : {}),
      count: lines.length,
      lines,
    }))
    .sort((a, b) => {
      const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      if (sev !== 0) return sev;
      return b.count - a.count;
    });
}

function summarizeSeverity(
  violations: HtmlViolation[],
): ValidateHtmlMockupResult["severitySummary"] {
  let error = 0;
  let warn = 0;
  let info = 0;
  for (const v of violations) {
    const sev = v.severity ?? severityFor(v.rule);
    if (sev === "error") error += 1;
    else if (sev === "warn") warn += 1;
    else info += 1;
  }
  return { error, warn, info, hasErrors: error > 0 };
}

export function validateHtmlMockup(args: ValidateHtmlMockupArgs): ValidateHtmlMockupResult {
  let source = args.source;
  let markerStartDir = args.cwd;
  if (!source && args.filePath) {
    const p = path.resolve(args.filePath);
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    source = fs.readFileSync(p, "utf-8");
    if (!markerStartDir) markerStartDir = path.dirname(p);
  }
  if (!source) {
    throw new Error("Provide either `source` (HTML string) or `filePath`.");
  }
  // 선언 표면: 명시 인자 > nudge.surface 마커. 화면 이름 통념을 지배(표면 불일치 룰의 입력).
  const surface: HtmlSurface =
    args.surface ?? (markerStartDir ? readSurfaceMarker(markerStartDir) : null);
  // 브랜드: 명시 인자 > nudge.brand 마커 (없으면 validateHtmlSource 가 HTML data-brand 로 폴백).
  const brand =
    args.brand ?? (markerStartDir ? (readBrandMarker(markerStartDir) ?? undefined) : undefined);
  const rawViolations = validateHtmlSource(source, { surface, brand });
  const violations = trimViolationsForResponse(rawViolations);
  const violationsByRule = summarizeByRule(rawViolations);
  const severitySummary = summarizeSeverity(rawViolations);
  return {
    ok: rawViolations.length === 0,
    violations,
    violationsByRule,
    severitySummary,
    scores: computeScores(violationsByRule),
    jsxOnlyNotice:
      "이 검사는 HTML 정적 룰만 — JSX 전용(antd/외부 아이콘 import 잔존, Chip.label 속성, 화살표 아이콘 식별, IconButton size 등 prop 의미)은 .tsx 의 validate_mockup 으로 별도 확인하세요. " +
      "응답 cap: 같은 룰 첫 " +
      FULL_SAMPLES_PER_RULE +
      "건만 full, 그 뒤는 line 만(룰별 총계는 violationsByRule).",
  };
}
