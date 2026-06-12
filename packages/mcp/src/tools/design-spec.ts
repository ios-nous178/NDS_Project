/**
 * Nudge DS — DesignSpec (경량 중간표현 / lightweight intermediate representation)
 *
 * prompt → **DesignSpec(JSON)** → code 파이프라인의 중간표현.
 * 목적: 추적성(traceability) · 정밀편집 · 코드前 검증(validate-before-code) · 소프트 승인 게이트.
 *
 * geometry(좌표·resolved 색·px·이미지 바이트)는 **일부러 담지 않는다** — 그건 코드→Figma
 * `scene.json`(역방향 추출) 담당. DesignSpec 은 "왜/무엇"(의도·시멘틱 토큰 이름·근거)만 담는다.
 * 컴포넌트 어휘는 scene.ts 의 `ndsTagToComponentName` 규칙을 **공유**해, 정방향 spec 과
 * 역방향 scene 을 컴포넌트 정체성으로 JOIN 할 수 있게 한다(Phase 3 인스턴스 승격 대비).
 *
 * validateDesignSpec 은 순수 함수(IO 없음) — node:test 로 단위검증한다.
 * 카탈로그(토큰/컴포넌트/prop enum)는 server.ts 가 configureDesignSpec 으로 주입한다
 * (configureHtmlValidator 패턴 미러).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ndsTagToComponentName } from "@nudge-design/mockup-core/tools/usage/parser";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import {
  canonicalBrandSlug,
  canonicalPagePattern,
  CASHWALK_BIZ_PAGE_PATTERNS,
} from "@nudge-design/mockup-core/tools/standalone-assets";
import {
  readPagePatternMarker,
  readSurfaceMarker,
} from "@nudge-design/mockup-core/tools/html-validator";
// Decision Log read-side(타입·상수·screenKey·리더)는 공용 코어로 이전 — write-side(build/append)는
// MCP 검증 타입에 묶여 아래에 남는다. 기존 import 경로 호환을 위해 같은 이름으로 re-export.
import {
  DESIGN_DECISIONS_FILE,
  DESIGN_DECISIONS_MAX_ROWS,
  readDesignDecisions,
  screenKey,
  type DesignDecisionRow,
} from "@nudge-design/mockup-core/tools/design-decisions";

export {
  DESIGN_DECISIONS_FILE,
  DESIGN_DECISIONS_MAX_ROWS,
  DEFAULT_PROMOTE_THRESHOLD,
  readDesignDecisions,
  promoteDesignDecisions,
} from "@nudge-design/mockup-core/tools/design-decisions";
export type {
  DesignDecisionRow,
  PromotedPrinciple,
  PromoteOptions,
} from "@nudge-design/mockup-core/tools/design-decisions";

export type DesignSpecSurface = "web" | "app";

export interface DesignSpecNode {
  /** "Button" | "nds-button" | 레이아웃 프리미티브("Stack"/"Row"/"Box"...) */
  component: string;
  /** 의도 메모 — 예: "primary CTA" */
  role?: string;
  /** 시멘틱 prop (color/variant/size...). 값은 카탈로그 enum 검증 대상. */
  props?: Record<string, string | number | boolean>;
  /** 참조하는 시멘틱 토큰 이름들 — 예: ["--semantic-bg-default"]. raw hex 금지. */
  tokens?: string[];
  /** 이 선택을 한 이유(근거). 추적성의 핵심. */
  rationale?: string;
  children?: DesignSpecNode[];
}

export interface DesignSpec {
  screen: {
    brand: string;
    surface: DesignSpecSurface;
    intent: string;
    name?: string;
    /**
     * 제작 표면(admin/service) — web/app(surface) 와 다른 축. nudge.surface 마커와 동일 의미.
     * saveDesignSpec 가 cwd 의 nudge.surface 마커에서 자동 주입(미선언 시). 캐포비 어드민 패턴 게이트 입력.
     */
    surfaceKind?: "admin" | "service";
    /**
     * 캐포비 어드민 Page Pattern(Onboarding/Dashboard/List/Detail/Form 5종 중 하나).
     * brand=cashwalk-biz + surfaceKind=admin 이면 필수 — get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }).
     */
    pagePattern?: string;
  };
  tree: DesignSpecNode[];
  /** 화면 전체 차원의 디자인 결정 bullet */
  decisions?: string[];
  /** 스펙 스키마 버전 */
  specVersion?: string;
}

export type DesignSpecSeverity = "error" | "warn" | "info";

export interface DesignSpecViolation {
  rule: string;
  severity: DesignSpecSeverity;
  path: string;
  message: string;
}

export interface ValidateDesignSpecResult {
  ok: boolean;
  violations: DesignSpecViolation[];
  summary: { error: number; warn: number; info: number; hasErrors: boolean };
  brand: string | null;
  componentsUsed: string[];
  tokensUsed: string[];
  nextStep: string;
}

export interface SaveDesignSpecResult extends ValidateDesignSpecResult {
  written: boolean;
  path: string | null;
  humanReadable: string;
}

interface DesignSpecContext {
  tokenSet: Set<string>;
  componentNames: Set<string>;
  /** 실재하는 정식 브랜드 slug 셋(별칭 제외). 비면 brand 엄격검사를 건너뛴다. */
  brands: Set<string>;
  /** PascalCase 컴포넌트명 → (prop명 → 허용값[]) */
  propAllowedValues: Map<string, Map<string, string[]>>;
  /** nds-tag → (attr명 → 허용값[]) */
  ndsAttrEnums: Map<string, Map<string, string[]>>;
}

let ctx: DesignSpecContext = {
  tokenSet: new Set(),
  componentNames: new Set(),
  brands: new Set(),
  propAllowedValues: new Map(),
  ndsAttrEnums: new Map(),
};

/** server.ts 가 카탈로그 로드 후 1회 호출 (configureHtmlValidator 미러). */
export function configureDesignSpec(next: DesignSpecContext): void {
  ctx = next;
}

/** spec 트리에서 컴포넌트가 아닌 구조/콘텐츠 래퍼 — unknown-component 경고에서 면제. */
const LAYOUT_PRIMITIVES = new Set([
  "Screen",
  "Stack",
  "Row",
  "Column",
  "Box",
  "Grid",
  "Group",
  "Spacer",
  "Section",
  "Container",
  "Flex",
  "Fragment",
  "Text",
  "Heading",
  "Image",
  "Icon",
  "List",
  "ListItem",
  "Divider",
]);

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const RGB_RE = /\brgba?\s*\(/i;
// server.ts isRawPaletteToken 과 동일 규칙(의도적 미러 — 결합 회피).
const RAW_PALETTE_RE = /^--color-(?:neutral|coolGray|blue|magenta|yellow|red|green)-/;

function stripVar(token: string): string {
  const m = /^var\(\s*(--[^),\s]+)/.exec(token.trim());
  return m ? m[1] : token.trim();
}

interface ResolvedComponent {
  pascal: string | null;
  ndsTag: string | null;
  known: boolean;
  isPrimitive: boolean;
}

function resolveComponent(name: string): ResolvedComponent {
  const trimmed = name.trim();
  let pascal: string | null;
  let ndsTag: string | null;
  if (trimmed.startsWith("nds-")) {
    ndsTag = trimmed;
    pascal = ndsTagToComponentName(trimmed);
  } else {
    pascal = trimmed;
    const kebab = trimmed.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    ndsTag = `nds-${kebab}`;
  }
  const known = pascal != null && ctx.componentNames.has(pascal);
  const isPrimitive = LAYOUT_PRIMITIVES.has(trimmed);
  return { pascal, ndsTag, known, isPrimitive };
}

/** DesignSpec 을 카탈로그 기준으로 검증한다(순수 함수). */
export function validateDesignSpec(input: unknown): ValidateDesignSpecResult {
  const violations: DesignSpecViolation[] = [];
  const componentsUsed = new Set<string>();
  const tokensUsed = new Set<string>();

  const add = (rule: string, severity: DesignSpecSeverity, p: string, message: string): void => {
    violations.push({ rule, severity, path: p, message });
  };

  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    add("invalid-spec", "error", "$", "DesignSpec 은 객체여야 합니다 ({ screen, tree }).");
    return finalize(violations, null, componentsUsed, tokensUsed);
  }

  const spec = input as Partial<DesignSpec>;
  let canonicalBrand: string | null = null;

  // ── screen ──
  const screen = spec.screen;
  if (!screen || typeof screen !== "object") {
    add("missing-field", "error", "screen", "screen { brand, surface, intent } 가 필요합니다.");
  } else {
    if (!screen.brand) {
      add("missing-field", "error", "screen.brand", "brand 가 필요합니다.");
    } else {
      // canonicalBrandSlug 는 별칭(cashpobi→cashwalk-biz)만 정규화하고 미지 입력은 그대로 돌려준다.
      // 실재 여부는 주입된 brands 셋으로 판정 — html-validator 의 unknown-brand-slug 룰과 동일 의미.
      // brands 가 비면(자산 디렉토리 미해석 등) 엄격검사를 건너뛴다(false-positive 방지).
      const canon = canonicalBrandSlug(screen.brand);
      if (canon && ctx.brands.size > 0 && !ctx.brands.has(canon)) {
        add(
          "unknown-brand",
          "error",
          "screen.brand",
          `'${screen.brand}' 는 알 수 없는 브랜드 slug 입니다. base(블루) 로 silent 폴백되어 색이 틀어집니다. 허용: ${[...ctx.brands].join(", ")}.`,
        );
      } else if (canon) {
        canonicalBrand = canon;
      }
    }
    if (!screen.surface) {
      add("missing-field", "error", "screen.surface", "surface('web'|'app') 가 필요합니다.");
    } else if (screen.surface !== "web" && screen.surface !== "app") {
      add(
        "invalid-surface",
        "error",
        "screen.surface",
        `surface 는 'web' 또는 'app' 이어야 합니다 (받음: ${String(screen.surface)}).`,
      );
    }
    if (!screen.intent || String(screen.intent).trim() === "") {
      add("missing-field", "warn", "screen.intent", "intent(화면 한 줄 설명) 가 비었습니다.");
    }

    // ── Page Pattern System 브랜드 어드민이면 5종 Page Pattern 중 하나를 선언했는지 강제 ──
    //   적용 여부 = 브랜드 프로필 admin.pagePatternSystem (현재 선언 브랜드 = cashwalk-biz).
    //   어드민 화면은 Onboarding/Dashboard/List/Detail/Form 5종으로 표준화. 코드 직전 게이트에서
    //   "분류부터 한다"(pattern:cashwalk-biz-page-patterns)를 권고가 아닌 하드 룰로 강제한다.
    //   surfaceKind 는 모델 선언 또는 saveDesignSpec 가 nudge.surface 마커에서 주입.
    if (
      getBrandProfile(canonicalBrand)?.admin?.pagePatternSystem &&
      screen.surfaceKind === "admin"
    ) {
      if (!screen.pagePattern) {
        add(
          "cashwalk-biz-admin-page-pattern",
          "error",
          "screen.pagePattern",
          `캐포비 어드민 화면은 Page Pattern 을 먼저 선언해야 합니다 — screen.pagePattern 에 ${CASHWALK_BIZ_PAGE_PATTERNS.join(
            "|",
          )} 중 하나. get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }) 로 5종 확인.`,
        );
      } else if (!canonicalPagePattern(screen.pagePattern)) {
        add(
          "cashwalk-biz-admin-page-pattern",
          "error",
          "screen.pagePattern",
          `'${screen.pagePattern}' 는 캐포비 어드민 5종 패턴이 아닙니다. 허용값: ${CASHWALK_BIZ_PAGE_PATTERNS.join(
            "|",
          )}.`,
        );
      }
    } else if (screen.pagePattern && !canonicalPagePattern(screen.pagePattern)) {
      // 어드민이 아니어도 잘못된 패턴 값이면 오타로 보고 잡아준다.
      add(
        "cashwalk-biz-admin-page-pattern",
        "warn",
        "screen.pagePattern",
        `'${screen.pagePattern}' 는 알 수 없는 Page Pattern 입니다. 허용값: ${CASHWALK_BIZ_PAGE_PATTERNS.join(
          "|",
        )}.`,
      );
    }
  }

  // ── tree ──
  const visit = (node: unknown, p: string): void => {
    if (node == null || typeof node !== "object" || Array.isArray(node)) {
      add("invalid-node", "error", p, "노드는 { component } 객체여야 합니다.");
      return;
    }
    const n = node as DesignSpecNode;

    if (!n.component || typeof n.component !== "string") {
      add("missing-field", "error", `${p}.component`, "component 가 필요합니다.");
    } else {
      const { pascal, ndsTag, known, isPrimitive } = resolveComponent(n.component);
      if (known && pascal) componentsUsed.add(pascal);
      if (!known && !isPrimitive) {
        add(
          "unknown-component",
          "warn",
          `${p}.component`,
          `'${n.component}' 는 DS 카탈로그에 없습니다. find_component 로 확인하거나 레이아웃 프리미티브(Stack/Row/Box...)를 쓰세요.`,
        );
      }

      // prop enum + raw-color 검증
      if (n.props && typeof n.props === "object" && !Array.isArray(n.props)) {
        const enumMap = new Map<string, string[]>();
        if (pascal && ctx.propAllowedValues.has(pascal)) {
          for (const [k, v] of ctx.propAllowedValues.get(pascal)!) enumMap.set(k, v);
        }
        if (ndsTag && ctx.ndsAttrEnums.has(ndsTag)) {
          for (const [k, v] of ctx.ndsAttrEnums.get(ndsTag)!)
            if (!enumMap.has(k)) enumMap.set(k, v);
        }
        for (const [k, raw] of Object.entries(n.props)) {
          const val = String(raw);
          if (HEX_RE.test(val) || RGB_RE.test(val)) {
            add(
              "raw-hex-prop",
              "error",
              `${p}.props.${k}`,
              `prop 값에 raw 색('${val}') — 시멘틱 토큰 이름(--semantic-*)을 쓰세요.`,
            );
          }
          const allowed = enumMap.get(k);
          if (allowed && allowed.length > 0 && !allowed.includes(val)) {
            add(
              "invalid-prop-value",
              "error",
              `${p}.props.${k}`,
              `'${val}' 는 ${n.component}.${k} 허용값이 아닙니다: ${allowed.join("|")}.`,
            );
          }
        }
      }

      // 토큰 검증 (시멘틱 only, hex 금지, 카탈로그 존재)
      if (Array.isArray(n.tokens)) {
        for (const t of n.tokens) {
          const name = stripVar(String(t));
          if (HEX_RE.test(name) || RGB_RE.test(name)) {
            add(
              "raw-hex-token",
              "error",
              `${p}.tokens`,
              `'${t}' 는 raw 색입니다 — --semantic-* 토큰 이름을 쓰세요.`,
            );
            continue;
          }
          if (!name.startsWith("--")) {
            add(
              "token-not-a-var",
              "warn",
              `${p}.tokens`,
              `'${t}' 는 CSS 변수 형태가 아닙니다 — '--semantic-*' 토큰 이름을 쓰세요.`,
            );
            continue;
          }
          tokensUsed.add(name);
          if (!ctx.tokenSet.has(name)) {
            add(
              "unknown-token",
              "error",
              `${p}.tokens`,
              `'${name}' 토큰이 카탈로그에 없습니다. find_token 으로 확인하세요.`,
            );
          } else if (RAW_PALETTE_RE.test(name)) {
            add(
              "raw-palette-token",
              "warn",
              `${p}.tokens`,
              `'${name}' 는 raw 팔레트 토큰입니다 — --semantic-* 를 우선 사용하세요.`,
            );
          }
        }
      }

      // 추적성 nudge: DS 컴포넌트인데 role/rationale 둘 다 없음
      if (known && !n.role && !n.rationale) {
        add(
          "missing-rationale",
          "info",
          p,
          `${n.component}: role 이나 rationale 을 적으면 왜 이 컴포넌트인지 추적할 수 있습니다.`,
        );
      }
    }

    if (n.children !== undefined) {
      if (!Array.isArray(n.children)) {
        add("invalid-node", "error", `${p}.children`, "children 은 배열이어야 합니다.");
      } else {
        n.children.forEach((c, i) => visit(c, `${p}.children[${i}]`));
      }
    }
  };

  if (!Array.isArray(spec.tree) || spec.tree.length === 0) {
    add("missing-field", "error", "tree", "tree (컴포넌트 노드 배열) 가 필요합니다.");
  } else {
    spec.tree.forEach((node, i) => visit(node, `tree[${i}]`));
  }

  if (!Array.isArray(spec.decisions) || spec.decisions.length === 0) {
    add(
      "missing-rationale",
      "info",
      "decisions",
      "decisions[] 가 비었습니다 — 화면 차원 디자인 결정을 한두 줄 남기면 추적성이 올라갑니다.",
    );
  }

  return finalize(violations, canonicalBrand, componentsUsed, tokensUsed);
}

function finalize(
  violations: DesignSpecViolation[],
  brand: string | null,
  componentsUsed: Set<string>,
  tokensUsed: Set<string>,
): ValidateDesignSpecResult {
  const error = violations.filter((v) => v.severity === "error").length;
  const warn = violations.filter((v) => v.severity === "warn").length;
  const info = violations.filter((v) => v.severity === "info").length;
  const hasErrors = error > 0;
  return {
    ok: !hasErrors,
    violations,
    summary: { error, warn, info, hasErrors },
    brand,
    componentsUsed: [...componentsUsed].sort(),
    tokensUsed: [...tokensUsed].sort(),
    nextStep: hasErrors
      ? "❌ 스펙에 error 가 있습니다. 위 violations 를 고쳐 다시 save_design_spec 한 뒤, ok:true 가 되면 진행하세요. (아직 HTML/코드를 쓰지 마세요.)"
      : "✅ 스펙 유효. ⛔ 지금은 코드/HTML 을 작성하지 말고 이번 턴을 여기서 멈추세요. 사용자가 이 스펙을 승인하면 다음 턴에서 컴포넌트 가이드 → index.html → validate → build 로 진행합니다. (stream 세션에서는 사용자가 카드의 [승인] 을 누르면 다음 턴이 시작됩니다.)",
  };
}

/** spec 입력이 문자열(JSON)이면 파싱, 객체면 그대로. */
export function parseDesignSpecInput(raw: unknown): { spec: unknown; parseError: string | null } {
  if (typeof raw === "string") {
    try {
      return { spec: JSON.parse(raw), parseError: null };
    } catch (e) {
      return { spec: null, parseError: (e as Error).message };
    }
  }
  return { spec: raw, parseError: null };
}

/** 검증 후 cwd 에 design-spec.json 을 쓴다. ok=false 여도 파일은 써서(최신 시도 반영) 검수 가능하게 한다. */
export function saveDesignSpec(args: {
  spec?: unknown;
  cwd?: string;
  fileName?: string;
}): SaveDesignSpecResult {
  const { spec: rawSpec, parseError } = parseDesignSpecInput(args.spec);
  if (parseError) {
    return {
      ok: false,
      violations: [
        {
          rule: "invalid-json",
          severity: "error",
          path: "$",
          message: `spec JSON 파싱 실패: ${parseError}`,
        },
      ],
      summary: { error: 1, warn: 0, info: 0, hasErrors: true },
      brand: null,
      componentsUsed: [],
      tokensUsed: [],
      nextStep: "spec 을 유효한 JSON(객체 또는 JSON 문자열)으로 다시 전달하세요.",
      written: false,
      path: null,
      humanReadable: "❌ spec JSON 파싱 실패.",
    };
  }

  const dir = args.cwd ? path.resolve(args.cwd) : process.cwd();

  // surfaceKind 미선언 시 nudge.surface 마커(admin/service)에서 자동 주입 — 마커가 reliable SSOT 이라
  // 모델이 빠뜨려도 캐포비 어드민 Page Pattern 게이트가 동작한다. (이미 선언됐으면 존중.)
  if (rawSpec && typeof rawSpec === "object" && !Array.isArray(rawSpec)) {
    const screen = (rawSpec as Partial<DesignSpec>).screen;
    if (screen && typeof screen === "object" && !screen.surfaceKind) {
      const marker = readSurfaceMarker(dir);
      if (marker) screen.surfaceKind = marker;
    }
    // pagePattern 미선언 시 nudge.pagePattern 마커에서 자동 주입 — 데스크탑 추천 카드에서 사용자가
    // 고른 패턴을 마커로 박아두면, 모델이 빠뜨려도 캐포비 어드민 5종 게이트가 통과한다. (선언됐으면 존중.)
    if (screen && typeof screen === "object" && !screen.pagePattern) {
      const pp = readPagePatternMarker(dir);
      if (pp) screen.pagePattern = pp;
    }
  }

  const result = validateDesignSpec(rawSpec);
  const fileName = args.fileName ?? "design-spec.json";
  const outPath = path.join(dir, fileName);
  let written = false;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(rawSpec, null, 2) + "\n", "utf-8");
    written = true;
  } catch {
    written = false;
  }

  // 저장 성공 + 결정 내용이 있으면 designDecisions.jsonl 에 한 줄 누적 (best-effort, never throws).
  if (written) {
    const row = buildDesignDecisionRow(rawSpec, result, new Date().toISOString());
    if (row) appendDesignDecisionRow(dir, row);
  }

  return {
    ...result,
    written,
    path: written ? outPath : null,
    humanReadable: `${result.ok ? "✅" : "❌"} DesignSpec ${
      written ? `저장됨 → ${outPath}` : "(저장 실패)"
    } · error ${result.summary.error} / warn ${result.summary.warn} / info ${result.summary.info}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Decision Log — 결정(decisions + node rationale) 추출/누적 (순수 코어 + IO 분리)
// ─────────────────────────────────────────────────────────────────────────────

/** 트리를 깊이우선으로 돌며 rationale 이 있는 노드만 경로와 함께 수집한다(순수). */
function collectNodeRationales(
  tree: DesignSpecNode[],
): { path: string; component: string; rationale: string }[] {
  const out: { path: string; component: string; rationale: string }[] = [];
  const walk = (node: unknown, p: string): void => {
    if (node == null || typeof node !== "object" || Array.isArray(node)) return;
    const n = node as DesignSpecNode;
    if (typeof n.rationale === "string" && n.rationale.trim() !== "") {
      out.push({
        path: p,
        component: typeof n.component === "string" ? n.component : "?",
        rationale: n.rationale.trim(),
      });
    }
    if (Array.isArray(n.children)) n.children.forEach((c, i) => walk(c, `${p}.children[${i}]`));
  };
  tree.forEach((node, i) => walk(node, `tree[${i}]`));
  return out;
}

/** 결정 내용(screen+decisions+rationales)의 12자리 안정 해시 — 중복 누적 방지용. */
function stableDecisionHash(content: unknown): string {
  return crypto.createHash("sha1").update(JSON.stringify(content)).digest("hex").slice(0, 12);
}

/**
 * 저장된 spec 에서 결정 로그 한 행을 만든다(순수 — ts 는 호출부가 주입).
 * 결정 내용(decisions·rationale)이 전혀 없으면 null — '결정 로그'는 저장 로그가 아니다.
 */
export function buildDesignDecisionRow(
  rawSpec: unknown,
  result: ValidateDesignSpecResult,
  ts: string,
): DesignDecisionRow | null {
  if (rawSpec == null || typeof rawSpec !== "object" || Array.isArray(rawSpec)) return null;
  const spec = rawSpec as Partial<DesignSpec>;
  const decisions = Array.isArray(spec.decisions)
    ? spec.decisions.filter((d): d is string => typeof d === "string" && d.trim() !== "")
    : [];
  const rationales = Array.isArray(spec.tree) ? collectNodeRationales(spec.tree) : [];
  if (decisions.length === 0 && rationales.length === 0) return null;

  const screen = {
    brand: spec.screen?.brand,
    surface: spec.screen?.surface,
    intent: spec.screen?.intent,
    name: spec.screen?.name,
  };
  // ok 를 해시에 포함 — auto-fix 루프에서 결정은 그대로인데 validation 이 false→true 로 바뀌면
  // 새 행으로 남겨 '최종 승인된 상태'가 로그에 반영되게 한다(검증 전이 추적).
  const content = { screen, decisions, rationales, ok: result.ok };
  return {
    ts,
    specVersion: spec.specVersion,
    ok: result.ok,
    screen,
    decisions,
    rationales,
    componentsUsed: result.componentsUsed,
    tokensUsed: result.tokensUsed,
    hash: stableDecisionHash(content),
  };
}

/**
 * 결정 행을 designDecisions.jsonl 에 누적한다(best-effort, never throws).
 * - 같은 화면(brand·surface·intent·name)의 가장 최근 행과 hash 가 같으면 건너뛴다
 *   (재저장·auto-fix 루프 중복 방지. 화면을 번갈아 저장해도 각 화면 기준으로 비교).
 * - maxRows 초과분은 오래된 행부터 버린다(상한 유지 → 읽기/git 비용 bounded). 깨진 행은 자가치유로 제거.
 * @returns 실제로 행을 추가했으면 true.
 */
export function appendDesignDecisionRow(
  dir: string,
  row: DesignDecisionRow,
  fileName: string = DESIGN_DECISIONS_FILE,
  maxRows: number = DESIGN_DECISIONS_MAX_ROWS,
): boolean {
  try {
    const existing = readDesignDecisions(dir, fileName);
    const key = screenKey(row.screen);
    for (let i = existing.length - 1; i >= 0; i--) {
      if (screenKey(existing[i].screen) === key) {
        if (existing[i].hash === row.hash) return false; // 같은 화면의 직전 결정과 동일 → 생략
        break;
      }
    }
    const next = [...existing, row];
    const capped = maxRows > 0 && next.length > maxRows ? next.slice(next.length - maxRows) : next;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, fileName),
      capped.map((r) => JSON.stringify(r)).join("\n") + "\n",
      "utf-8",
    );
    return true;
  } catch {
    return false;
  }
}
