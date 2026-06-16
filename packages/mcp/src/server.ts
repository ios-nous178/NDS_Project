#!/usr/bin/env node
/**
 * Nudge DS MCP Server
 *
 * 외부 목업 프로젝트에서 Claude가 DS의 컴포넌트/아이콘/토큰을 조회하고
 * 작성한 mockup .tsx 파일을 검증할 수 있도록 도구를 노출한다.
 *
 * 실행: node dist/server.js
 * 등록: ~/.claude/settings.json 또는 외부 프로젝트의 .claude/settings.json
 *   {
 *     "mcpServers": {
 *       "nudge-ds": {
 *         "command": "node",
 *         "args": ["<repoRoot>/packages/mcp/dist/server.js"]
 *       }
 *     }
 *   }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ICON_METADATA,
  ICON_CATEGORY_LABELS,
  getIconCategoryIndex,
  type IconCategory,
} from "./guides.js";
import type { Catalog, Manifest, McpbManifest } from "./types/manifest.js";
import {
  ASSET_CATALOG,
  ASSET_CATALOG_SUMMARY,
  type AssetCatalogEntry,
} from "./asset-catalog.generated.js";
import { configureMockupValidator } from "./tools/mockup-validator.js";
export { validateMockupSource } from "./tools/mockup-validator.js";
import {
  configureHtmlValidator,
  validateHtmlMockup,
  deductionsByDimension,
} from "@nudge-design/mockup-core/tools/html-validator";
export { validateHtmlSource } from "@nudge-design/mockup-core/tools/html-validator";
// 품질 점수 SSOT(데스크톱 하네스와 공유) — D2 정성 채점 + verdict/포맷.
import {
  formatScoreCard,
  gateGuidance,
  SCORE_THRESHOLDS,
  VERDICT_LABELS,
  type LlmScoreResult,
} from "@nudge-design/mockup-core/tools/quality-score-core";
import { scoreMockupQuality } from "@nudge-design/mockup-core/tools/quality-score-runner";
import { resolveClaudeBin } from "./claude-bin.js";
// validate_html_mockup 컨텍스트 도출 SSOT — 데스크탑 하네스(catalog.ts)도 같은 헬퍼를 쓴다.
import { deriveHtmlValidationContext } from "@nudge-design/mockup-core/tools/catalog-config";
import { configureUsageCatalog } from "@nudge-design/mockup-core/tools/usage/parser";
import {
  analyzeHtmlMockup,
  convertHtmlToDsHtml,
  reportHtmlMockupUsage,
} from "@nudge-design/mockup-core/tools/html-analyzer";
import type { AnalyzeHtmlMockupResult } from "@nudge-design/mockup-core/tools/html-analyzer";
export { countHtmlUsage } from "@nudge-design/mockup-core/tools/html-analyzer";
import { devServer, registerDevServerCleanup } from "@nudge-design/mockup-core/tools/preview";
import {
  canonicalBrandSlug,
  listStandaloneBrands,
} from "@nudge-design/mockup-core/tools/standalone-assets";
import { recommendPagePattern } from "@nudge-design/mockup-core/tools/page-pattern-recommender";
import {
  attachUsageGuardOutcome,
  flushPendingUsageWebhookQueue,
  runUsageGuards,
} from "./tools/usage.js";
import { captureContext } from "./tools/context-capture.js";
import { captureTelemetry } from "./tools/telemetry-egress.js";
import { captureTranscriptFeedback } from "./tools/feedback-capture.js";
import { buildSinglefileHtml } from "@nudge-design/mockup-core/tools/build-html";
import { validatePrdCoverage } from "@nudge-design/mockup-core/tools/prd-coverage";
import { getGuide, listFigmaSyncStatus, VISUAL_REFERENCE_QUESTION } from "./tools/guides.js";
import { configureDesignSpec, saveDesignSpec, validateDesignSpec } from "./tools/design-spec.js";
import { configureSetup, getBrand, getSetup } from "./tools/setup.js";
import { recordObservability } from "./tools/observability-sink.js";
import { registerToolHandlers, type ToolArgs, type ToolHandlers } from "./tools/registry.js";
import { configureClientIdentity } from "./tools/client-identity.js";
import { getIconSvg } from "./icon-svg.js";
import {
  markVisualRefEmitted,
  noteReportSent,
  noteReportSuppressed,
  principlesAcked,
  principlesCalledAt,
  visualRefEmitted,
} from "./tools/session-state.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function remoteIconModuleRef(): string | undefined {
  const base = process.env.NUDGE_DS_ICON_BASE_URL?.trim();
  if (!base) return undefined;
  return `${base.replace(/\/+$/, "")}/vanilla.js`;
}

const isDirectRun =
  process.argv[1] !== undefined &&
  pathToFileURL(fs.realpathSync(path.resolve(process.argv[1]))).href ===
    pathToFileURL(fs.realpathSync(fileURLToPath(import.meta.url))).href;
const catalogPath = path.resolve(__dirname, "../catalog.json");
const mcpbManifestPath = path.resolve(__dirname, "../manifest.json");

function loadMcpbManifest(): McpbManifest | null {
  try {
    if (!fs.existsSync(mcpbManifestPath)) return null;
    return JSON.parse(fs.readFileSync(mcpbManifestPath, "utf-8")) as McpbManifest;
  } catch {
    return null;
  }
}

const mcpbManifest = loadMcpbManifest();

// @nudge-design/assets 는 DS 본 버전과 별도 트랙 → MCPB 스키마가 커스텀 top-level 키
// (asset_version)를 거부하므로 server.mcp_config.env 에 NUDGE_DS_ASSET_VERSION 으로 싣는다.
// mcpb 모드: 그 env 가 프로세스에 주입(process.env). source/dev 모드: manifest 객체의 env
// 블록에서 읽는다. 옛 번들(top-level asset_version) 호환으로 마지막에 폴백.
const bundledAssetVersion =
  process.env.NUDGE_DS_ASSET_VERSION ??
  mcpbManifest?.server?.mcp_config?.env?.NUDGE_DS_ASSET_VERSION ??
  mcpbManifest?.asset_version ??
  undefined;

// MCP가 실행되는 형태에 따라 "외부 자산이 어디 있느냐"가 달라진다.
// 1) 개발 모드 (모노레포에서 직접 실행): 레포 루트가 있고 local-packages/*.tgz, brands/* 등을 참조 가능
// 2) mcpb 번들 (Claude Desktop이 압축을 풀어 실행): 같은 디렉터리 안에 local-packages/만 동봉되어 있고
//    leleos 레포 자체는 없다. install/update 안내가 달라야 한다.
const installMode: "dev" | "mcpb" = (() => {
  const env = process.env.NUDGE_DS_INSTALL_MODE;
  if (env === "mcpb" || env === "dev") return env;
  // dev 추정: packages/tokens 같은 모노레포 디렉터리가 보이면 dev
  const guessedRoot = path.resolve(__dirname, "../../..");
  if (fs.existsSync(path.join(guessedRoot, "packages/tokens/package.json"))) return "dev";
  return "mcpb";
})();

const repoRoot = process.env.NUDGE_DS_REPO_ROOT
  ? path.resolve(process.env.NUDGE_DS_REPO_ROOT)
  : installMode === "dev"
    ? path.resolve(__dirname, "../../..")
    : path.resolve(__dirname, ".."); // mcpb 번들 루트 = packages/mcp/

function checkCatalogFreshness() {
  if (installMode !== "dev") return; // mcpb 번들은 외부 dist 가 없음
  if (!fs.existsSync(catalogPath)) return;
  const catalogMtime = fs.statSync(catalogPath).mtimeMs;
  const sources = [
    "packages/tokens/dist/tokens.css",
    "packages/react/dist/index.d.ts",
    "packages/icons/dist/index.d.ts",
  ];
  // 기본은 경고(인터랙티브 dev 의 tsc --watch 플로우 보호).
  // NUDGE_DS_CATALOG_STRICT=1 또는 CI 에서는 하드 실패 — stale catalog 로 기동한 서버가
  // 외부 소비자에게 낡은 컴포넌트/토큰 메타를 서빙하는 경로를 차단한다.
  const strict = process.env.NUDGE_DS_CATALOG_STRICT === "1" || !!process.env.CI;
  for (const rel of sources) {
    const p = path.join(repoRoot, rel);
    if (fs.existsSync(p) && fs.statSync(p).mtimeMs > catalogMtime) {
      const msg =
        `catalog may be stale (${rel} is newer). ` +
        `Run 'pnpm build --filter @nudge-design/mcp' in DS repo to refresh.`;
      if (strict) {
        console.error(`[nudge-mcp] ERROR: ${msg} (strict mode — NUDGE_DS_CATALOG_STRICT/CI)`);
        process.exit(1);
      }
      console.error(`[nudge-mcp] WARN: ${msg}`);
      return;
    }
  }
}

function loadManifest(): Manifest {
  if (!fs.existsSync(catalogPath)) {
    throw new Error(
      `catalog.json not found at ${catalogPath}. Run 'pnpm --filter @nudge-design/mcp build:manifest' first.`,
    );
  }
  const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf-8")) as Catalog;
  return { ...parsed, repoRoot };
}

if (isDirectRun) checkCatalogFreshness();
const manifest = loadManifest();
const componentByName = new Map(manifest.components.map((c) => [c.name, c]));
const iconSet = new Set(manifest.icons);
const tokenSet = new Set(manifest.tokens.map((t) => t.name));

// 컴포넌트별 prop union 허용값 맵. 카탈로그에서 allowedValues 가 있는 prop 만 채워서
// validate_mockup 이 invalid-prop-value 룰로 검출할 수 있게 한다.
const propAllowedValues = new Map<string, Map<string, string[]>>();
for (const comp of manifest.components) {
  const propMap = new Map<string, string[]>();
  for (const p of comp.props) {
    if (p.allowedValues && p.allowedValues.length > 0) propMap.set(p.name, p.allowedValues);
  }
  if (propMap.size > 0) propAllowedValues.set(comp.name, propMap);
}

configureMockupValidator({
  tokenSet,
  componentNames: new Set(componentByName.keys()),
  iconSet,
  propAllowedValues,
});

// usage 집계기(parser)에도 같은 카탈로그를 주입 — non-DS 요소를 avoidable(대체재 있음) vs
// forced(대체재 없음)로 정밀 분류해 adoptionRatio(A) / overallRatio(B)를 산출하게 한다.
configureUsageCatalog(new Set(componentByName.keys()));

// validate_html_mockup 용 context (nds-* 태그/클래스 prefix/attr enum 셋) — 도출 로직은
// mockup-core 의 catalog-config(deriveHtmlValidationContext)가 SSOT 다. 예전엔 server.ts 가
// 같은 보강 목록(EXTRA 태그/prefix)을 인라인으로 손-동기화했지만, 데스크탑 하네스(catalog.ts)와
// 어긋나면 unknown-nds-tag 검출이 한쪽에서 조용히 무력화될 위험이 있어 공유 헬퍼로 단일화했다.
// DesignSpec 검증기도 같은 ndsAttrEnums 를 재사용한다(아래 configureDesignSpec).
const htmlCtx = deriveHtmlValidationContext(manifest);
configureHtmlValidator(htmlCtx);

// DesignSpec(경량 IR) 검증기에도 같은 카탈로그를 주입한다 — prompt→spec→code 의 코드前 검증용.
// 브랜드 셋은 자산 디렉토리에서 읽으므로(런타임엔 번들/dev 양쪽 해석됨) 방어적으로 — 미해석 시
// brand 엄격검사는 design-spec 쪽에서 자동 skip 된다.
let standaloneBrandSet = new Set<string>();
try {
  standaloneBrandSet = new Set(listStandaloneBrands());
} catch {
  standaloneBrandSet = new Set();
}
configureDesignSpec({
  tokenSet,
  componentNames: new Set(componentByName.keys()),
  brands: standaloneBrandSet,
  propAllowedValues,
  ndsAttrEnums: htmlCtx.ndsAttrEnums,
});

// mcpb 번들은 packages/mcp/ 옆에 local-packages/ 를 동봉, dev 모드는 레포 루트 아래.
const tgzDirDefault =
  installMode === "mcpb"
    ? path.resolve(__dirname, "../local-packages")
    : path.join(manifest.repoRoot, "local-packages");

configureSetup({ manifest, installMode, mcpbManifest, tgzDirDefault });

/* ───────────── 검색 점수 ───────────── */

function scoreMatch(query: string, name: string): number {
  const q = query.toLowerCase();
  const n = name.toLowerCase();
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  const tokens = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const t of tokens) if (n.includes(t)) s += 20;
  return s;
}

/**
 * 컴포넌트 검색 별칭 — substring 기반 scoreMatch 가 0점을 주는 흔한 약어·한글 질의를
 * 가산 보정한다. **가산만** 하고 기존 매치는 절대 제거하지 않으므로 오탐의 최악 사례는
 * "후보가 하나 늘어남" 수준(틀린 단독 매치가 아님). key = 컴포넌트 이름에 substring 으로
 * 존재하는 정규 영문, value = 그 별칭들(소문자). 예: '버튼' → name 에 'button' 포함 → Button.
 */
const COMPONENT_SEARCH_ALIASES: Record<string, string[]> = {
  button: ["btn", "버튼"],
  select: ["dropdown", "셀렉트", "드롭다운"],
  input: ["인풋", "텍스트필드"],
  checkbox: ["체크박스"],
  radio: ["라디오"],
  modal: ["모달", "다이얼로그", "dialog"],
  toggle: ["스위치", "switch"],
  chip: ["칩"],
  tabs: ["탭"],
  tooltip: ["툴팁"],
  badge: ["뱃지", "배지"],
  toast: ["토스트"],
  card: ["카드"],
  avatar: ["아바타"],
  // AddressPicker — 작성자가 주소 입력을 plain input/select 로 손조립하지 않게 발견성 보강.
  // (canonical "address" 가 "AddressPicker" 의 substring 이라 매칭됨)
  address: ["주소", "주소입력", "주소검색", "우편번호", "도로명", "지번", "postal", "zipcode"],
};

/** 별칭이 정규 영문을 포함하는 이름과 맞으면 substring(60) 보다 낮은 50점을 준다. */
function aliasScore(query: string, name: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const n = name.toLowerCase();
  for (const [canonical, aliases] of Object.entries(COMPONENT_SEARCH_ALIASES)) {
    if (n.includes(canonical) && aliases.includes(q)) return 50;
  }
  return 0;
}

/* ───────────── Tool 핸들러 ───────────── */

function clampLimit(value: unknown, fallback: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.min(Math.floor(value), max))
    : fallback;
}

function searchComponent(query: string, limit = 10) {
  return manifest.components
    .map((c) => ({
      name: c.name,
      htmlTag: c.htmlTag,
      propsCount: c.props?.length ?? 0,
      guideHint: getComponentGuideHint(c.name),
      score: Math.max(scoreMatch(query, c.name), aliasScore(query, c.name)),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function getComponentGuideHint(name: string): string | undefined {
  if (name === "BrandHeader") {
    return "브랜드 웹/앱 헤더는 직접 조립하지 말고 get_guide({ topic: 'component:BrandHeader', target: 'html' }) 확인 후 <nds-brand-header> 사용.";
  }
  if (name === "BrandFooter") {
    return "브랜드 웹/앱 푸터는 직접 조립하지 말고 get_guide({ topic: 'component:BrandFooter', target: 'html' }) 확인 후 <nds-brand-footer> 사용.";
  }
  if (name === "BrandChrome") {
    return "Wrapper/umbrella 항목입니다. 실제 목업에서는 BrandHeader + BrandFooter 가이드를 우선 호출하세요.";
  }
  return undefined;
}

/**
 * find_component 통합 라우터.
 *  - 인자 없음 → 전체 컴포넌트 목록
 *  - { name } → 슬림 응답 (name, htmlTag, props 개수, prop name 만). verbose:true 면 full 스펙.
 *  - { query } → fuzzy 점수 매치
 *  - 둘 다 → name 우선
 *
 * verbose default false 인 이유: 컴포넌트 한 개의 full props 가 type/allowedValues 까지
 * 펼치면 수 KB. 한 번에 9개씩 병렬 호출하던 사용 패턴에서 토큰을 크게 잡아먹었다.
 * 슬림 응답이면 prop 존재 여부 확인엔 충분하고, 시그니처 까지 필요하면 verbose:true 로 명시.
 */
// export: find-miss.test.ts 의 query-miss 대칭 / 별칭 회귀 테스트용 (런타임 동작 변경 없음).
export function findComponent(args: {
  name?: string;
  query?: string;
  limit?: number;
  verbose?: boolean;
}) {
  const limit = clampLimit(args.limit, 20, 100);
  if (args.name) {
    const c = componentByName.get(args.name);
    if (!c) {
      return {
        error: `Component '${args.name}' not found. Try find_component({ query: '${args.name}' }) or call with no args to list all.`,
        suggestions: searchComponent(args.name, 3),
      };
    }
    if (args.verbose) return c;
    // Slim: prop name / optional 만. 시그니처(type/allowedValues) 가 필요하면 verbose:true.
    return {
      name: c.name,
      htmlTag: c.htmlTag,
      dtsRelPath: c.dtsRelPath,
      propsCount: c.props?.length ?? 0,
      props: (c.props ?? []).map((p) => ({
        name: p.name,
        ...(p.optional === false ? { required: true } : {}),
      })),
      ...(getComponentGuideHint(c.name) ? { guideHint: getComponentGuideHint(c.name) } : {}),
      _hint:
        "Slim response — prop names only. Pass verbose:true for full signatures (type/allowedValues/etc). For usage examples + guidance, prefer get_guide({ topic: `component:${c.name}` }).",
    };
  }
  if (args.query) {
    const results = searchComponent(args.query, clampLimit(args.limit, 10, 50));
    if (results.length === 0) {
      // name-miss 경로와 대칭: 빈 배열([]) 대신 error+suggestions 를 돌려준다. []는 외부
      // 에이전트가 "컴포넌트 없음 → native 직접 작성" 으로 오판하게 만들고(실제로는 존재),
      // 그 오판이 taxonomy-gap 신호로 집계되면 수집 데이터까지 오염된다.
      return {
        error: `No component matched query '${args.query}'. Call find_component with no args to list all components, or check spelling/synonyms.`,
        suggestions: [],
      };
    }
    return results;
  }
  return {
    _hint:
      "No-arg call returns a capped component name list. Use `{ query }` or `{ name }` for details.",
    total: manifest.components.length,
    limit,
    components: manifest.components.map((c) => c.name).slice(0, limit),
  };
}

function decorateIcon(name: string) {
  const meta = ICON_METADATA[name];
  if (!meta) return { name };
  return {
    name,
    category: meta.category,
    categoryLabel: ICON_CATEGORY_LABELS[meta.category],
    style: meta.style,
    pair: meta.pair,
  };
}

// 소셜/간편 로그인(네이버·카카오·구글·애플) 로고는 아이콘이 아니라 @nudge-design/assets 의
// sns-logos 자산이다. find_icon 으로 찾으면 0 매치 → 작성자가 이니셜/이모지로 때우거나 계속 헛삽질한다.
// 이 용어들이 들어오면 아이콘 검색을 끊고 자산 경로로 리다이렉트한다(오용 재발 방지).
const SOCIAL_LOGIN_TERMS =
  /(kakao|naver|google|apple|카카오|네이버|구글|애플|소셜|social|sns|oauth|간편)/i;
function socialLoginAssetRedirect(term: string) {
  if (!SOCIAL_LOGIN_TERMS.test(term)) return null;
  return {
    redirect: "sns-logos (asset, not icon)",
    detail: `소셜/간편 로그인 로고(네이버·카카오·구글·애플)는 아이콘이 아니라 @nudge-design/assets 의 sns-logos 자산입니다. find_icon 에는 없습니다 — 아래 자산 경로를 <img src> 에 그대로 박으면 build_singlefile_html 이 base64 인라인합니다.`,
    assets:
      "@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg — naver(white/main) · kakao(black/main) · google(white/main) · apple(white/black)",
    example:
      '<button style="height:48px;background:#FEE500"><img src="@nudge-design/assets/files/shared/sns-logos/kakao-black.svg" width="18" height="18" alt=""> 카카오로 시작하기</button>',
    seeAlso: [
      "get_guide({ topic: 'pattern:social-login' }) — 배치·서비스 시그니처 색·라벨 규칙",
      "get_brand({ assetKind: 'snsLogos' }) — 서비스별 inlineRef 경로 목록",
    ],
  };
}

/**
 * find_icon 통합 라우터.
 *  - { name } → 그 아이콘의 inline SVG (붙여 넣을 수 있는 완성형) + 메타
 *  - 인자 없음 → 카테고리별 count summary
 *  - { query } → top 10 점수 매치 (이름만 — SVG 가 필요하면 find_icon({ name }) 재호출)
 *  - { category } → 해당 카테고리 아이콘 목록
 */
// export: find-slim.test.ts 의 응답 슬림(토큰 절감) 회귀 테스트용 (런타임 동작 변경 없음).
export async function findIcon(args: {
  name?: string;
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
  size?: number;
}) {
  const categoryIndex = getIconCategoryIndex();
  const limit = clampLimit(args.limit, 20, 100);
  // { name } 정확 매치 → inline SVG 반환. 무번들러(데스크톱/외부 html)에서 npm 설치 없이
  // index.html 에 바로 붙여 넣을 수 있게 한다.
  if (args.name) {
    if (!iconSet.has(args.name)) {
      const social = socialLoginAssetRedirect(args.name);
      if (social) return social;
      const suggestions = manifest.icons
        .map((name) => ({ name, score: scoreMatch(args.name as string, name) }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((c) => c.name);
      return {
        error: `Icon '${args.name}' not found. find_icon({ query: '${args.name}' }) 로 검색하거나 아래 후보 확인.`,
        suggestions,
      };
    }
    try {
      const svg = await getIconSvg(args.name, args.size);
      if (!svg) {
        return {
          ...decorateIcon(args.name),
          error: `'${args.name}' 의 SVG 정의를 찾지 못했습니다(메타만 등록). 인라인 SVG 를 직접 작성하세요.`,
        };
      }
      // 캐포비 어드민 사이드바(GNB) 아이콘은 9종을 한 개씩 find_icon 하지 말고
      // ready-made 픽업(아이콘 이미 인라인)으로 유도 — 오용(9× 루프) 재발 방지.
      const isCashwalkBizGnb = /^CashwalkBizGnb/.test(args.name);
      return {
        ...decorateIcon(args.name),
        ...svg,
        remoteModule: remoteIconModuleRef(),
        _hint:
          (isCashwalkBizGnb
            ? "⚠ 캐포비 어드민 사이드바(GNB) 아이콘이면 9종을 한 개씩 find_icon 하지 말 것 — 아이콘이 이미 인라인된 ready-made 가 있다: get_guide({ topic: 'pattern:cashwalk-biz-admin-sidebar' }) (HTML/React + 로고 data URI). 가져와서 activeKey 만 화면 키로. 사이드바가 아닌 단독 아이콘 용도면 아래 svg 그대로 사용. "
            : "") +
          "svg 를 그대로 index.html 의 <nds-icon-button> 등 안에 붙여 넣으세요(npm 설치 불필요). " +
          "색은 부모의 color/currentColor 를 상속합니다.",
      };
    } catch (err) {
      return {
        ...decorateIcon(args.name),
        error: `아이콘 SVG 로드 실패: ${(err as Error).message}`,
      };
    }
  }
  if (args.query) {
    const social = socialLoginAssetRedirect(args.query);
    if (social) return social;
    // 이름 찾기 분기 — name(+분류용 category)만. categoryLabel/style/pair·SVG 는
    // 삽입 시점의 find_icon({ name }) 에서 제공(이미 그 경로 존재). score 는 정렬 후 drop.
    const matches = manifest.icons
      .map((name) => ({ name, score: scoreMatch(args.query as string, name) }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, clampLimit(args.limit, 10, 50));
    if (matches.length === 0) {
      // { name } 미스 경로와 대칭: 빈 배열 대신 error 를 돌려줘 "아이콘 전무" 오판을 막는다.
      return {
        error: `No icon matched query '${args.query}'. find_icon 인자 없이 호출하면 카테고리 인덱스를 볼 수 있습니다. 더 일반적인 영문 키워드로 다시 시도하세요.`,
        suggestions: [],
      };
    }
    return matches.map(({ name }) => {
      const category = ICON_METADATA[name]?.category;
      return category ? { name, category } : { name };
    });
  }
  if (args.category) {
    const category = args.category as IconCategory;
    const names = categoryIndex[category] ?? [];
    // offset 페이징 — limit 을 키우는 대신 다음 페이지를 넘겨 큰 카테고리도 슬림하게 순회.
    const offset = Math.max(0, Math.floor(args.offset ?? 0));
    const nextOffset = offset + limit < names.length ? offset + limit : null;
    return {
      category: args.category,
      label: ICON_CATEGORY_LABELS[category],
      total: names.length,
      limit,
      offset,
      ...(nextOffset !== null
        ? {
            nextOffset,
            _hint: `다음 페이지: find_icon({ category: '${args.category}', offset: ${nextOffset} })`,
          }
        : {}),
      icons: names.slice(offset, offset + limit).map(decorateIcon),
    };
  }
  return {
    _hint:
      "No-arg call returns only summary to save tokens. Use `{ query }` or `{ category }` for icons.",
    total: manifest.icons.length,
    categories: Object.fromEntries(
      Object.entries(categoryIndex).map(([cat, names]) => [
        cat,
        {
          label: ICON_CATEGORY_LABELS[cat as keyof typeof ICON_CATEGORY_LABELS],
          count: names.length,
          sample: names.slice(0, 5),
        },
      ]),
    ),
  };
}

/* ───────────── find_asset (브랜드 이미지 검색) ───────────── */

// 브랜드 콘텐츠 이미지는 **원칙적으로 항상 pull**. 미스 시 AI 생성 금지 → placeholder + 경고.
// 이 정책 문자열을 모든 find_asset 응답에 동봉해 "뭐가 있는지 몰라 못 가져옴 → 헛삽질/AI생성" 재발 차단.
const ASSET_POLICY =
  "에셋 정책: 이미지가 필요하면 ① 먼저 find_asset 으로 찾아 inlineRef 를 <img src> 에 그대로 박는다(build_singlefile_html 이 base64 인라인). ② 에셋에 없으면 회색 박스/empty-state placeholder 로 두고 '에셋 없음 — 추가 검토' 주석을 남긴다. ③ 브랜드 음식·일러스트·사진을 AI 로 생성하지 않는다(off-brand drift).";

// 한글/약어 → 카테고리·id 보조 검색어. 가산만 — 기존 매치를 제거하지 않으므로 오탐 최악은 "후보 1개 증가".
const ASSET_SEARCH_ALIASES: Record<string, string[]> = {
  음식: ["food", "food-types"],
  사진: ["image", "images"],
  이미지: ["image", "images"],
  프로필: ["profile", "profiles"],
  로고: ["logo", "logos"],
  일러스트: ["illustration", "illustrations"],
  대회: ["marathon", "event", "marathon-events"],
  마라톤: ["marathon", "marathon-events"],
  빈상태: ["empty", "empty-states"],
  플레이스홀더: ["empty", "empty-states", "placeholder"],
  카테고리: ["category", "category-heroes"],
  심리검사: ["psych", "psych-tests"],
  선물: ["gift"],
};

function scoreAsset(query: string, entry: AssetCatalogEntry): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  let best = Math.max(scoreMatch(q, entry.id), scoreMatch(q, entry.category));
  for (const tok of entry.search) {
    if (tok === q) best = Math.max(best, 90);
    else if (tok.includes(q) || q.includes(tok)) best = Math.max(best, 55);
  }
  for (const [alias, targets] of Object.entries(ASSET_SEARCH_ALIASES)) {
    if (!q.includes(alias)) continue;
    for (const t of targets) {
      if (entry.search.includes(t) || entry.category.includes(t)) best = Math.max(best, 50);
    }
  }
  return best;
}

function slimAsset(e: AssetCatalogEntry) {
  return {
    brand: e.brand,
    category: e.category,
    id: e.id,
    inlineRef: e.inlineRef,
    mimeType: e.mimeType,
    ...(e.retina ? { retina: e.retina } : {}),
  };
}

/**
 * find_asset 통합 라우터 — @nudge-design/assets 브랜드 이미지 검색(아이콘 아님).
 *  - 인자 없음 → 브랜드×카테고리 인덱스
 *  - { query } (+ brand/category 필터) → 점수 매치 top N (inlineRef 포함)
 *  - { id } → 정확/근접 id 매치
 *  - { brand } / { category } 만 → 해당 풀 목록
 * 모든 응답에 _policy(pull-first · 미스 placeholder · AI 브랜드이미지 금지) 동봉.
 */
export function findAsset(args: {
  query?: string;
  brand?: string;
  category?: string;
  id?: string;
  limit?: number;
}) {
  const limit = clampLimit(args.limit, 20, 60);
  const brand = args.brand ? canonicalBrandSlug(args.brand) ?? args.brand : undefined;
  let pool = ASSET_CATALOG;
  if (brand) pool = pool.filter((e) => e.brand === brand || e.brand === "shared");
  if (args.category) {
    const c = args.category.toLowerCase();
    pool = pool.filter((e) => e.category.toLowerCase().includes(c));
  }

  if (args.id) {
    const exact = pool.filter((e) => e.id === args.id);
    const hits = exact.length ? exact : pool.filter((e) => e.id.includes(args.id as string));
    if (!hits.length) {
      return {
        error: `에셋 id '${args.id}' 를 찾지 못했습니다${brand ? ` (brand=${brand})` : ""}. find_asset({ query }) 로 검색하거나 인자 없이 호출해 카테고리 인덱스를 보세요.`,
        miss: true,
        _policy: ASSET_POLICY,
      };
    }
    return { count: hits.length, assets: hits.slice(0, limit).map(slimAsset), _policy: ASSET_POLICY };
  }

  if (args.query) {
    const matches = pool
      .map((e) => ({ e, score: scoreAsset(args.query as string, e) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    if (!matches.length) {
      return {
        error: `No asset matched '${args.query}'${brand ? ` (brand=${brand})` : ""}. 인자 없이 find_asset 을 호출하면 브랜드×카테고리 인덱스를 볼 수 있습니다. 더 일반적인 키워드(food/profile/logo…)로 다시 시도하세요.`,
        miss: true,
        _onMiss:
          "에셋에 없는 이미지입니다 — AI 생성하지 말고 회색 박스/empty-state placeholder + '에셋 없음' 주석으로 두세요.",
        _policy: ASSET_POLICY,
      };
    }
    return { count: matches.length, assets: matches.map((m) => slimAsset(m.e)), _policy: ASSET_POLICY };
  }

  if (args.category || brand) {
    return {
      brand: brand ?? "(all)",
      category: args.category ?? "(all)",
      count: pool.length,
      assets: pool.slice(0, limit).map(slimAsset),
      ...(pool.length > limit
        ? { _hint: `${pool.length}개 중 ${limit}개만 표시. query 로 좁히거나 limit 를 키우세요.` }
        : {}),
      _policy: ASSET_POLICY,
    };
  }

  return {
    _hint:
      "이미지가 필요하면 find_asset({ query, brand }) 로 검색해 inlineRef 를 <img src> 에 박으세요(build_singlefile_html 이 base64 인라인). brand/category 로 필터, id 로 정확 매치.",
    total: ASSET_CATALOG.length,
    brands: ASSET_CATALOG_SUMMARY,
    _policy: ASSET_POLICY,
  };
}

/**
 * find_token 통합 라우터.
 *  - 인자 없음 → 그룹별 카운트 summary
 *  - { group } → 그룹 전체
 *  - { query } → 점수 기반 매치 (semantic 우선, raw palette deprioritize)
 *  - 둘 다 → query 우선
 */
// export: find-slim.test.ts 의 응답 슬림(토큰 절감) 회귀 테스트용 (런타임 동작 변경 없음).
export function findToken(args: { group?: string; query?: string; brand?: string }) {
  const requestedBrand = args.brand?.trim().toLowerCase() || undefined;
  const brand = requestedBrand ? (canonicalBrandSlug(requestedBrand) ?? requestedBrand) : undefined;
  // brand 필터:
  //  - 미지정 → base(shared, brands 필드 없음)만. 브랜드 고유 토큰이 크로스브랜드로
  //    새는 것을 막아 기존 nudge 워크플로우와 동일(예: mint 안 보임).
  //  - 지정 → shared + 그 브랜드 고유 토큰.
  const inBrand = (t: Manifest["tokens"][number]) =>
    brand ? !t.brands || t.brands.includes(brand) : !t.brands;
  // brand 지정 시 시멘틱 값을 그 브랜드 실제 값으로 치환해 보여준다(이름은 공통).
  const view = (t: Manifest["tokens"][number]) => {
    if (brand && t.brandValues && t.brandValues[brand] !== undefined) {
      const { brandValues: _bv, ...rest } = t;
      return { ...rest, value: t.brandValues[brand], baseValue: t.value, brand };
    }
    return t;
  };
  const pool = manifest.tokens.filter(inBrand);

  if (args.query) {
    const normalizedQuery = args.query.trim().toLowerCase();
    // score 는 정렬용 — 출력엔 싣지 않는다. policy 객체(safe+note)도 매 토큰 반복하지 않고,
    // 회피해야 할 raw palette 토큰에만 짧은 avoid 플래그를 단다(semantic 우선은 기본 기대).
    return pool
      .map((t) => ({ token: t, score: getTokenLookupScore(t, normalizedQuery) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ token }) =>
        isRawPaletteToken(token)
          ? { ...view(token), avoid: "raw palette — --semantic-* 토큰 우선" }
          : view(token),
      );
  }
  if (args.group) return pool.filter((t) => t.group === args.group).map(view);
  const groups: Record<string, number> = {};
  for (const t of pool) groups[t.group] = (groups[t.group] ?? 0) + 1;
  return {
    _hint:
      "Pass `group` (e.g. 'color', 'spacing', 'semantic') to get tokens, or `query` to search. Add `brand` (e.g. 'geniet', 'cashpobi') to scope to a brand's tokens + brand-specific values. No-arg call returns only the summary to save tokens.",
    total: pool.length,
    ...(brand ? { brand } : {}),
    ...(requestedBrand && brand && requestedBrand !== brand ? { requestedBrand } : {}),
    groups,
  };
}

function visualReferencePrompt(toolName: string) {
  return {
    rule: "visual-reference-first-response",
    tool: toolName,
    required: true,
    requiredFirstResponseQuestion: VISUAL_REFERENCE_QUESTION,
    fullGuide: "pattern:visual-reference",
    next: "Ask this before code or DS lookup. After the user answers, write references.md with task:<brand>-<screen-slug> and [good]/[bad] visual sources. Full gate details: get_guide({ topic:'pattern:visual-reference' }).",
  };
}

/**
 * 첫 호출 이후 재첨부되는 슬림 stub. 풀 게이트는 세션 첫 응답에서 100% 보존되고,
 * enforcement 는 툴 description / 생성된 CLAUDE.md / pattern:visual-reference 에도 상주하므로
 * 이후 응답은 운영 큐(task 슬러그 확인 + 풀 게이트 재조회 경로)만 1줄로 유지한다.
 */
function visualReferencePromptStub(toolName: string) {
  return {
    rule: "visual-reference-first-response",
    tool: toolName,
    required: false,
    recap:
      "레퍼런스 게이트는 이번 세션 첫 응답에서 안내됨. 새 mockup task 면 references.md 의 `task: <slug>` 가 현재 스코프(브랜드+화면)와 맞는지 확인 — 다르거나 없으면 get_guide({ topic: 'pattern:visual-reference' }) 로 풀 게이트 재조회.",
  };
}

// export: visual-reference-session.test.ts 의 세션-once 회귀 테스트용 (런타임 동작 변경 없음).
export function withVisualReferencePrompt<T>(toolName: string, result: T): T | object {
  // 세션 첫 호출만 풀 게이트, 이후엔 슬림 stub — 매 조회 응답의 풀 블록 재첨부는 순수 중복.
  const prompt = visualRefEmitted()
    ? visualReferencePromptStub(toolName)
    : visualReferencePrompt(toolName);
  markVisualRefEmitted();
  if (Array.isArray(result)) {
    return {
      _visualReferenceFirstResponse: prompt,
      results: result,
    };
  }
  if (result && typeof result === "object") {
    return {
      _visualReferenceFirstResponse: prompt,
      ...(result as Record<string, unknown>),
    };
  }
  return {
    _visualReferenceFirstResponse: prompt,
    result,
  };
}

/**
 * 세션 동안 get_guide({ topic: 'principles' }) 호출 여부를 응답 상단에 부착.
 * principles 를 먼저 읽지 않고 작업하면 emoji / native landmark / raw <header> / 시멘틱 토큰
 * 위반을 사후에 패치하느라 토큰을 25-30% 더 쓰게 된다는 회고 데이터에 근거.
 *
 * validate_html_mockup / build_singlefile_html 응답에 부착한다 — 둘 다 mockup 작업
 * 후반부에 호출되므로, 이 시점에 "principles 안 봤네?" 가 뜨면 다음 작업 사이클에서 챙김.
 */
function attachPrinciplesAck<T>(result: T): T | object {
  const principlesCalled = principlesAcked();
  // 이미 호출한 세션이면 question/shortcut 환기 텍스트는 순수 중복(required 도 항상 false)
  // → 1줄 ack 로 축약. 미호출 세션에서만 풀 넛지를 띄워 다음 사이클에서 챙기게 한다.
  const ack = principlesCalled
    ? {
        rule: "principles-first",
        required: false,
        principlesCalled: true,
        calledAt: principlesCalledAt() ?? null,
      }
    : {
        rule: "principles-first",
        required: true,
        principlesCalled: false,
        calledAt: null,
        question: "이번 세션에 get_guide({ topic:'principles' }) 호출 기록 있나요?",
        shortcut:
          "없으면 지금 호출 — 평균 25-30% 토큰 절약 (회고 데이터). 배치 호출 예: get_guide({ topics:['principles','dos-donts'] }).",
      };
  if (Array.isArray(result)) {
    return { _principlesAck: ack, results: result };
  }
  if (result && typeof result === "object") {
    return { _principlesAck: ack, ...(result as Record<string, unknown>) };
  }
  return { _principlesAck: ack, result };
}

/** 결과(또는 .validation)의 D1 scores 전체(overall + dimensions) 추출 — 카드 표시용.
 *  build 는 .validation 아래, validate 는 top-level. */
function extractCodeScores(
  result: unknown,
): { overall: number; dimensions: Record<string, number> } | null {
  if (!result || typeof result !== "object") return null;
  const r = result as Record<string, unknown>;
  const v = (r.validation && typeof r.validation === "object" ? r.validation : r) as Record<
    string,
    unknown
  >;
  const scores = v.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores.overall !== "number") return null;
  const dimensions =
    scores.dimensions && typeof scores.dimensions === "object"
      ? (scores.dimensions as Record<string, number>)
      : {};
  return { overall: scores.overall, dimensions };
}

/** 결과(또는 .validation)의 violations[] → 차원별 감점 사유. 분석 카드의 "→" 줄 소스. */
function extractCodeDeductions(result: unknown): Record<string, string[]> {
  if (!result || typeof result !== "object") return {};
  const r = result as Record<string, unknown>;
  const v = (r.validation && typeof r.validation === "object" ? r.validation : r) as Record<
    string,
    unknown
  >;
  const violations = Array.isArray(v.violations) ? v.violations : [];
  return deductionsByDimension(violations as never) as Record<string, string[]>;
}

/**
 * validate/build 응답에 score 게이트 + **풀 스코어카드**를 부착한다.
 * 데스크톱 design-score 카드와 같은 임계값/verdict 규칙(gradeQuality SSOT)을 쓰고,
 * formatScoreCard 로 D1 6개 차원(icon 포함)을 한 덩어리 카드로 만들어 그대로 싣는다 —
 * 회고: 에이전트가 좋은 차원 5개만 발췌하고 낮은 icon 차원을 빼서 "왜 81?" 이 안 보였음.
 * mustSurface 로 카드를 발췌 없이 그대로 노출하게 강제. 정성(D2)은 score_mockup_quality.
 */
// 만족도 다이얼로그를 이미 띄운 화면(=세션 내 1회 제한). MCP 서버 프로세스 수명 = 세션.
const ELICITED_SCREENS = new Set<string>();

// 객관 점수 옆 주관 만족도(👍/👎) 수집 안내 — build/validate 결과에 동봉. 질문이 아니라 '안내'다.
// 동기 부여(기록하면 다음 목업이 더 좋아짐)를 붙여 자발적 평가를 유도하되, 강요하지 않는다.
const SATISFACTION_OFFER = {
  prompt:
    "수정이 더 필요하면 그냥 말씀해 주세요. 이 결과가 괜찮으면 👍 / 아쉬우면 👎 를 한 줄 남겨 주시면 — 객관 품질 점수와 함께 쌓여서 다음 목업이 점점 더 정확해집니다.",
  howToLog:
    "권장: 이 결과(점수·파일경로)를 사용자에게 보여준 뒤, 깨끗한 빌드면 prompt_satisfaction({ screen, scoreOverall }) 를 호출해 👍/👎 클릭 다이얼로그를 띄운다(화면당 1회·빌드 안 막힘). 호스트가 미지원(supported:false)이거나 사용자가 그냥 '좋다/별로'로 말하면 log_feedback({ category:'satisfaction', sentiment, scoreOverall }) 로 기록. AI 가 텍스트로 먼저 캐묻지 말 것 · 모호 반응 추측 금지.",
};

function attachScoreGate<T>(result: T): T {
  const codeScores = extractCodeScores(result);
  if (codeScores == null) return result;
  const card = formatScoreCard({
    codeScores,
    codeDeductions: extractCodeDeductions(result),
    llm: { ok: false, error: "미채점 — 정성(D2)까지 보려면 score_mockup_quality 호출" },
  });
  const grade = card.grade;
  const scoreGate = {
    rule: "score-gate",
    verdict: grade.verdict,
    verdictLabel: VERDICT_LABELS[grade.verdict],
    overall: grade.overall,
    dimensions: codeScores.dimensions,
    thresholds: SCORE_THRESHOLDS,
    scoreCard: card.text,
    mustSurface:
      "이 scoreCard 를 사용자에게 **그대로(항목별 점수 + '→' 감점 사유 포함)** 보여주세요 — '종합 N점' 한 줄로 요약하지 말 것. D1 6개 차원(color/typography/spacing/layout/component/icon)을 빠짐없이, 점수 낮은 차원·감점 사유를 발췌·생략하지 말 것(특히 icon). 첫 생성·재생성 모두 동일하게.",
    guidance: gateGuidance(grade.verdict),
    note: "D1(코드) 점수 기준. 정성(D2·ux/interaction/flow/form)까지 채점하려면 score_mockup_quality 를 호출하세요.",
  };
  if (result && typeof result === "object" && !Array.isArray(result)) {
    return { ...(result as Record<string, unknown>), scoreGate, satisfactionOffer: SATISFACTION_OFFER } as T;
  }
  return result;
}

function getTokenLookupScore(token: Manifest["tokens"][number], query: string): number {
  const baseScore = Math.max(scoreMatch(query, token.name), scoreMatch(query, token.value));
  if (baseScore <= 0) return 0;

  let score = baseScore;
  if (token.group === "semantic") score += 45;
  if (isPolicyRadiusOrShapeToken(token)) score += 30;
  if (isRawPaletteToken(token)) score -= 35;
  if (isRawPaletteToken(token) && isRawPaletteQuery(query)) score += 20;

  return score;
}

function isPolicyRadiusOrShapeToken(token: Manifest["tokens"][number]) {
  return (
    (token.group === "radius" || token.group === "shape") &&
    /--(?:radius|shape)-(?:sm|md|lg|pill)$/.test(token.name)
  );
}

function isRawPaletteToken(token: Manifest["tokens"][number]) {
  // base(nudge) 팔레트는 기존 동작 유지. 추가로 브랜드 고유 팔레트(--color-mint-500 등,
  // brands 필드가 붙은 color 스케일 토큰)도 deprioritize 해 시멘틱 우선 규칙을 지킨다.
  return (
    /^--color-(?:neutral|coolGray|blue|magenta|yellow|red|green)-/.test(token.name) ||
    (token.group === "color" &&
      Array.isArray(token.brands) &&
      /^--color-[a-zA-Z]+-\d/.test(token.name))
  );
}

function isRawPaletteQuery(query: string) {
  return /\b(?:neutral|coolgray|cool-gray|blue|magenta|yellow|red|green)\b/.test(query);
}

/* ───────────── validate_mockup ───────────── */

function suggestReplacement(args: { snippet: string; rule?: string }) {
  const { snippet } = args;
  const suggestions: { before: string; after: string; note: string }[] = [];

  // hex → 토큰
  const hexMatches = snippet.matchAll(/#[0-9a-fA-F]{3,8}\b/g);
  for (const m of hexMatches) {
    const hex = m[0].toUpperCase();
    const match = manifest.tokens.find((t) => t.value.toUpperCase() === hex && t.group === "color");
    if (match) {
      suggestions.push({
        before: m[0],
        after: `var(${match.name})`,
        note: `정확히 일치: ${match.name} = ${match.value}`,
      });
    } else {
      suggestions.push({
        before: m[0],
        after: "var(--color-...)",
        note: "정확한 매칭 토큰 없음. find_token({ query: ... }) 사용해 가까운 색상 찾기.",
      });
    }
  }

  // px → spacing 토큰 (정확 매칭만)
  const pxMatches = snippet.matchAll(/:\s*(\d+(?:\.\d+)?)px\b/g);
  for (const m of pxMatches) {
    const px = m[1];
    const match = manifest.tokens.find(
      (t) => t.group === "spacing" && t.value.replace("px", "") === px,
    );
    if (match) {
      suggestions.push({
        before: `${px}px`,
        after: `var(${match.name})`,
        note: `spacing 토큰: ${match.name}`,
      });
    }
  }

  return { suggestions };
}

/**
 * PRD → 캐포비 어드민 Page Pattern 1차 추천(키워드 점수). 점수 로직은 mockup-core 가 SSOT —
 * 데스크탑 추천 카드와 동일 함수. 응답은 ranked 5종 + top/confident + drill-down 힌트 + "Claude/
 * 사용자 확정" 안내를 담는다. 최종 확정(screen.pagePattern 선언)은 호출자가 한다(여기서 강제 X).
 */
function recommendPagePatternTool(args: { prd?: string; brand?: string; surface?: string }) {
  const prd = String(args.prd ?? "");
  const brand = canonicalBrandSlug(args.brand);
  const surface = args.surface?.trim().toLowerCase();
  const rec = recommendPagePattern(prd);

  // Page Pattern System 브랜드(프로필 admin.pagePatternSystem) 어드민에서만 hard 게이트.
  // 브랜드/표면 미지정이면 advisory 로 동작.
  const appliesToCashwalkBizAdmin =
    (!args.brand || getBrandProfile(brand)?.admin?.pagePatternSystem === true) &&
    (!surface || surface === "admin");

  const ranked = rec.ranked.map((c) => ({
    pattern: c.pattern,
    label: c.label,
    score: c.score,
    when: c.when,
    why: c.why,
    guide: `pattern:cashwalk-biz-page-${c.pattern}`,
  }));

  const nextStep = rec.top
    ? `1차 추천: '${rec.ranked[0].label}'. 키워드 점수 기반 후보일 뿐이니 PRD 를 직접 읽고 확정하세요(다른 후보로 바꿔도 됨). 확정하면 get_guide({ topic: 'pattern:cashwalk-biz-page-${rec.top}' }) 로 구조를 확인하고 save_design_spec 의 screen.pagePattern 에 그 값을 넣으세요. (데스크탑 하네스에서 카드로 이미 골랐다면 nudge.pagePattern 마커가 자동 주입합니다.)`
    : "PRD 키워드로는 패턴을 특정하지 못했습니다 — ranked 5종을 사용자에게 보여주고 직접 고르게 하세요.";

  const humanReadable = [
    rec.reason,
    ...ranked.map((c, i) => `${i === 0 ? "▶" : "·"} ${c.label} (score ${c.score}) — ${c.why}`),
  ].join("\n");

  return {
    appliesToCashwalkBizAdmin,
    top: rec.top,
    confident: rec.confident,
    reason: rec.reason,
    ranked,
    nextStep,
    humanReadable,
    note: appliesToCashwalkBizAdmin
      ? undefined
      : "참고: Page Pattern 시스템은 cashwalk-biz 어드민 전용입니다. 다른 브랜드/표면엔 강제되지 않으니 advisory 로만 참고하세요.",
  };
}

/* ───────────── MCP 서버 등록 ───────────── */

const server = new Server(
  { name: "nudge-ds", version: mcpbManifest?.version ?? "0.1.6" },
  { capabilities: { tools: {} } },
);

// 클라이언트 식별(어떤 에이전트·표면이 호출했나) SSOT 를 서버에 묶는다 — observability-sink 가
// 매 레코드에서 getClientIdentity() 로 읽어 붙인다. clientInfo 는 initialize 후 채워지므로
// 여기서 server 참조만 넘기고 해석은 호출 시점에 lazy 하게 한다.
configureClientIdentity({
  server,
  installMode,
  mcpVersion: mcpbManifest?.version ?? null,
});

// export 는 테스트용 — 핸들러 응답 정형(stats 자동 동봉 등)을 단위로 잠근다.
export const toolHandlers = {
  get_brand: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "get_brand",
      getBrand(
        args as {
          brand?: string;
          assetKind?: "logos" | "snsLogos" | "profileImages" | "illustrations" | "marathonEvents";
        },
      ),
    ),
  find_component: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_component",
      findComponent(args as { name?: string; query?: string; limit?: number; verbose?: boolean }),
    ),
  find_icon: async (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_icon",
      await findIcon(
        args as { name?: string; query?: string; category?: string; limit?: number; size?: number },
      ),
    ),
  find_asset: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_asset",
      findAsset(
        args as { query?: string; brand?: string; category?: string; id?: string; limit?: number },
      ),
    ),
  find_token: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_token",
      findToken(args as { group?: string; query?: string; brand?: string }),
    ),
  suggest_replacement: (args: ToolArgs) =>
    suggestReplacement(args as { snippet: string; rule?: string }),
  recommend_page_pattern: (args: ToolArgs) =>
    recommendPagePatternTool(args as { prd?: string; brand?: string; surface?: string }),
  // 핸들러는 ack 만 반환 — 실제 수집은 afterCall → captureTelemetry → projectFeedback 가 처리.
  log_feedback: (args: ToolArgs) => {
    const text = typeof args.text === "string" ? args.text.trim() : "";
    const sentiment = args.sentiment === "up" || args.sentiment === "down" ? args.sentiment : null;
    // 만족도(👍/👎)만 있고 text 가 없어도 허용 — sentiment 자체가 신호. 둘 다 없으면 거절.
    if (!text && !sentiment) return { ok: false, error: "text 또는 sentiment 중 하나는 필요합니다." };
    return {
      ok: true,
      logged: true,
      category: (args.category as string) ?? (sentiment ? "satisfaction" : null),
      sentiment,
      message: sentiment ? "만족도가 기록되었습니다." : "피드백이 기록되었습니다.",
    };
  },
  // 목업 만족도(👍/👎)를 클릭 다이얼로그(elicitation)로 물어 기록한다. 빌드와 분리된 별도 도구 —
  // 빌드 결과를 먼저 보여준 뒤 호출하면 다이얼로그가 그 다음에 떠 "보고 나서 평가"가 된다.
  // 화면당 세션 1회만(중복 호출 가드). 미지원 호스트는 supported:false 로 텍스트 폴백.
  prompt_satisfaction: async (args: ToolArgs) => {
    const screen = typeof args.screen === "string" && args.screen ? args.screen : "(목업)";
    const scoreOverall = typeof args.scoreOverall === "number" ? args.scoreOverall : null;
    const brand = typeof args.brand === "string" ? args.brand : undefined;

    if (!server.getClientCapabilities()?.elicitation) {
      return {
        ok: true,
        supported: false,
        recorded: false,
        message:
          "이 호스트는 클릭 다이얼로그(elicitation)를 지원하지 않습니다. satisfactionOffer 텍스트로 안내하고, 사용자가 평가하면 log_feedback({ category:'satisfaction', sentiment }) 로 기록하세요.",
      };
    }
    if (ELICITED_SCREENS.has(screen)) {
      return { ok: true, recorded: false, alreadyAsked: true, message: "이 화면은 세션 내 이미 만족도를 물었습니다." };
    }
    ELICITED_SCREENS.add(screen);

    const scoreLabel = scoreOverall != null ? `품질 ${scoreOverall}점 · ` : "";
    let res: Awaited<ReturnType<typeof server.elicitInput>>;
    try {
      res = await server.elicitInput({
        mode: "form",
        message: `${scoreLabel}${screen} — 결과 확인하셨나요? 이 목업 어떠셨어요? (평가는 선택이에요. 안 하시려면 닫기/취소)`,
        requestedSchema: {
          type: "object",
          properties: {
            sentiment: {
              type: "string",
              enum: ["up", "down"],
              enumNames: ["👍 좋아요", "👎 아쉬워요"],
              title: "만족도",
              description: "이 목업 결과에 대한 만족도",
            },
          },
          required: ["sentiment"],
        },
      });
    } catch (e) {
      return { ok: false, recorded: false, error: `elicitation 실패: ${(e as Error).message}` };
    }

    const sentiment =
      res.action === "accept" && (res.content?.sentiment === "up" || res.content?.sentiment === "down")
        ? (res.content.sentiment as "up" | "down")
        : undefined;
    if (!sentiment) {
      return { ok: true, recorded: false, action: res.action, message: "만족도 스킵됨." };
    }
    // recorded:true + sentiment → afterCall captureTelemetry 가 feedback 이벤트로 적재(객관점수 페어링).
    return { ok: true, recorded: true, sentiment, scoreOverall, screen, ...(brand ? { brand } : {}) };
  },
  get_guide: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "get_guide",
      getGuide(
        args as {
          topic?: string;
          topics?: string[];
          intent?: string;
          target?: "react" | "html";
          sections?: string[];
          aspects?: string[];
          brand?: "trost" | "geniet" | "cashwalk-biz" | "nudge-eap";
          serviceName?: string;
          cwd?: string;
        },
      ),
    ),
  list_figma_sync_status: () => listFigmaSyncStatus(),
  get_setup: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "get_setup",
      getSetup(
        args as {
          step: string;
          tgzDir?: string;
          brand?: string;
          withRouter?: boolean;
          includeTailwind?: boolean;
          intent?: string;
          serviceName?: string;
          source?: string;
          includeLocalPackages?: boolean;
          cwd?: string;
          projectName?: string;
          overwrite?: boolean;
          template?: "slim" | "default";
          mode?: "summary" | "full";
        },
      ),
    ),
  dev_server: async (args: ToolArgs) => {
    const typed = args as {
      action: "start" | "stop";
      cwd?: string;
      command?: string;
      args?: string[];
      url?: string;
      port?: number;
      timeoutMs?: number;
      sessionId?: string;
    };
    const result = await devServer(typed);
    // stop 은 한동안 report 가 안 올 수 있는 지점 → 밀린 webhook 큐를 여기서 한 번 비운다.
    if (typed.action === "stop") await flushPendingUsageWebhookQueue();
    return result;
  },
  build_singlefile_html: async (args: ToolArgs) => {
    const typedArgs = args as {
      cwd?: string;
      skipAudit?: boolean;
      allowIncomplete?: boolean;
      intent?: "react" | "html";
    };
    const result = await buildSinglefileHtml({
      ...typedArgs,
      // HTML 목업은 node_modules/package.json 이 없어 버전 fs 탐지가 null → MCP 가 아는
      // 번들 DS 버전(manifest = 최대 DS 버전 미러)을 fallback 으로 흘려 스탬프/시트 null 차단.
      dsVersion: mcpbManifest?.version,
      assetVersion: bundledAssetVersion,
    });
    // observability 적재는 registerToolHandlers({ afterCall }) 단일 choke-point 로 이관됨.
    // html intent 빌드는 내부에서 validate + report 까지 자동 실행하므로 report-suppress 카운터에도
    // 영향을 미친다. 이 시점에 principles 호출 여부 + score 게이트(D1 verdict)를 함께 노출한다.
    return attachPrinciplesAck(attachScoreGate(result));
  },
  validate_html_mockup: async (args: ToolArgs) => {
    const typed = args as {
      source?: string;
      filePath?: string;
      withStats?: boolean;
      report?: boolean;
      mockupName?: string;
      cwd?: string;
      dryRun?: boolean;
    };

    // 정적 검증만 지원 — source(HTML 문자열) 또는 filePath(.html) 를 그대로 검증한다.
    const effectiveSource = typed.source;
    const effectiveFilePath = typed.filePath;

    // cwd 를 넘겨 nudge.surface 마커로 표면 불일치(admin↔소비자 chrome)까지 검출.
    const result = validateHtmlMockup({
      source: effectiveSource,
      filePath: effectiveFilePath,
      cwd: typed.cwd,
    });
    let extras: {
      // root 의 violations[] / violationsByRule 와 동일하므로 stats 에서는 둘 다 제외해 응답 크기 절약.
      stats?: Omit<AnalyzeHtmlMockupResult, "violations" | "violationsByRule">;
      report?: unknown;
      _reportSuppressedWarning?: {
        rule: string;
        suppressedCallCount: number;
        message: string;
        howToFlush: string;
      };
    } | null = null;

    // withStats:true → analyzeHtmlMockup 결과(stats / grouped / recommendations) 를 함께 반환.
    // 옛 analyze_html_mockup 도구의 호출자가 그대로 옮겨올 수 있도록 필드를 분리해 노출.
    // violations[] 은 root 의 result.violations 와 동일하므로 응답 크기 절약을 위해 제거 — 카운트만 violationsByRule 로 남긴다.
    // ★ 위반 0 통과 시에는 withStats 없이도 stats 를 자동 동봉 — "0 위반 확인 → withStats 별도
    //   1회" 로 두 라운드 쓰던 워크플로우를 한 라운드로 줄인다(분석은 같은 파일 로컬 재파싱이라 싸다).
    if (typed.withStats || result.ok) {
      const {
        violations: _dupViolations,
        violationsByRule: _dupByRule,
        ...statsRest
      } = analyzeHtmlMockup({
        source: effectiveSource,
        filePath: effectiveFilePath,
        cwd: typed.cwd,
      });
      extras = {
        ...(extras ?? {}),
        stats: statsRest,
      };
    }
    // report → reportHtmlMockupUsage 호출 (JSONL + Sheets webhook). 옛 report_html_mockup_usage 흡수.
    // **기본 true** — 호출자가 매번 `report: true` 를 명시하다 누락하는 사고가 잦아서 default 를 뒤집음.
    // 명시적으로 `report: false` 를 주면 끌 수 있다 (반복 검증 중 시트 노이즈를 막고 싶을 때).
    // 렌더드 DOM 을 캡처했으면 그 source 로 report — 정적 shell 의 0% 가 시트에 적재되는 사고 방지.
    if (typed.report !== false) {
      const report = await reportHtmlMockupUsage({
        source: effectiveSource,
        filePath: effectiveFilePath,
        mockupName: typed.mockupName,
        cwd: typed.cwd,
        dryRun: typed.dryRun,
        // fs 탐지가 null 인 HTML 목업에서 시트에 DS 버전이 빠지던 버그 차단(번들 버전으로 fallback).
        dsVersionFallback: mcpbManifest?.version,
        assetVersionFallback: bundledAssetVersion,
      });
      noteReportSent();
      extras = { ...(extras ?? {}), report };
    } else {
      // 연속 report:false 를 잡기 위한 세션 카운터. 마지막 1회는 반드시 sheet 로 보내야 한다는
      // 신호를 응답에 띄운다. (description 만으로는 호출자가 매번 잊는다 — 카운터로 강제 환기.)
      const suppressCount = noteReportSuppressed();
      extras = {
        ...(extras ?? {}),
        _reportSuppressedWarning: {
          rule: "report-must-flush-eventually",
          suppressedCallCount: suppressCount,
          message:
            suppressCount === 1
              ? "report:false 1회. 이번 iteration 이 끝나면 마지막 호출은 report 인자를 생략하거나 true 로 보내 sheet 를 갱신하세요."
              : `report:false ${suppressCount}회 연속. 시트가 ${suppressCount}회 분 stale 상태입니다. 다음 호출은 report 인자를 생략 (= true) 하세요.`,
          howToFlush:
            "validate_html_mockup({ ... }) — report 인자 자체를 생략. 그러면 default true 로 sheet 에 적재됩니다.",
        },
      };
    }
    const withExtras = extras ? { ...result, ...extras } : result;
    // observability 적재는 afterCall 단일 choke-point 로 이관됨.
    return attachPrinciplesAck(
      attachScoreGate({
        ...withExtras,
        _prdCoverageNextStep:
          "PRD/brief 커버리지는 DS 점수와 분리됨. 최종 전 validate_prd_coverage({ source|filePath }) 또는 build_singlefile_html.prdValidation 을 확인하세요.",
      }),
    );
  },
  validate_prd_coverage: (args: ToolArgs) => {
    const typed = args as { source?: string; filePath?: string };
    return validatePrdCoverage(typed);
  },
  score_mockup_quality: async (args: ToolArgs) => {
    const typed = args as {
      html?: string;
      filePath?: string;
      brand?: string;
      surface?: string;
      cwd?: string;
    };
    // HTML 확보 — html 인자 우선, 없으면 filePath 를 렌더드 산출물로 읽는다.
    let html = typed.html;
    if (!html && typed.filePath) {
      try {
        html = fs.readFileSync(typed.filePath, "utf8");
      } catch (e) {
        return { ok: false, error: `filePath 읽기 실패: ${String(e)}` };
      }
    }
    if (!html) return { ok: false, error: "html 또는 filePath 중 하나가 필요합니다." };

    // D1 코드 점수 — 정적 검증으로 차원별 점수 + 감점 사유를 뽑아 분석 카드에 싣는다.
    let codeScores: { overall: number; dimensions: Record<string, number> } | null = null;
    let codeDeductions: Record<string, string[]> = {};
    try {
      const v = validateHtmlMockup({ source: html, cwd: typed.cwd });
      codeScores = v.scores ?? null;
      codeDeductions = deductionsByDimension(v.violations ?? []) as Record<string, string[]>;
    } catch {
      /* D1 실패해도 D2 는 진행 */
    }

    // D2 정성 점수 — 독립 claude -p. 못 찾으면 graceful: D1(코드)만 카드에 반영.
    const bin = resolveClaudeBin();
    let llm: LlmScoreResult;
    if (!bin) {
      llm = {
        ok: false,
        error: "claude 실행 파일 미발견(CLAUDE_BIN/PATH) — 코드 점수(D1)만 반영",
      };
    } else {
      llm = await scoreMockupQuality({
        html,
        brand: typed.brand,
        surface: typed.surface,
        bin,
        env: { ...process.env } as Record<string, string>,
      });
    }

    const { text, grade } = formatScoreCard({ codeScores, codeDeductions, llm });
    // observability 적재는 afterCall 단일 choke-point 로 이관됨.
    return {
      ok: true,
      codeScores,
      llm,
      verdict: grade.verdict,
      verdictLabel: VERDICT_LABELS[grade.verdict],
      overall: grade.overall,
      thresholds: SCORE_THRESHOLDS,
      guidance: gateGuidance(grade.verdict),
      card: text,
    };
  },
  convert_html_to_ds_html: (args: ToolArgs) =>
    convertHtmlToDsHtml(
      args as { source?: string; filePath?: string; rewriteInlineColors?: boolean },
    ),
  validate_design_spec: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "validate_design_spec",
      validateDesignSpec((args as { spec?: unknown }).spec),
    ),
  save_design_spec: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "save_design_spec",
      saveDesignSpec(args as { spec?: unknown; cwd?: string; fileName?: string }),
    ),
} satisfies ToolHandlers;

registerDevServerCleanup();
registerToolHandlers(server, toolHandlers, {
  afterCall: async ({ name, args, result }) => {
    // Tier 1 · LOCAL 컨텍스트 수집 — 모든 툴 결과가 지나는 이 한 지점에서 잡는다.
    // 내부에서 전 과정 best-effort(throw 안 함)라 본기능에 무해. build(html) 의
    // early-return 이전에 둬서 html 빌드 산출물도 스냅샷되도록 한다.
    captureContext({ name, args, result });

    // Tier 2 · EGRESS — find_*(히트/미스) + 프롬프트를 수집 서버로 fire-and-forget 전송.
    // 기본 전송지 = 로컬 nudge-telemetry-api(:8091/api/ingest). NUDGE_TELEMETRY_URL 로 덮어쓰기, NUDGE_CONTEXT_COLLECTION=0 으로 끔.
    captureTelemetry({ name, args, result });

    // 채팅 피드백 자동 캡처 — 모델이 log_feedback 을 안 불러도, 어차피 호출되는 이 툴들의
    // afterCall 에서 transcript 를 읽어 직전 user 피드백을 줍는다(모델 협조 불필요).
    // cwd 힌트 = 툴 args(build/validate 등의 cwd). MCP process.cwd() 는 프로젝트가 아닐 수 있어 args 우선.
    captureTranscriptFeedback(
      typeof args?.cwd === "string"
        ? args.cwd
        : typeof args?.projectPath === "string"
          ? args.projectPath
          : null,
    );

    // observability 적재 SSOT — record{Build,Validation,Quality} 를 핸들러에서 끌어와 이 단일
    // choke-point 로 통합(새 툴 누락 방지). 다른 3개 수집기와 동일하게 fire-and-forget —
    // await 하면 원격 webhook(timeout 1500ms)이 모든 build/validate/score 호출을 블로킹한다.
    // 산출물(_observability 요약)은 모델에 무가치한 노이즈라 응답에 머지하지 않는다.
    void recordObservability({
      name,
      args,
      result,
      dsVersion: mcpbManifest?.version,
    }).catch(() => {
      /* sink 장애는 본기능에 무해 — stderr 로그는 sink 내부 best-effort */
    });
    const next = result;

    try {
      if (
        name === "build_singlefile_html" &&
        next &&
        typeof next === "object" &&
        !Array.isArray(next) &&
        (next as { intent?: unknown }).intent === "html"
      ) {
        return next;
      }
      const guardArgs =
        name === "build_singlefile_html" &&
        !args.cwd &&
        next &&
        typeof next === "object" &&
        !Array.isArray(next) &&
        typeof (next as { outputPath?: unknown }).outputPath === "string"
          ? {
              ...args,
              cwd: path.dirname(path.dirname((next as { outputPath: string }).outputPath)),
            }
          : args;
      const guard = await runUsageGuards(name, guardArgs);
      return attachUsageGuardOutcome(next, guard);
    } catch {
      return next;
    }
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[nudge-mcp] ready. components=${manifest.components.length}, icons=${manifest.icons.length}, tokens=${manifest.tokens.length}`,
  );
}

if (isDirectRun) {
  await main();
}
