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
import { canonicalBrandSlug, listStandaloneBrands } from "./standalone-assets.js";

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
  "raw-landmark": "warn",
  // 브랜드 화면인데 base nds-header 를 손수 조립 (회고: brand chrome 미사용 안티패턴)
  "manual-brand-header": "warn",
  // data-brand / brand-* 에 미지 slug → base(블루)로 조용히 폴백돼 색이 틀림 (회고: cashpobi)
  "unknown-brand-slug": "error",
  // 단일 파일 빌드에 inline 안 되는 로컬 이미지 경로 (회고: 내부/외부 모두 깨짐)
  "non-inlinable-img-src": "warn",
  "unknown-nds-tag": "error",
  "unknown-nds-class": "error",
  "invalid-nds-attr-value": "error",
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
  "inline-svg": "warn",
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

export function validateHtmlSource(
  source: string,
  options?: { context?: HtmlValidationContext },
): HtmlViolation[] {
  const ctx = options?.context ?? configured;
  const violations: HtmlViolation[] = [];
  const $ = cheerio.load(source, { xmlMode: false });

  // 모든 element 순회 — style / class / svg / native button 검사
  $("*").each((_idx, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    const attrs = el.attribs ?? {};
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);

    // 1. style="..." 검사
    if (attrs.style) {
      checkStyleString(attrs.style, line, selector, ctx, violations);
    }

    // 2. native interactive 가 nds-* 태그 / 클래스 없이 사용
    if (tag === "button" || tag === "input" || tag === "select" || tag === "textarea") {
      const cls = (attrs.class ?? "").split(/\s+/).filter(Boolean);
      const hasNdsClass = cls.some((c) => c.startsWith("nds-"));
      // <nds-input> 안에 들어있는 inner <input> 은 우리 WC 가 만든 것 — 검사 제외
      const insideNdsWrapper = (el as unknown as { parent?: DomElement }).parent
        ? hasAncestorNdsTag(el)
        : false;
      if (!hasNdsClass && !insideNdsWrapper) {
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

    if (
      (tag === "aside" && ctx.ndsTagSet.has("nds-sidebar")) ||
      (tag === "footer" &&
        (ctx.ndsTagSet.has("nds-brand-footer") ||
          ctx.ndsTagSet.has("nds-footer") ||
          ctx.ndsTagSet.has("nds-footer-info"))) ||
      (tag === "header" &&
        (ctx.ndsTagSet.has("nds-brand-header") || ctx.ndsTagSet.has("nds-header")))
    ) {
      const hasBrandHeader = ctx.ndsTagSet.has("nds-brand-header");
      const hasBrandFooter = ctx.ndsTagSet.has("nds-brand-footer");
      // brand-header/footer 가 있는데도 raw <header>/<footer> 를 쓰는 건 contract 위반에 가까움.
      // (회고: validator 추천을 "soft suggestion" 으로 오해해 reference 스크린샷 fidelity 우선)
      // 이 경우엔 error 로 승격, brand 변형이 없는 일반 landmark 대체는 warn.
      const isBrandReplaceable =
        (tag === "footer" && hasBrandFooter) || (tag === "header" && hasBrandHeader);
      violations.push({
        rule: "raw-landmark",
        line,
        selector,
        severity: isBrandReplaceable ? "error" : "warn",
        detail: `<${tag}> 를 raw landmark 로 구현함`,
        suggestion:
          tag === "aside"
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
    if (tag === "svg") {
      violations.push({
        rule: "inline-svg",
        line,
        selector,
        detail: "<svg> 직접 사용",
        suggestion: "먼저 find_icon 으로 @nudge-design/icons 에 적합 아이콘 있는지 확인.",
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
}

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
  if (!source && args.filePath) {
    const p = path.resolve(args.filePath);
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    source = fs.readFileSync(p, "utf-8");
  }
  if (!source) {
    throw new Error("Provide either `source` (HTML string) or `filePath`.");
  }
  const rawViolations = validateHtmlSource(source);
  const violations = trimViolationsForResponse(rawViolations);
  const violationsByRule = summarizeByRule(rawViolations);
  const severitySummary = summarizeSeverity(rawViolations);
  return {
    ok: rawViolations.length === 0,
    violations,
    violationsByRule,
    severitySummary,
    jsxOnlyNotice:
      "validate_html_mockup 은 토큰·간격·아이콘·nds-* 태그/클래스·컨테이너 패턴 (Card 중첩 / Footer 버튼 과다 / 영역별 primary CTA / heading 장식 / brand BG / bold 남발 등) 까지 검사합니다. " +
      "다만 JSX 전용 룰 — antd import 잔존 / 외부 아이콘 라이브러리 import / Chip.label 속성 / 화살표 아이콘 식별 (HTML 에서는 익명 <svg>) — 은 .tsx 시점에서만 검출됩니다. " +
      "prop 의미 검증 (IconButton size union 등) 도 .tsx 의 validate_mockup 을 사용하세요. " +
      "응답 크기 cap: 같은 rule 의 첫 " +
      FULL_SAMPLES_PER_RULE +
      "건은 detail/suggestion full, 그 뒤는 line 만. 룰별 총 카운트는 violationsByRule 참고.",
  };
}
