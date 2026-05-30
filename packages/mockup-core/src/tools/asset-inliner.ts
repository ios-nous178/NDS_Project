/**
 * tools/asset-inliner.ts — DS raster/vector 자산 on-demand base64 인라이너.
 *
 * `@nudge-design/assets` 의 화면 이미지(nudge-img 58종 · 일러스트 · 프로필 등)는
 * 로고와 달리 dataUri 를 미제공한다(raster PNG/webp 라 전부 인라인하면 비대). 따라서
 * standalone 번들에도 안 들어간다. 대신 **목업이 실제로 참조한 자산만** 빌드 시 base64
 * data URI 로 치환해, 단일 HTML 의 self-contained · 무배포(S3 불필요) 성질을 유지한다.
 *   → 쓰는 것만 인라인하므로 HTML 증가폭은 사용한 이미지 합(보통 수십~수백 KB)에 그친다.
 *
 * 참조 규약(assets 메타데이터의 SSOT 와 동일): src / srcset / CSS url() 에
 *   @nudge-design/assets/files/{category}/{id}.png   (또는 @3x · svg · webp · jpg)
 * 형태로 쓰면 치환된다. http(s):// 절대 URL · 이미 data: 인 참조는 건드리지 않는다.
 * 매칭됐는데 파일이 없으면(오타 등) 조용히 두지 않고 missing 으로 보고 → 호출자가 경고.
 *
 * 자산 디렉터리 해석(3 컨텍스트):
 *   ① env NUDGE_DS_ASSETS_DIR              — desktop packaged 가 명시(가장 확실)
 *   ② require.resolve("@nudge-design/assets") → dist/files  — dev 모노레포 · mcpb node_modules
 *   ③ __dirname sidecar 후보               — bundle-mcp-desktop 이 dist/assets 로 복사한 경우
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import type * as cheerio from "cheerio";

/** src/srcset/url() 에서 이걸로 시작하는 참조만 DS 자산으로 본다. */
export const ASSET_REF_PREFIX = "@nudge-design/assets/files/";

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

const here = path.dirname(fileURLToPath(import.meta.url));

function isUsableDir(dir: string | undefined): dir is string {
  return !!dir && fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

let cachedDir: string | null | undefined;

/**
 * DS 자산 파일 루트(dist/files 또는 동봉 sidecar)를 해석. 못 찾으면 null
 * (인라인은 best-effort — 자산 디렉터리가 없다고 빌드를 깨지 않는다).
 */
export function resolveAssetsFilesDir(): string | null {
  if (cachedDir !== undefined) return cachedDir;

  // ① 명시 env override.
  const envDir = process.env.NUDGE_DS_ASSETS_DIR;
  if (isUsableDir(envDir)) return (cachedDir = envDir);

  // ② node_modules resolve. createRequire 로 호출해 esbuild 가 정적 번들하지 않고
  //    런타임 resolve 로 남긴다. "./package.json"(전 조건 노출) → 형제 dist/files.
  //    ("." export 는 import 조건만 있어 require.resolve 가 throw 하므로 package.json 으로 잡는다.)
  try {
    const req = createRequire(import.meta.url);
    const pkg = req.resolve("@nudge-design/assets/package.json");
    const dir = path.join(path.dirname(pkg), "dist", "files");
    if (isUsableDir(dir)) return (cachedDir = dir);
  } catch {
    // resolve 실패는 ③ 으로.
  }

  // ③ bundled single-file 의 sidecar 후보. desktop: dist/tools/server.mjs → ../assets.
  for (const rel of ["../assets", "assets", "../../assets", "../../../assets"]) {
    const dir = path.resolve(here, rel);
    if (isUsableDir(dir)) return (cachedDir = dir);
  }

  return (cachedDir = null);
}

const fileCache = new Map<string, string | null>();

/** `{category}/{id}.png` 상대경로 → data URI. 없으면 null. */
function toDataUri(filesDir: string, relPath: string): string | null {
  const cacheKey = `${filesDir}::${relPath}`;
  const hit = fileCache.get(cacheKey);
  if (hit !== undefined) return hit;

  // 경로 탈출 방지 — filesDir 밖으로 못 나가게.
  const abs = path.resolve(filesDir, relPath);
  if (!abs.startsWith(path.resolve(filesDir) + path.sep)) {
    fileCache.set(cacheKey, null);
    return null;
  }
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime || !fs.existsSync(abs)) {
    fileCache.set(cacheKey, null);
    return null;
  }
  const dataUri = `data:${mime};base64,${fs.readFileSync(abs).toString("base64")}`;
  fileCache.set(cacheKey, dataUri);
  return dataUri;
}

/** 단일 URL 토큰이 DS 자산 참조면 data URI 로, 아니면 원본/누락으로. */
function rewriteUrl(
  raw: string,
  filesDir: string,
  inlined: Set<string>,
  missing: Set<string>,
): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(ASSET_REF_PREFIX)) return raw;
  const relPath = trimmed.slice(ASSET_REF_PREFIX.length);
  const dataUri = toDataUri(filesDir, relPath);
  if (dataUri) {
    inlined.add(relPath);
    return dataUri;
  }
  missing.add(relPath);
  return raw;
}

/** `url 1x, url@3x 3x` 형태 srcset 의 각 URL 토큰만 치환. descriptor 는 보존. */
function rewriteSrcset(
  srcset: string,
  filesDir: string,
  inlined: Set<string>,
  missing: Set<string>,
): string {
  return srcset
    .split(",")
    .map((entry) => {
      const parts = entry.trim().split(/\s+/);
      if (parts.length === 0 || !parts[0]) return entry;
      parts[0] = rewriteUrl(parts[0], filesDir, inlined, missing);
      return parts.join(" ");
    })
    .join(", ");
}

const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

function rewriteCssUrls(
  css: string,
  filesDir: string,
  inlined: Set<string>,
  missing: Set<string>,
): string {
  return css.replace(CSS_URL_RE, (match, quote: string, url: string) => {
    const next = rewriteUrl(url, filesDir, inlined, missing);
    return next === url ? match : `url(${quote}${next}${quote})`;
  });
}

export interface AssetInlineResult {
  /** data URI 로 치환된 자산 상대경로 목록(중복 제거). */
  inlined: string[];
  /** 규약 prefix 로 참조됐으나 파일을 못 찾은 경로(오타·미동봉) — 호출자가 경고. */
  missing: string[];
}

/**
 * cheerio 트리에서 DS 자산 참조(src · srcset · style url() · <style> url())를 모두
 * on-demand base64 로 치환한다. 자산 디렉터리를 못 찾으면 no-op(빈 결과).
 */
export function inlineDsAssetReferences($: cheerio.CheerioAPI): AssetInlineResult {
  const filesDir = resolveAssetsFilesDir();
  if (!filesDir) return { inlined: [], missing: [] };

  const inlined = new Set<string>();
  const missing = new Set<string>();

  // img/source/video/audio 등의 src.
  $("[src]").each((_, el) => {
    const v = $(el).attr("src");
    if (v) $(el).attr("src", rewriteUrl(v, filesDir, inlined, missing));
  });
  // img/source 의 srcset.
  $("[srcset]").each((_, el) => {
    const v = $(el).attr("srcset");
    if (v) $(el).attr("srcset", rewriteSrcset(v, filesDir, inlined, missing));
  });
  // 배경 등 인라인 style 의 url().
  $("[style]").each((_, el) => {
    const v = $(el).attr("style");
    if (v && v.includes(ASSET_REF_PREFIX)) {
      $(el).attr("style", rewriteCssUrls(v, filesDir, inlined, missing));
    }
  });
  // <style> 블록의 url().
  $("style").each((_, el) => {
    const v = $(el).html();
    if (v && v.includes(ASSET_REF_PREFIX)) {
      $(el).text(rewriteCssUrls(v, filesDir, inlined, missing));
    }
  });

  return { inlined: [...inlined], missing: [...missing] };
}
