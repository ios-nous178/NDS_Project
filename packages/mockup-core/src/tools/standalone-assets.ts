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
  const css = cssPieces.map((file) => fs.readFileSync(path.join(dir, file), "utf-8")).join("\n");
  const runtimeJs = fs.readFileSync(path.join(dir, manifest.runtime), "utf-8");

  const assets: StandaloneAssets = { runtimeJs, css, brand: resolvedBrand };
  cache.set(cacheKey, assets);
  return assets;
}

/** 알려진 브랜드 slug 목록(테스트/진단용). */
export function listStandaloneBrands(): string[] {
  return Object.keys(loadManifest(resolveStandaloneDir()).brands);
}
