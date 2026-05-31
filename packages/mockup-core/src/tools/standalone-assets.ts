/**
 * tools/standalone-assets.ts — prebuilt DS 단일 자산(dist/standalone) 런타임 로더.
 *
 * `@nudge-design/html` 빌드가 떨군 무번들러 자산을 읽어, build_singlefile_html 의 html
 * intent 경로가 사용자 index.html 에 inline 한다(외부의존성 0 단일 HTML).
 *
 *   dist/standalone/{nudge-ds.runtime.js, tokens.css, brand.<slug>.css, styles.css,
 *                    reset.css, manifest.json}
 *
 * mockup-core 는 plain tsc → esbuild 로 server.mjs 에 인라인되므로 자산을 import-time 에
 * 못 넣는다. 런타임에 디렉터리를 fs-read 한다. 3개 컨텍스트 모두를 커버하는 resolver:
 *   ① NUDGE_DS_STANDALONE_DIR (desktop packaged 가 명시 — 가장 확실)
 *   ② require.resolve("@nudge-design/html/standalone/manifest.json")  (dev 모노레포 · mcpb node_modules)
 *   ③ __dirname 상대 후보 — bundled single-file 의 sidecar(server.mjs 옆 ../standalone 등)
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

export interface StandaloneAssets {
  /** IIFE 런타임 JS 본문(모든 <nds-*> 등록). 브랜드 무관. */
  runtimeJs: string;
  /** base 토큰 + (브랜드 delta) + styles + reset 를 순서대로 concat 한 CSS 본문. */
  css: string;
  /** 실제로 적용된 브랜드 slug(미지정/미지 → baseOnlyBrand). */
  brand: string;
}

interface StandaloneManifest {
  runtime: string;
  baseOnlyBrand: string;
  brands: Record<string, string[]>;
}

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * 목업 전용 디바이스 프레임 CSS — `@nudge-design/html` 의 production 스타일이 아니라
 * **목업 표현용**이라 mockup-core 에서만 주입한다(외부 앱은 절대 안 받음). 단일 파일 빌드와
 * 라이브 미리보기 양쪽에 항상 inline 되므로 옵트인 클래스만 쓰면 device-frame 처럼 보인다.
 *
 * 회고: 한 파일에 여러 화면을 그릴 때 .app{max-width} 로 세로로 쌓이기만 해 "화면처럼" 안 보이고
 * 모바일/웹을 미디어쿼리로 토글해 동시에 못 봤다. → 고정 너비/최소높이 프레임을 캔버스에
 * 나란히 깔고, surface 별(웹/모바일/웹뷰)로 각각 프레임을 둬 한눈에 비교한다.
 *
 *   <div class="mockup-canvas">
 *     <section class="mockup-screen" data-device="web"    data-label="홈 (웹)">…</section>
 *     <section class="mockup-screen" data-device="mobile" data-label="홈 (모바일)">…</section>
 *   </div>
 *
 * 클래스 prefix 가 nds- 가 아니라서 validator 의 unknown-nds-class / raw-shell-pattern 에
 * 걸리지 않는다(둘 다 nds-* / .page·.section 류만 검사).
 */
export const MOCKUP_FRAME_CSS = `
/* ── Nudge mockup device frames (목업 전용 · production DS 아님) ── */
.mockup-canvas{
  display:flex;flex-wrap:wrap;align-items:flex-start;
  gap:64px;padding:64px;box-sizing:border-box;min-height:100vh;
  background:var(--semantic-bg-base, #f4f4f5);
}
.mockup-screen{
  position:relative;flex:0 0 auto;
  display:flex;flex-direction:column;overflow:hidden;
  background:var(--semantic-bg-surface-default, #ffffff);
  border-radius:20px;
  box-shadow:0 10px 40px rgba(0,0,0,.14);
}
/* 캡션(화면 이름) — data-label 이 있으면 프레임 위에 표시. attr() 라 텍스트 검증 무관. */
.mockup-screen[data-label]::before{
  content:attr(data-label);
  position:absolute;top:-30px;left:2px;
  font-size:13px;line-height:1;font-weight:600;
  color:var(--semantic-text-tertiary, #71717a);
  white-space:nowrap;
}
/* 디바이스 프리셋 — 고정 너비 + 최소 높이로 "디바이스 프레임" 느낌. 내부는 자연 스크롤/확장. */
.mockup-screen[data-device="mobile"]{ width:390px;  min-height:844px; }
.mockup-screen[data-device="webview"]{ width:390px; min-height:720px; }
.mockup-screen[data-device="tablet"]{ width:834px;  min-height:1112px; }
.mockup-screen[data-device="web"]{ width:1440px;    min-height:900px; }
/* device 미지정 기본 = 모바일 폭. */
.mockup-screen:not([data-device]){ width:390px; min-height:844px; }
`;

function dirHasManifest(dir: string | undefined): dir is string {
  return !!dir && fs.existsSync(path.join(dir, "manifest.json"));
}

/** 자산 디렉터리 해석. 못 찾으면 시도한 전략을 모두 적은 에러를 throw. */
export function resolveStandaloneDir(): string {
  const tried: string[] = [];

  // ① 명시 env override.
  const envDir = process.env.NUDGE_DS_STANDALONE_DIR;
  if (envDir) {
    tried.push(`env NUDGE_DS_STANDALONE_DIR=${envDir}`);
    if (dirHasManifest(envDir)) return envDir;
  }

  // ② node_modules resolve (dev 모노레포 symlink · mcpb 설치본). createRequire 로 호출해
  //    esbuild 가 정적 번들하지 않고 런타임 resolve 로 남긴다.
  try {
    const req = createRequire(import.meta.url);
    const manifestPath = req.resolve("@nudge-design/html/standalone/manifest.json");
    tried.push(`require.resolve(@nudge-design/html/standalone) → ${manifestPath}`);
    const dir = path.dirname(manifestPath);
    if (dirHasManifest(dir)) return dir;
  } catch (err) {
    tried.push(`require.resolve(@nudge-design/html/standalone) 실패: ${(err as Error).message}`);
  }

  // ③ bundled single-file 의 sidecar 후보(server.mjs 옆). desktop: dist/tools/server.mjs → ../standalone.
  for (const rel of ["../standalone", "standalone", "../../standalone", "../../../standalone"]) {
    const dir = path.resolve(here, rel);
    tried.push(`__dirname/${rel} → ${dir}`);
    if (dirHasManifest(dir)) return dir;
  }

  throw new Error(
    "prebuilt DS 단일 자산(dist/standalone)을 찾지 못했습니다. " +
      "`pnpm build --filter @nudge-design/html` 로 생성하거나, 번들에 sidecar 로 복사됐는지 확인하세요.\n" +
      `시도한 경로:\n  - ${tried.join("\n  - ")}`,
  );
}

const cache = new Map<string, StandaloneAssets>();
let cachedManifest: { dir: string; manifest: StandaloneManifest } | undefined;

function loadManifest(dir: string): StandaloneManifest {
  if (cachedManifest && cachedManifest.dir === dir) return cachedManifest.manifest;
  const manifest = JSON.parse(
    fs.readFileSync(path.join(dir, "manifest.json"), "utf-8"),
  ) as StandaloneManifest;
  cachedManifest = { dir, manifest };
  return manifest;
}

/**
 * 브랜드에 맞는 prebuilt 자산(runtime JS + 조합된 CSS)을 읽어 반환.
 * @param brand 브랜드 slug. 미지정/미지 브랜드는 manifest.baseOnlyBrand 로 폴백.
 */
export function loadStandaloneAssets(brand?: string): StandaloneAssets {
  const dir = resolveStandaloneDir();
  const manifest = loadManifest(dir);

  const normalized = brand?.trim().toLowerCase();
  const resolvedBrand =
    normalized && manifest.brands[normalized] ? normalized : manifest.baseOnlyBrand;

  const cacheKey = `${dir}::${resolvedBrand}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const cssPieces = manifest.brands[resolvedBrand] ?? manifest.brands[manifest.baseOnlyBrand];
  const css =
    cssPieces.map((file) => fs.readFileSync(path.join(dir, file), "utf-8")).join("\n") +
    // 목업 전용 디바이스 프레임 — 단일 파일 빌드·미리보기 양쪽에 항상 동봉(옵트인 클래스).
    "\n" +
    MOCKUP_FRAME_CSS;
  const runtimeJs = fs.readFileSync(path.join(dir, manifest.runtime), "utf-8");

  const assets: StandaloneAssets = { runtimeJs, css, brand: resolvedBrand };
  cache.set(cacheKey, assets);
  return assets;
}

/** 알려진 브랜드 slug 목록(테스트/진단용). */
export function listStandaloneBrands(): string[] {
  return Object.keys(loadManifest(resolveStandaloneDir()).brands);
}

/** prebuilt 인라인 자산을 식별하는 마커(중복 주입 방지 + build_singlefile_html 산출물 감지 공용). */
export const STANDALONE_MARKER = "data-nds-standalone";

/**
 * 작업 중인 raw HTML 에 DS runtime/CSS 를 인라인한다 — **라이브 미리보기 전용**.
 *
 * build_singlefile_html 은 export 시점에만 runtime/CSS 를 inline 하므로, 작업 중 원본
 * index.html 에는 <nds-*> 를 등록할 런타임이 없다. mockup-protocol(미리보기)이 원본을 그대로
 * 서빙하면 커스텀 엘리먼트가 업그레이드되지 않아 자식 텍스트가 그대로 노출된다(예: nds-select
 * 옵션이 흩뿌려짐). 미리보기 서빙 직전에 이 함수로 runtime/CSS 를 in-memory 주입해 export 와
 * 동일하게 렌더한다(원본 파일 무변경 = 비파괴, 멱등).
 *
 * - 이미 인라인된 산출물(STANDALONE_MARKER 존재 = dist)이면 그대로 둔다.
 * - 브랜드는 인자 우선, 없으면 <html|body data-brand> / <body class="brand-*"> 에서 감지.
 * - 자산을 못 찾으면 원본을 그대로 반환(미리보기 자체는 살린다).
 */
export function injectStandaloneRuntime(html: string, brand?: string): string {
  if (html.includes(STANDALONE_MARKER)) return html;

  let assets: StandaloneAssets;
  try {
    assets = loadStandaloneAssets(brand ?? detectBrandFromHtml(html));
  } catch {
    return html;
  }

  // </style>·</script> 조기 종료 방지 가드(build-html 의 inline 과 동일).
  const safeCss = assets.css.replace(/<\/(style)/gi, "<\\/$1");
  const safeJs = assets.runtimeJs.replace(/<\/(script)/gi, "<\\/$1");
  const styleTag = `<style ${STANDALONE_MARKER}>\n${safeCss}\n</style>`;
  const scriptTag = `<script ${STANDALONE_MARKER}>\n${safeJs}\n</script>`;

  // CSS → <head> 맨 앞(없으면 만들어 끼우거나 문서 맨 앞).
  let out = html;
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/(<head[^>]*>)/i, `$1\n${styleTag}`);
  } else if (/<html[^>]*>/i.test(out)) {
    out = out.replace(/(<html[^>]*>)/i, `$1<head>${styleTag}</head>`);
  } else {
    out = styleTag + out;
  }

  // runtime → </body> 직전(없으면 끝에 덧붙임).
  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${scriptTag}</body>`);
  } else {
    out = out + scriptTag;
  }
  return out;
}

/** <html|body data-brand="x"> 또는 <body class="… brand-x …"> 에서 브랜드 slug 추출. */
function detectBrandFromHtml(html: string): string | undefined {
  const dataBrand = html.match(/<(?:html|body)\b[^>]*\bdata-brand\s*=\s*["']([^"']+)["']/i);
  if (dataBrand) return dataBrand[1].trim();
  const bodyClass = html.match(/<body\b[^>]*\bclass\s*=\s*["']([^"']*)["']/i);
  const m = bodyClass?.[1].match(/\bbrand-([a-z0-9-]+)\b/i);
  return m ? m[1] : undefined;
}
