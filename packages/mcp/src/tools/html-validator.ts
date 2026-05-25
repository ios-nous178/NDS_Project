/**
 * validate_html_mockup — HTML 입력 (mockup HTML 또는 .tsx 의 build:html 산출물)을
 * 검사하는 도구. mockup-validator.ts 의 format-agnostic 룰을 cheerio 로 적용 +
 * nds-* dialect 인식.
 *
 * 검출 룰:
 *  - inline-color         : style="" 의 hex / rgb (var(--..) 없을 때)
 *  - inline-spacing       : style="" 의 px/rem (transform 류 제외)
 *  - non-4pt-spacing      : 4 의 배수 아닌 px 값
 *  - non-semantic-spacing : style 의 padding/margin/gap 이 var(--spacing-*) 직접 사용
 *  - gradient-banned      : linear/radial/conic-gradient
 *  - emoji-banned         : 이모지 텍스트
 *  - text-symbol-banned   : → ✓ ★ • 같은 기호 텍스트
 *  - inline-svg           : <svg> (DS 아이콘 화이트리스트와 대조)
 *  - native-interactive   : <button>/<input>/<select> 가 nds-* 클래스/태그 없이 사용됨
 *  - unknown-token        : var(--xxx) 의 --xxx 가 카탈로그에 없음
 *  - unknown-nds-tag      : <nds-foo> 가 카탈로그(@nudge-eap/html) 에 없는 태그
 *  - unknown-nds-class    : class="nds-foo" 가 React DS stylesheet 에 없는 클래스
 *
 * v0 한계 (정직하게 응답에 명시):
 *  - prop union 검사 (예: nds-button color="weird") 는 @nudge-eap/html 의 attribute
 *    enum 카탈로그 export 가 깔린 후에 추가. 현재는 화이트리스트 외 값 통과.
 *  - JSX-only 룰 (Card.Header 이중 padding 등) 은 .tsx 로 가야 함을 응답에 명시.
 */

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

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

export interface HtmlViolation {
  rule: string;
  line: number;
  selector?: string;
  detail: string;
  suggestion?: string;
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

const STRICT_SYMBOL_RE = /[→←↑↓↔↕➜➔⮕›‹»«▶◀▲▼◆◇✓✗✘✕☑☒★☆⭐♥♡❤•]/;
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
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
            suggestion: "4 의 배수 (4/8/12/16/20/24…) 또는 var(--gap-*|--inset-*) semantic 토큰.",
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
        "padding/margin/gap 은 var(--spacing-*) 가 아니라 semantic var(--gap-*|--inset-*) 만 사용.",
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

    // 3. inline svg — DS 아이콘 사용 권장
    if (tag === "svg") {
      violations.push({
        rule: "inline-svg",
        line,
        selector,
        detail: "<svg> 직접 사용",
        suggestion: "먼저 find_icon 으로 @nudge-eap/icons 에 적합 아이콘 있는지 확인.",
      });
    }

    // 4. unknown nds-* 태그
    if (tag.startsWith("nds-") && ctx.ndsTagSet.size > 0 && !ctx.ndsTagSet.has(tag)) {
      violations.push({
        rule: "unknown-nds-tag",
        line,
        selector,
        detail: `<${tag}> 는 @nudge-eap/html 에 없는 custom element`,
        suggestion: "find_component({ query }) 으로 유사한 React 컴포넌트 확인.",
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
  });

  // 6. text 노드의 emoji / strict symbol
  $("*").each((_idx, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);
    const text = $(el)
      .contents()
      .filter((_i, c) => c.type === "text")
      .text();
    if (!text) return;
    if (EMOJI_RE.test(text)) {
      violations.push({
        rule: "emoji-banned",
        line,
        selector,
        detail: text.trim().slice(0, 60),
        suggestion: "이모지 금지. 아이콘은 find_icon 으로 DS 아이콘 사용.",
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
  });

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
}

export interface ValidateHtmlMockupResult {
  ok: boolean;
  violations: HtmlViolation[];
  jsxOnlyNotice: string;
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
  const violations = validateHtmlSource(source);
  return {
    ok: violations.length === 0,
    violations,
    jsxOnlyNotice:
      "이 검사는 토큰·간격·아이콘·nds-* 태그/클래스까지 (format-agnostic 룰) 입니다. " +
      "prop 의미 검증 (Card.Header 이중 padding, IconButton size union 등) 은 .tsx 시점에서만 가능합니다 — " +
      "수정이 prop 의미와 관련되면 .tsx 로 돌아가서 validate_mockup 을 사용하세요.",
  };
}
