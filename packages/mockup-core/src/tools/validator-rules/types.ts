/**
 * validator-rules 공유 타입/헬퍼 — html-validator.ts(오케스트레이터)에서 순수 이동(pure-move).
 *
 * 분리된 룰 그룹(document-level / container / selected-items)과 오케스트레이터가 함께 쓰는
 * 컨텍스트 타입(HtmlViolation / DomElement / DocumentValidationScope)과 공유 헬퍼
 * (lineNumberAt / describeElement / isPrimarySolidButton)를 둔다.
 * 공개 타입(HtmlViolation 등)은 html-validator.ts 가 re-export 해 기존 모듈 경로를 유지한다.
 */
import type { CashwalkBizPagePattern } from "../standalone-assets.js";

/**
 * cheerio 의 element 노드 — 직접 type import 없이 구조만. cheerio Element 는
 * .parent 가 Document 일 수도 있어 우리 좁은 타입과 완전 호환은 아니지만,
 * .each 콜백이 넘기는 노드는 항상 tag 노드라 안전하게 cast 한다.
 */
export interface DomElement {
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

export interface DocumentValidationScope {
  surface: HtmlSurface;
  project?: string;
  pagePattern?: CashwalkBizPagePattern;
}

export function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

export function describeElement(el: DomElement): string {
  const tag = el.tagName;
  const cls = (el.attribs?.class ?? "").split(/\s+/).filter(Boolean).slice(0, 2);
  const id = el.attribs?.id;
  let s = `<${tag}`;
  if (id) s += `#${id}`;
  if (cls.length > 0) s += `.${cls.join(".")}`;
  s += ">";
  return s;
}

/**
 * data-nudge-allow waiver — `// allow-native` 의 일반화(③-c). 위반 요소 또는 그 조상에
 *   data-nudge-allow="<예외id> — <사유>"
 * 가 있고 id 가 exceptionId 와 일치하면 면제(true). 여러 예외는 쉼표/줄바꿈 구분.
 * 구분자는 em-dash(—) 또는 스페이스-하이픈-스페이스만 — 예외 id 자체가 콜론/하이픈을
 * 포함(ux:p2-card-justified)하므로 그건 건드리지 않는다.
 * 예외 케이스 SSOT: scripts/validator-exception-registry.mjs.
 */
export function hasWaiver(el: DomElement, exceptionId: string): boolean {
  let node: { attribs?: Record<string, string>; parent?: unknown } | undefined = el;
  while (node && typeof node === "object") {
    const allow = node.attribs?.["data-nudge-allow"];
    if (
      allow &&
      allow
        .split(/[,\n]/)
        .map((s) => s.split(/\s+[—-]\s+/)[0].trim())
        .includes(exceptionId)
    )
      return true;
    node = node.parent as typeof node | undefined;
  }
  return false;
}

const NON_SOLID_VARIANTS = new Set(["outlined", "soft", "text", "ghost"]);
export function isPrimarySolidButton(el: DomElement): boolean {
  if (el.type !== "tag" || el.tagName?.toLowerCase() !== "nds-button") return false;
  const attrs = el.attribs ?? {};
  const isPrimary = !attrs.color || attrs.color === "primary";
  const isNonSolid = !!attrs.variant && NON_SOLID_VARIANTS.has(attrs.variant);
  return isPrimary && !isNonSolid;
}
