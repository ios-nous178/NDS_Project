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
 *  - raw-shell-pattern    : <style> 안 raw .page / .topbar / .section / .form-row 정의 (admin-shell 가이드 위반)
 *
 * 검출 룰 (JSX 에서 포팅 — 컨테이너 / 카운팅 / 시각 위계):
 *  - card-slot-double-padding   : <nds-card-header|body|footer> 에 외곽 padding
 *  - assistive-solid-cta        : <nds-button color="assistive"> 가 solid (variant 미지정)
 *  - heading-decorative-icon    : <h3>/<h4> 안에 <svg> / icon 들어감
 *  - nested-card                : <nds-card> 안에 <nds-card>
 *  - card-badge-overuse         : 1 nds-card 안 nds-chip + nds-badge ≥ 3
 *  - card-footer-button-overuse : nds-card-footer 안 nds-button ≥ 3
 *  - primary-cta-per-container  : 영역 1개 안 primary solid nds-button > 1
 *  - cashwalk-biz-modal-single-button-fullwidth : 캐포비 모달 단일 footer 버튼이 full-width (우측 hug 여야 함)
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
 */

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import {
  canonicalBrandSlug,
  canonicalPagePattern,
  CASHWALK_BIZ_PAGE_PATTERNS,
  type CashwalkBizPagePattern,
  listStandaloneBrands,
} from "./standalone-assets.js";

/**
 * cheerio 의 element 노드 — 직접 type import 없이 구조만. cheerio Element 는
 * .parent 가 Document 일 수도 있어 우리 좁은 타입과 완전 호환은 아니지만,
 * .each 콜백이 넘기는 노드는 항상 tag 노드라 안전하게 cast 한다.
 */
interface DomElement {
  type: string;
  tagName: string;
  attribs: Record<string, string>;
  parent?: unknown;
  startIndex?: number | null;
}

export type HtmlViolationSeverity = "error" | "warn" | "info";

/** 선언된 제작 표면. 화면 이름 통념(가입/로그인=소비자)보다 우선하는 지배 변수. */
export type HtmlSurface = "service" | "admin" | null;

export interface HtmlViolation {
  rule: string;
  line: number;
  selector?: string;
  /**
   * 위반 설명. 응답 트림 시 같은 rule 의 N+1 번째부터 생략 — 동일 rule 의 첫 sample 에서 같은 텍스트 확인 가능.
   * 내부 validateHtmlSource() 가 반환할 때는 항상 채워짐.
   */
  detail?: string;
  suggestion?: string;
  /**
   * 사용자가 우선순위를 정할 수 있도록 violation 의 무게를 표시.
   *  - error : DS 컨트랙트 위반. 디자이너/PM 이 받았을 때 명백한 결함 (DS 컴포넌트 미사용, native landmark, 알 수 없는 토큰 등).
   *  - warn  : 시각 위계 / 패턴 가이드 위반. 케이스에 따라 의도된 trade-off 일 수 있음 (chip-overuse 등).
   *  - info  : 정보성 권고.
   *
   * 미지정으로 push 된 violation 은 finalizeViolations() 에서 RULE_SEVERITY 기반 기본값으로 채워진다.
   * (raw-landmark 처럼 컨텍스트에 따라 severity 가 달라지는 룰은 push 시점에 명시.)
   */
  severity?: HtmlViolationSeverity;
}

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
const RULE_SEVERITY: Record<string, HtmlViolationSeverity> = {
  // contract / DS 미사용
  "native-interactive": "error",
  // DS 반영도(dsRatio)가 최소선 미달 — "DS 반영"을 강제하는 집계 게이트(E1).
  "low-ds-ratio": "error",
  "raw-landmark": "warn",
  // 브랜드 화면인데 base nds-header 를 손수 조립 (회고: brand chrome 미사용 안티패턴)
  "manual-brand-header": "warn",
  // 선언 표면=admin 인데 소비자 brand chrome(header/footer/bottom-nav) 사용 (회고: 가입 admin 화면을 소비자 플로우로 오제작)
  "admin-surface-consumer-chrome": "error",
  // 선언 표면=service 인데 어드민 사이드바(nds-sidebar) 사용 — 표면 불일치(역방향)
  "service-surface-admin-shell": "warn",
  // 캐포비 어드민(surface=admin + brand=cashwalk-biz)인데 5종 Page Pattern 중 하나를 선언 안 함 / 미지 값
  "cashwalk-biz-admin-page-pattern": "error",
  // 캐포비 사이드바인데 로고 / 계정 블록(account slot) 누락 — 회귀 #1(로고+로그인영역 유실)
  "cashwalk-biz-sidebar-incomplete": "error",
  // 캐포비 사이드바인데 로그아웃(footer-actions) 누락 — 권고
  "cashwalk-biz-sidebar-logout": "warn",
  // 사이드바가 풀하이트 셸(.nds-shell) 밖 — 100vh 가 화면을 못 채움(회귀: 높이 안 참)
  "cashwalk-biz-sidebar-shell": "error",
  // 캐포비 모달 단일 버튼은 우측 정렬 hug 검정 pill — full-width 금지(회귀: 퍼포멘토 등의 full-width 를 잘못 가져옴)
  "cashwalk-biz-modal-single-button-fullwidth": "warn",
  // data-brand / brand-* 에 미지 slug → base(블루)로 조용히 폴백돼 색이 틀림 (회고: cashpobi)
  "unknown-brand-slug": "error",
  // 단일 파일 빌드에 inline 안 되는 로컬 이미지 경로 (회고: 내부/외부 모두 깨짐)
  "non-inlinable-img-src": "warn",
  "unknown-nds-tag": "error",
  "unknown-nds-class": "error",
  "invalid-nds-attr-value": "error",
  // nds-* 의 JSON 속성(items/options/reward 등)이 파싱 불가 — 컴포넌트가 조용히 빈 값 렌더(메뉴 유실)
  "nds-json-attr-unparseable": "error",
  // UTF-8 한글을 Latin-1/unicode_escape 로 잘못 디코딩 → 모지바케(Ã/ë…). 깨진 JSON 도 파싱은 되므로
  // nds-json-attr-unparseable 로는 안 잡힘 (회귀: 사이드바 한글 전부 깨짐 + 로고 유실)
  "mojibake-encoding": "error",
  // 선택한 지역(시/도 > 시/군/구)을 Chip 으로 인라인 표현 — SelectionButton 과 혼동 + 제거/개수
  // affordance 누락. SelectedItemsPanel + RegionRow 로 그려야 함 (회귀: 캐포비 타겟팅 폼)
  "region-as-chip": "warn",
  // SelectedItemsPanel 바로 아래 helper 텍스트를 sibling 으로 붙이면 패널과 helper 가 붙어 보임.
  // FormField helper 슬롯/속성으로 넣어 control gap 을 타게 해야 함 (회귀: 캐포비 타겟팅 폼).
  "selected-items-helper-outside-form-field": "error",
  // 목업 버튼은 장식이 아니라 실제 동작해야 함. 정적 검증에서는 버튼별 식별자와
  // addEventListener/click/submit 연결 근거를 확인한다.
  "button-without-interaction": "error",
  // 날짜/기간을 raw text input(placeholder 'YYYY-MM-DD')으로 구현 — DatePicker/DateRangePicker 미사용
  "date-as-text-input": "warn",
  // 금액/수량을 일반 input 으로 구현 — AmountInput(콤마·단위·clamp) 미사용
  "amount-as-text-input": "warn",
  // 입력 필드 자리에 정적 숫자(콤마+단위)를 박음 — 폼 값인데 AmountInput 이 아님(회귀: 캐포비 '목표 참여자 수')
  "amount-as-static-display": "warn",
  // 지역 선택 add 어포던스 중복(외부 '지역 추가' + 패널 '추가 선택') — 모달 1개로 통일해야 함
  "region-add-affordance-duplicated": "warn",
  // SelectedItemsPanel 안에 같은 지역 행이 중복 — 선택 결과는 유니크해야 함
  "region-row-duplicated": "warn",
  "unknown-token": "error",
  "ds-badge-missing": "error",
  // 토큰 / 시멘틱
  "inline-color": "error",
  "inline-spacing": "warn",
  "non-4pt-spacing": "warn",
  "non-semantic-spacing": "warn",
  // 금지 패턴
  "gradient-banned": "error",
  "emoji-banned": "error",
  "text-symbol-banned": "error",
  "text-icon-substitute": "error",
  // 아이콘 / 시각
  // inline-svg = info(권고). find_icon 이 HTML 용으로 내려주는 DS 아이콘 인라인은 불가피한
  // 정상 패턴이라 게이트 점수를 깎으면 안 됨(warn=8 → info=3). standalone <svg> 권고로만 노출.
  "inline-svg": "info",
  "heading-decorative-icon": "warn",
  // 컨테이너 / 카운팅
  "card-slot-double-padding": "warn",
  "assistive-solid-cta": "warn",
  "nested-card": "warn",
  "card-badge-overuse": "warn",
  "card-footer-button-overuse": "warn",
  "primary-cta-per-container": "warn",
  "primary-cta-overuse": "warn",
  "chip-overuse": "warn",
  "card-everything": "warn",
  "repeated-h1": "error",
  "repeated-h2": "warn",
  "bold-overuse": "warn",
  "brand-bg-overuse": "warn",
  "decorative-shadow": "warn",
  "tone-on-tone-filled": "warn",
  "visual-emphasis-overload": "warn",
  "primary-color-role-overload": "warn",
  // admin-shell 강제 (pattern:admin-shell)
  "raw-shell-pattern": "error",
};

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

// E1 low-ds-ratio 게이트 파라미터.
//   MIN_ELIGIBLE: DS 대상(nds 채택 + native 미교체) 요소가 이 수 미만이면 단순 화면으로 보고 면제 —
//   폼 1개짜리 화면이 억울하게 막히지 않도록 한다. FLOOR: DS 반영 최소 비율(%).
const LOW_DS_MIN_ELIGIBLE = 4;
const LOW_DS_FLOOR = 50;

const STRICT_SYMBOL_RE = /[→←↑↓↔↕➜➔⮕›‹»«▶◀▲▼◆◇✓✗✘✕☑☒★☆⭐♥♡❤•]/;
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
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

function describeElement(el: DomElement): string {
  const tag = el.tagName;
  const cls = (el.attribs?.class ?? "").split(/\s+/).filter(Boolean).slice(0, 2);
  const id = el.attribs?.id;
  let s = `<${tag}`;
  if (id) s += `#${id}`;
  if (cls.length > 0) s += `.${cls.join(".")}`;
  s += ">";
  return s;
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
  const $ = cheerio.load(source, { xmlMode: false });
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

  // 모든 element 순회 — style / class / svg / native button 검사
  $("*").each((_idx, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    const attrs = el.attribs ?? {};
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);

    // E1 집계: DS 반영도 — nds-* 태그 / 실재 nds 클래스(채택) 카운트.
    if (tag.startsWith("nds-")) {
      ndsTagCount++;
    } else {
      const elClasses = (attrs.class ?? "").split(/\s+/).filter(Boolean);
      const ndsBase = elClasses.find(
        (c) => /^nds-[a-z0-9-]+$/.test(c) && !c.includes("__") && !c.includes("--"),
      );
      // 실재 nds 클래스만 채택으로 카운트(E4 와 동일 기준) — 가짜 nds-foo 로 비율 부풀리기 차단.
      if (ndsBase && (ctx.ndsClassPrefixSet.size === 0 || ctx.ndsClassPrefixSet.has(ndsBase))) {
        ndsClassCount++;
      }
    }

    // 1. style="..." 검사
    if (attrs.style) {
      checkStyleString(attrs.style, line, selector, ctx, violations);
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

    // 7. nds-button color="assistive" + solid(default) — cool-gray 배경이라 비활성처럼 보임.
    //    명시적으로 variant 가 outlined/soft/text 계열이면 OK.
    if (tag === "nds-button" && attrs.color === "assistive") {
      const variant = attrs.variant;
      const isNonSolid =
        variant === "outlined" ||
        variant === "outlined-sub" ||
        variant === "soft" ||
        variant === "text" ||
        variant === "ghost";
      if (!isNonSolid) {
        violations.push({
          rule: "assistive-solid-cta",
          line,
          selector,
          detail: `<nds-button color="assistive">${variant ? ` variant="${variant}"` : ""}`,
          suggestion:
            'nds-button color="assistive" + solid 는 비활성처럼 보임. 활성 CTA 면 color="primary"/"secondary", 보조면 variant="outlined" 또는 "text". get_guide({ topic: \'component:Button\' }) 참조.',
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

    // ─── 캐포비 어드민이면 5종 Page Pattern 중 하나를 선언했는지 강제 ───
    //   캐시워크 포 비즈니스는 DS 안에 자체 admin 디자인 시스템을 가진 유일한 브랜드라,
    //   어드민 화면은 Onboarding/Dashboard/List/Detail/Form 5종으로 표준화돼 있다.
    //   "분류 없이 컴포넌트부터 배치하지 않는다"(pattern:cashwalk-biz-page-patterns)를 권고가 아닌
    //   하드 게이트로: 루트(html/body/.mockup-screen)에 data-page-pattern 마커가 없거나 5종이 아니면 error.
    const effBrand =
      canonicalBrandSlug(declaredBrand) ??
      canonicalBrandSlug($("html").attr("data-brand") ?? $("body").attr("data-brand")) ??
      canonicalBrandSlug(($("body").attr("class") ?? "").match(/\bbrand-([a-z0-9-]+)\b/i)?.[1]);
    if (effBrand === "cashwalk-biz") {
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

      // ─── 캐포비 사이드바 구성 검증 (회귀: 로고+로그인영역 누락 / 높이 안 참) ───
      //   캐포비 어드민 사이드바는 로고 + 계정 블록(이메일→잔액→충전/내역 CTA)이 항상 노출되고
      //   풀하이트 셸 안에 있어야 한다. 가이드 권고로는 매번 빠지던 것을 validator 로 차단.
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
  collectDocumentLevelViolations(source, $, violations, screenCount);

  // E1: DS 반영도(dsRatio) 최소선 게이트.
  //   "DS 반영"이 보고만 되고 강제되지 않던 구멍을 막는다 — nds-* 1개만 있어도 통과하던 문제.
  //   단순 화면(DS 대상 요소가 적음)은 면제해 억울한 차단을 막고(결정: 경고+자동재시도),
  //   대상이 충분한데 반영도가 바닥이면 error 로 띄워 기존 자동수정 루프(hasErrors)가 재시도하게 한다.
  //   build_singlefile_html 은 ok 를 뒤집지 않으므로 빌드/익스포트 자체를 막지는 않는다.
  const dsAdopted = ndsTagCount + ndsClassCount;
  const dsEligible = dsAdopted + nativeUnwrappedCount;
  if (dsEligible >= LOW_DS_MIN_ELIGIBLE) {
    const dsRatio = Math.round((dsAdopted / dsEligible) * 100);
    if (dsRatio < LOW_DS_FLOOR) {
      violations.push({
        rule: "low-ds-ratio",
        line: 1,
        selector: "<html>",
        severity: "error",
        detail: `DS 반영도 ${dsRatio}% (nds ${dsAdopted} / 대상 ${dsEligible}) — 최소 ${LOW_DS_FLOOR}% 미달. native ${nativeUnwrappedCount}개가 nds-* 로 미교체.`,
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

/**
 * Card / Footer / 영역별 CTA — cheerio 후손 검색으로 컨테이너 안 카운트.
 *  - nested-card                : <nds-card> 후손에 <nds-card>
 *  - card-badge-overuse         : 1 카드 안 chip+badge ≥ 3
 *  - card-footer-button-overuse : nds-card-footer 안 button ≥ 3
 *  - primary-cta-per-container  : 영역 (Card / section / Modal / BottomSheet / Drawer) 안 primary solid nds-button > 1
 */
function collectContainerViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
): void {
  // Card 단위 검사
  $("nds-card").each((_i, el) => {
    if (el.type !== "tag") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);
    const $el = $(el);

    const nestedCount = $el.find("nds-card").length;
    if (nestedCount > 0) {
      out.push({
        rule: "nested-card",
        line,
        selector,
        detail: `nds-card 안에 nds-card 가 ${nestedCount}회 중첩됨.`,
        suggestion:
          "Card 안에 Card 중첩 금지 — 시각 레이어가 깊어지면 정보 계층이 무너짐. 내부 구획은 Divider 또는 surface 배경으로 구분. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }

    const chipCount = $el.find("nds-chip").length;
    const badgeCount = $el.find("nds-badge").length;
    const labelTotal = chipCount + badgeCount;
    if (labelTotal >= 3) {
      out.push({
        rule: "card-badge-overuse",
        line,
        selector,
        detail: `Card 1개에 Badge/Chip 이 ${labelTotal}개 (Chip=${chipCount}, Badge=${badgeCount}).`,
        suggestion:
          "Card 당 Badge/Chip 최대 2개 — 가장 중요한 상태만 남기고 나머지는 Footer 메타텍스트로 처리. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }
  });

  // Card Footer — Button 과다
  $("nds-card-footer").each((_i, el) => {
    if (el.type !== "tag") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);
    const buttonCount = $(el).find("nds-button").length;
    if (buttonCount >= 3) {
      out.push({
        rule: "card-footer-button-overuse",
        line,
        selector,
        detail: `nds-card-footer 안에 nds-button 이 ${buttonCount}개.`,
        suggestion:
          "Card Footer 는 Primary 1개 + Secondary 1개까지. 더 필요하면 Modal/BottomSheet 형태 검토. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }
  });

  // 영역별 Primary CTA 단일성
  const ctaContainers: Array<{ selector: string; label: string }> = [
    { selector: "nds-card", label: "nds-card" },
    { selector: "section", label: "<section>" },
    { selector: "nds-modal", label: "nds-modal" },
    { selector: "nds-bottom-sheet", label: "nds-bottom-sheet" },
    { selector: "nds-drawer", label: "nds-drawer" },
    { selector: "dialog, [role='dialog']", label: "dialog" },
  ];
  for (const { selector: sel, label } of ctaContainers) {
    $(sel).each((_i, el) => {
      if (el.type !== "tag") return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      const line = lineNumberAt(source, offset);
      const elementSelector = describeElement(el);
      const primarySolid = $(el)
        .find("nds-button")
        .toArray()
        .filter((b) => isPrimarySolidButton(b as unknown as DomElement));
      if (primarySolid.length > 1) {
        out.push({
          rule: "primary-cta-per-container",
          line,
          selector: elementSelector,
          detail: `${label} 1개 안에 primary solid nds-button 이 ${primarySolid.length}개.`,
          suggestion: `한 영역(${label}) 안 Primary Button 은 최대 1개. 보조 액션은 variant="outlined" / color="assistive" / variant="text" 로 낮추세요. get_guide({ topic: 'pattern:cta-group' }) 참조.`,
        });
      }
    });
  }

  // 캐포비(cashwalk-biz) 모달 단일 버튼은 우측 정렬 hug 검정 pill — full-width 아님.
  // 흔한 회귀: 버튼 1개인데 full-width 로 깔림(다른 화면의 full-width 적용 버튼을 잘못 가져옴).
  const modalBrand = canonicalBrandSlug(
    $("html").attr("data-brand") ?? $("body").attr("data-brand"),
  );
  if (modalBrand === "cashwalk-biz") {
    $("nds-modal").each((_i, el) => {
      if (el.type !== "tag") return;
      const $el = $(el);
      const footerBtns = $el
        .find('[slot="footer"] nds-button, nds-modal-footer nds-button')
        .toArray();
      // 슬롯 footer 가 없으면(=버튼을 본문에 직접 둔 경우 포함) 모달 내 전체 버튼으로 폴백.
      const buttons = (footerBtns.length
        ? footerBtns
        : $el.find("nds-button").toArray()) as unknown as DomElement[];
      // 단일 버튼 모달에만 적용 — 2개(취소+확정)는 가로 분할이 정상.
      if (buttons.length !== 1) return;
      if (buttons[0].attribs?.["full-width"] === undefined) return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      out.push({
        rule: "cashwalk-biz-modal-single-button-fullwidth",
        line: lineNumberAt(source, offset),
        selector: describeElement(el as unknown as DomElement),
        detail: "캐포비 모달의 단일 버튼에 full-width 가 붙음.",
        suggestion:
          "캐포비(cashwalk-biz) 단일 버튼 모달은 우측 정렬 + hug 너비 검정 pill 입니다 — full-width 아님. <nds-button> 에서 full-width 를 제거하고 <div slot=\"footer\"> 로 감싸면 footer cascade 가 우측 hug 로 정렬합니다(버튼 2개일 때만 가로 분할). get_guide({ topic: 'component:Modal', brand: 'cashwalk-biz' }) 참조.",
      });
    });
  }
}

function collectSelectedItemsPanelViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
): void {
  $("nds-selected-items-panel").each((_i, el) => {
    if (el.type !== "tag") return;
    const $panel = $(el);
    if ($panel.closest("nds-form-field, .nds-form-field__root").length > 0) return;

    const next = $panel.next().get(0) as DomElement | undefined;
    if (!next || next.type !== "tag") return;
    if (!isSelectedItemsExternalHelper(next)) return;

    const line = lineNumberAt(source, (next as unknown as { startIndex?: number }).startIndex ?? 0);
    out.push({
      rule: "selected-items-helper-outside-form-field",
      line,
      selector: describeElement(next),
      detail:
        "SelectedItemsPanel 바로 아래에 helper 텍스트가 sibling 으로 배치되어 패널과 설명이 붙어 보입니다.",
      suggestion:
        '선택 결과 패널의 안내문은 별도 <p>/<div> sibling 이 아니라 <nds-form-field density="admin" helper="시/도, 시/군/구를 검색해 노출할 지역을 추가하세요."> 안에 넣으세요. React 는 <FormField density="admin" helper="..."><SelectedItemsPanel ... /></FormField>.',
    });
  });
}

function isSelectedItemsExternalHelper(el: DomElement): boolean {
  const tag = el.tagName?.toLowerCase();
  if (!tag || !["p", "small", "span", "div"].includes(tag)) return false;

  const attrs = el.attribs ?? {};
  const marker = `${attrs.class ?? ""} ${attrs.id ?? ""} ${attrs["data-slot"] ?? ""}`.toLowerCase();
  const text = nodeText(el).replace(/\s+/g, " ").trim();
  if (text.length < 4 || text.length > 120) return false;

  if (/\b(helper|help|hint|description|desc|caption|guide)\b/.test(marker)) return true;
  return /(검색|추가|선택|입력|도움|안내|시\/도|시\/군\/구|노출할|지역)/.test(text);
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; data?: string; children?: unknown[] };
  if (n.type === "text") return n.data ?? "";
  return (n.children ?? []).map(nodeText).join("");
}

/**
 * 문서 전체 카운트 룰 — 전역 totals 기반.
 *  - chip-overuse / card-everything / primary-cta-overuse
 *  - repeated-h1 / repeated-h2 / bold-overuse / brand-bg-overuse / decorative-shadow
 *  - tone-on-tone-filled / visual-emphasis-overload / primary-color-role-overload
 */
function collectDocumentLevelViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
  screenCount = 1,
): void {
  const chipTotal = $("nds-chip").length;
  if (chipTotal > 8 * screenCount) {
    const ninth = $("nds-chip").eq(8).get(0) as DomElement | undefined;
    const line = ninth
      ? lineNumberAt(source, (ninth as unknown as { startIndex?: number }).startIndex ?? 0)
      : 1;
    out.push({
      rule: "chip-overuse",
      line,
      detail: `nds-chip 이 ${chipTotal}개 발견됨.`,
      suggestion:
        "Chip 은 상태/분류/짧은 속성에만 제한적으로. 섹션 장식이나 모든 카드 반복 강조는 피하세요. get_guide({ topic: 'component:Chip' }) 참조.",
    });
  }

  // region-as-chip: 지역 경로(시/도 > 시/군/구)가 든 Chip = 선택한 지역을 Chip 으로 잘못 표현한 신호.
  //   캐포비 타겟팅 폼의 '특정 지역' 결과는 SelectedItemsPanel + RegionRow 로 그려야 한다 — 노란
  //   outlined 칩은 SelectionButton 과 혼동되고 '추가 선택/선택 해제'·개수 강조·개별 제거가 빠진다.
  $("nds-chip").each((_i, el) => {
    const txt = $(el).text().replace(/\s+/g, " ").trim();
    if (!/\s>\s/.test(txt)) return; // 시/도 > 시/군/구 같은 지역 경로만 — 일반 칩은 통과
    out.push({
      rule: "region-as-chip",
      line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
      selector: describeElement(el as unknown as DomElement),
      detail: `선택한 지역으로 보이는 항목("${txt.slice(0, 32)}")을 <nds-chip> 으로 표현했습니다 — 지역 경로(시/도 > 시/군/구)는 Chip 자리가 아닙니다.`,
      suggestion:
        "동적 다중 선택 결과(지역/카테고리)는 <nds-selected-items-panel> + <nds-region-row> 로 그릴 것 (회색 패널 · '+ 지역 추가' · 개별 제거 X · 개수 강조). 노란 outlined Chip 은 SelectionButton 과 혼동됨. get_guide({ topic: 'component:SelectedItemsPanel' }). Figma 3001:49174.",
    });
  });

  // amount-as-static-display: 폼 입력 필드 자리에 정적 숫자(콤마+단위)를 박은 안티패턴.
  //   대시보드 KPI 통계(정적 숫자 표시)는 정상이므로, 폼 컨텍스트(.nds-form-row / nds-form-field /
  //   .nds-form-field__root) 안에 있을 때만 잡는다. (회귀: 캐포비 '목표 참여자 수' 를 "3,000,000 명"
  //   큰 글씨로 박고 입력이 안 되던 사고.)
  $("div, span, p, strong, b, h1, h2, h3, h4").each((_i, el) => {
    const $el = $(el);
    if ($el.children().length > 0) return; // leaf 텍스트만 — 컨테이너 제외
    const txt = $el.text().replace(/\s+/g, " ").trim();
    if (!/^\d{1,3}(,\d{3})+\s*(명|원|개|건|회|회원|포인트|캐시|점)$/.test(txt)) return;
    if ($el.closest("nds-amount-input, nds-input, input, button, nds-button").length > 0) return;
    if (
      $el.closest(".nds-form-row, .nds-form-row__field, nds-form-field, .nds-form-field__root")
        .length === 0
    )
      return; // 폼 밖(대시보드 통계 등)은 통과
    out.push({
      rule: "amount-as-static-display",
      line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
      selector: describeElement(el as unknown as DomElement),
      detail: `폼 입력 필드 자리에 정적 숫자("${txt.slice(0, 20)}")를 박았습니다 — 입력이 불가능합니다.`,
      suggestion:
        "폼에서 사용자가 입력하는 수치는 정적 텍스트가 아니라 <nds-amount-input value=... unit='명|원' placeholder='0'>(천단위 콤마·단위·clamp)로. get_guide({ topic: 'component:AmountInput', target: 'html' }) 참조.",
    });
  });

  // region-add-affordance-duplicated: 지역 선택에 add 어포던스가 2개 이상
  //   (외부 점선 '+ 지역 추가' 버튼 + SelectedItemsPanel 내부 '+ 추가 선택'). 추가는 모달 1개로 통일.
  //   (회귀: 캐포비 타겟팅 폼 — 모달이 안 뜨고 중복 add UI.)
  const addAffordances = $("button, nds-button, a, [role='button']").filter((_i, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    return /^\+?\s*(지역\s*추가(하기)?|추가\s*선택|선택\s*추가)$/.test(t);
  });
  if (addAffordances.length >= 2) {
    const second = addAffordances.get(1) as DomElement | undefined;
    out.push({
      rule: "region-add-affordance-duplicated",
      line: second
        ? lineNumberAt(source, (second as unknown as { startIndex?: number }).startIndex ?? 0)
        : 1,
      selector: second ? describeElement(second) : undefined,
      detail: `지역 추가 어포던스가 ${addAffordances.length}개입니다(예: 외부 '지역 추가' + 패널 '추가 선택') — 추가 경로가 중복됩니다.`,
      suggestion:
        "지역 추가는 SelectedItemsPanel 의 onAdd(=모달 열기) 한 곳으로 통일하세요. 패널 밖 별도 '지역 추가' 버튼을 또 두지 말 것. '지역 추가' 클릭 → 2단 모달(좌: 체크박스 트리, 우: SelectedItemsPanel hide-add) → '적용'. get_guide({ topic: 'component:SelectedItemsPanel' }) / pattern 의 모달 플로우 참조.",
    });
  }

  // region-row-duplicated: SelectedItemsPanel 안 같은 지역 행이 중복.
  $("nds-selected-items-panel, .nds-selected-items-panel").each((_p, panel) => {
    const seen = new Set<string>();
    $(panel)
      .find("nds-region-row, .nds-region-row")
      .each((_r, row) => {
        const t = $(row).text().replace(/\s+/g, " ").trim();
        if (!t) return;
        if (seen.has(t)) {
          out.push({
            rule: "region-row-duplicated",
            line: lineNumberAt(source, (row as unknown as { startIndex?: number }).startIndex ?? 0),
            selector: describeElement(row as unknown as DomElement),
            detail: `선택한 지역 "${t.slice(0, 24)}" 이(가) 패널에 중복으로 들어 있습니다.`,
            suggestion:
              "선택 결과는 유니크해야 합니다 — 같은 지역을 두 번 추가하지 마세요(추가 시 중복 제거). get_guide({ topic: 'component:SelectedItemsPanel' }) 참조.",
          });
        }
        seen.add(t);
      });
  });

  const cardTotal = $("nds-card").length;
  if (cardTotal >= 5 * screenCount) {
    out.push({
      rule: "card-everything",
      line: 1,
      detail: `한 mockup 에 nds-card 가 ${cardTotal}개 — 모든 정보 단위를 카드로 감싸는 패턴.`,
      suggestion:
        "Card 는 '독립된 정보 단위' 에만. 단순 group/section 은 spacing(--semantic-gap-loose) + heading + Divider 로 위계를 표현하세요.",
    });
  }

  // 페이지 레벨 primary solid nds-button 카운트.
  // Modal/BottomSheet/Drawer/dialog 안의 primary action은 해당 surface의 apply/confirm이라
  // 전역 "화면 CTA 1개" 규칙과 별도로 본다. 같은 surface 안 중복은
  // collectContainerViolations 의 primary-cta-per-container 가 잡는다.
  const pagePrimarySolidTotal = $("nds-button")
    .toArray()
    .filter((b) => isPrimarySolidButton(b as unknown as DomElement))
    .filter((b) => !isInsideSecondaryActionContext(b as unknown as DomElement)).length;
  if (pagePrimarySolidTotal > screenCount) {
    out.push({
      rule: "primary-cta-overuse",
      line: 1,
      detail: `페이지 레벨 primary solid nds-button 이 ${pagePrimarySolidTotal}개.`,
      suggestion:
        "페이지 primary solid 는 가장 중요한 액션 1개만. 모달/드로어 내부 확인 액션은 별도 surface CTA 로 허용되지만, 페이지의 나머지 액션은 outlined / assistive / text 계열로 낮추세요.",
    });
  }

  const h1Count = $("h1").length;
  if (h1Count > screenCount) {
    out.push({
      rule: "repeated-h1",
      line: 1,
      detail: `<h1> 이 ${h1Count}개 — 페이지 최상위 헤딩은 1개여야 합니다.`,
      suggestion: "한 mockup 에 h1 은 1개. 보조 섹션은 h3 이하 사용.",
    });
  }
  const h2Count = $("h2").length;
  if (h2Count > 3 * screenCount) {
    out.push({
      rule: "repeated-h2",
      line: 1,
      detail: `<h2> 가 ${h2Count}개 — 같은 화면에 큰 제목이 너무 많습니다.`,
      suggestion: "h2 는 화면당 2-3개 이내. 더 세분화는 h3/h4 로 표현.",
    });
  }

  // Bold 남발 — style="font-weight: bold | 700+" 카운트
  let boldCount = 0;
  $("[style]").each((_i, el) => {
    const style = ((el as unknown as DomElement).attribs?.style ?? "").trim();
    if (/font-weight\s*:\s*(?:bold|700|800|900)\b/i.test(style)) boldCount += 1;
  });
  if (boldCount >= 5 * screenCount) {
    out.push({
      rule: "bold-overuse",
      line: 1,
      detail: `Bold(700+) inline 텍스트 선언이 ${boldCount}곳.`,
      suggestion: "Bold 는 화면당 1-2개 핵심 텍스트에만. 본문은 Regular(400)/Medium(500).",
    });
  }

  // Brand BG 한 화면 1곳 — --semantic-bg-brand-default | subtle 2회 이상이면 위반
  const brandBgMatches = source.match(/var\(--semantic-bg-brand-(?:default|subtle)\)/g) ?? [];
  if (brandBgMatches.length >= 2 * screenCount) {
    out.push({
      rule: "brand-bg-overuse",
      line: 1,
      detail: `Brand background 토큰이 ${brandBgMatches.length}회 사용됨 (한 화면 최대 1곳).`,
      suggestion:
        "Brand BG 는 의미 있는 notice / 핵심 강조 1곳에만. 나머지는 var(--semantic-bg-surface*) 또는 elevated 사용.",
    });
  }

  // Decorative Shadow — inline box-shadow 4곳 이상 (focus ring 제외)
  let decorativeShadowCount = 0;
  $("[style]").each((_i, el) => {
    const style = ((el as unknown as DomElement).attribs?.style ?? "").trim();
    const shadows = style.match(/box-shadow\s*:\s*[^;]+/gi) ?? [];
    for (const s of shadows) {
      if (/var\(--shadow-/.test(s)) continue;
      if (/0\s+0\s+0\s+\d+px/.test(s)) continue; // focus ring 류
      decorativeShadowCount += 1;
    }
  });
  if (decorativeShadowCount >= 4 * screenCount) {
    out.push({
      rule: "decorative-shadow",
      line: 1,
      detail: `인라인 box-shadow 가 ${decorativeShadowCount}곳 — shadow-heavy layout.`,
      suggestion:
        "Shadow 는 floating UI(Modal/Popup/Dropdown/BottomSheet) 에만. 일반 카드/리스트는 border 또는 surface tone 으로 구분.",
    });
  }

  // tone-on-tone-filled — 연한 primary bg + 같은 톤 filled/soft chip/badge
  const lightPrimaryBgRe =
    /background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100))/;
  const filledChipOrBadgeRe =
    /<\s*nds-(?:chip|badge)\b[^>]*?(?:variant\s*=\s*["'](?:filled|soft)["']|style\s*=\s*["'][^"']*background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100)))/i;
  if (lightPrimaryBgRe.test(source) && filledChipOrBadgeRe.test(source)) {
    out.push({
      rule: "tone-on-tone-filled",
      line: 1,
      detail: "연한 primary/blue 배경과 같은 계열 filled/soft 라벨이 함께 사용됨.",
      suggestion:
        "같은 톤 위 같은 톤 filled 컴포넌트는 강조 계층이 약합니다. 배경은 neutral 로 낮추거나 라벨을 outlined/text 계열로.",
    });
  }

  // visual-emphasis-overload — 강조 장치가 동시에 4개 이상 사용
  const emphasisSignals = [
    { name: "gradient", matched: /(linear|radial|conic)-gradient\s*\(/.test(source) },
    { name: "chip", matched: $("nds-chip").length > 0 },
    { name: "badge", matched: $("nds-badge").length > 0 },
    {
      name: "semantic-background",
      matched: /background(?:-color)?\s*:\s*var\(--semantic-/.test(source),
    },
    { name: "icon", matched: $("svg").length > 0 },
  ].filter((s) => s.matched);
  if (emphasisSignals.length >= 4) {
    out.push({
      rule: "visual-emphasis-overload",
      line: 1,
      detail: `강조 장치가 동시에 많이 사용됨: ${emphasisSignals.map((s) => s.name).join(", ")}`,
      suggestion:
        "안내/보조 영역은 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 1-2개만 사용하세요. get_guide({ topic: 'pattern:notice' }) 참조.",
    });
  }

  // primary-color-role-overload — primary 계열 색이 여러 역할로 과다 사용
  const primaryTokenRefs =
    source.match(
      /var\(--color-(?:semantic-primary|blue|cobalt|trostEapBanner|yellow-primary)[\w-]*\)/g,
    ) ?? [];
  const primaryRoleSignals = [
    {
      name: "button",
      matched: $("nds-button")
        .toArray()
        .some((b) => {
          const a = (b as unknown as DomElement).attribs ?? {};
          return a.color === "primary" || a.variant === "solid";
        }),
    },
    {
      name: "chip",
      matched:
        $("nds-chip[variant='filled'], nds-chip[color], nds-chip[style*='background']").length > 0,
    },
    {
      name: "badge",
      matched:
        $("nds-badge[variant='filled'], nds-badge[color], nds-badge[style*='background']").length >
        0,
    },
    {
      name: "background",
      matched:
        /background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "border",
      matched:
        /border(?:-color)?\s*:\s*[^;]*var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "icon",
      matched:
        /<\s*svg\b[^>]*?color\s*=\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
  ].filter((s) => s.matched);

  if (primaryTokenRefs.length >= 8 || primaryRoleSignals.length >= 4) {
    out.push({
      rule: "primary-color-role-overload",
      line: 1,
      detail: `primary 계열 색상이 여러 역할로 과다 사용됨: ${
        primaryRoleSignals.map((s) => s.name).join(", ") || `${primaryTokenRefs.length} token refs`
      }`,
      suggestion:
        "Primary color 는 CTA/interactive/highlight 중 제한된 역할에만. 배경/태그/카드/포커스까지 모두 primary 로 처리하지 말고 neutral surface 와 텍스트 위계로 낮추세요.",
    });
  }

  // ─── DS 뱃지 풋터 노출 ─────────────────────────────────
  // 풋터(<footer> / <nds-footer-info> / <nds-footer-web>) 안에 DS 버전·사용량 뱃지가
  // 시각적으로 보여야 함. 뱃지는 다음 중 하나로 인식:
  //   - data-ds-badge 속성을 가진 요소
  //   - "DS@<version>" 또는 "DS@버전" 텍스트
  // build_singlefile_html 이 응답으로 dsUsageSummary 를 돌려주는데, 그 값을
  // 풋터에 visible 하게 렌더해야 한다. (HTML 주석으로만 박혀 있으면 디자이너/PM 이
  // 산출물을 받았을 때 어떤 DS 버전인지·DS 사용 비율이 얼마인지 알 수 없다.)
  const footerSelectors = ["footer", "nds-footer-info", "nds-footer-web", "nds-footer-app"];
  const footers = $(footerSelectors.join(", "));
  if (footers.length > 0) {
    let badgeFound = false;
    footers.each((_i, el) => {
      if (badgeFound) return;
      const $el = $(el);
      if ($el.find("[data-ds-badge]").length > 0 || $el.is("[data-ds-badge]")) {
        badgeFound = true;
        return;
      }
      // 풋터 후손 전체 텍스트를 합쳐 검사 (DS@0.1.10 형태 또는 DS@버전 자리표시자)
      const allText = $el.text();
      if (/\bDS\s*@\s*[\w.-]+/i.test(allText)) {
        badgeFound = true;
      }
    });
    if (!badgeFound) {
      const firstFooter = footers.get(0) as DomElement | undefined;
      const line = firstFooter
        ? lineNumberAt(source, (firstFooter as unknown as { startIndex?: number }).startIndex ?? 0)
        : 1;
      out.push({
        rule: "ds-badge-missing",
        line,
        selector: firstFooter ? describeElement(firstFooter) : undefined,
        detail: "풋터에 DS 버전·사용량 뱃지가 없음.",
        suggestion:
          "build_singlefile_html 응답의 dsUsageSummary(예: 'DS@0.1.10 · DS 12 (45%)') 를 풋터 안에 visible 하게 렌더하세요. 인식 패턴: data-ds-badge 속성 또는 'DS@<version>' 텍스트. 예: <span data-ds-badge style=\"font-size:12px;color:var(--semantic-text-tertiary)\">DS@0.1.10 · DS 12 (45%)</span>",
      });
    }
  }
}

const NON_SOLID_VARIANTS = new Set(["outlined", "outlined-sub", "soft", "text", "ghost"]);
function isPrimarySolidButton(el: DomElement): boolean {
  if (el.type !== "tag" || el.tagName?.toLowerCase() !== "nds-button") return false;
  const attrs = el.attribs ?? {};
  const isPrimary = !attrs.color || attrs.color === "primary";
  const isNonSolid = !!attrs.variant && NON_SOLID_VARIANTS.has(attrs.variant);
  return isPrimary && !isNonSolid;
}

function isInsideSecondaryActionContext(el: DomElement): boolean {
  let cur: DomElement | null = (el as unknown as { parent?: DomElement }).parent ?? null;
  while (cur) {
    if (cur.type === "tag") {
      const tag = cur.tagName?.toLowerCase();
      const role = cur.attribs?.role?.toLowerCase();
      if (
        tag === "nds-modal" ||
        tag === "nds-bottom-sheet" ||
        tag === "nds-drawer" ||
        tag === "dialog" ||
        role === "dialog"
      ) {
        return true;
      }
    }
    cur = (cur as unknown as { parent?: DomElement }).parent ?? null;
  }
  return false;
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
  "card-slot-double-padding": "spacing",
  // layout (layout-structure): 카드 중첩·CTA 위계·칩 과다·장식
  "cashwalk-biz-sidebar-shell": "layout",
  "cashwalk-biz-admin-page-pattern": "layout",
  "cashwalk-biz-modal-single-button-fullwidth": "layout",
  "raw-landmark": "layout",
  "nested-card": "layout",
  "card-badge-overuse": "layout",
  "card-footer-button-overuse": "layout",
  "primary-cta-per-container": "layout",
  "primary-cta-overuse": "layout",
  "chip-overuse": "layout",
  "region-as-chip": "layout",
  "region-add-affordance-duplicated": "layout",
  "region-row-duplicated": "layout",
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
  "assistive-solid-cta": "component",
  "button-without-interaction": "component",
  "date-as-text-input": "component",
  "amount-as-text-input": "component",
  "amount-as-static-display": "component",
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
    .map(([rule, { severity, lines }]) => ({ rule, severity, count: lines.length, lines }))
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
