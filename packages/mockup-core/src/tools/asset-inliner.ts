/**
 * tools/asset-inliner.ts — DS raster/vector 자산 on-demand base64 인라이너.
 *
 * `@nudge-design/assets` 의 화면 이미지(NudgeEAP images · 일러스트 · 프로필 등)는
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
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

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

let cachedLocalDir: string | null | undefined;

/**
 * 로컬 DS 자산 파일 루트(dist/files 또는 동봉 sidecar). 못 찾으면 null.
 * dev 모노레포는 ②, 옛 desktop 번들은 ③ 로 잡힌다. mcpb/터미널은 자산을 번들하지
 * 않으므로(158MB 제거) 여기선 null → S3 캐시(아래)로 폴백한다.
 */
function resolveLocalAssetsDir(): string | null {
  if (cachedLocalDir !== undefined) return cachedLocalDir;

  // ① 명시 env override.
  const envDir = process.env.NUDGE_DS_ASSETS_DIR;
  if (isUsableDir(envDir)) return (cachedLocalDir = envDir);

  // ② node_modules resolve. createRequire 로 호출해 esbuild 가 정적 번들하지 않고
  //    런타임 resolve 로 남긴다. "./package.json"(전 조건 노출) → 형제 dist/files.
  //    ("." export 는 import 조건만 있어 require.resolve 가 throw 하므로 package.json 으로 잡는다.)
  try {
    const req = createRequire(import.meta.url);
    const pkg = req.resolve("@nudge-design/assets/package.json");
    const dir = path.join(path.dirname(pkg), "dist", "files");
    if (isUsableDir(dir)) return (cachedLocalDir = dir);
  } catch {
    // resolve 실패는 ③ 으로.
  }

  // ③ 옛 bundled single-file 의 sidecar 후보. desktop: dist/tools/server.mjs → ../assets.
  for (const rel of ["../assets", "assets", "../../assets", "../../../assets"]) {
    const dir = path.resolve(here, rel);
    if (isUsableDir(dir)) return (cachedLocalDir = dir);
  }

  return (cachedLocalDir = null);
}

const ASSET_ORIGIN_DEFAULT = "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com";
function assetOrigin(): string {
  return (
    process.env.NUDGE_DS_ASSET_CDN_ORIGIN ||
    process.env.NUDGE_DS_CDN_ORIGIN ||
    ASSET_ORIGIN_DEFAULT
  ).replace(/\/+$/, "");
}
function assetVersion(): string {
  return (process.env.NUDGE_DS_ASSET_VERSION || "").trim();
}
/** S3 에서 받은 자산을 캐싱하는 로컬 디렉터리(버전별). 버전 미상이면 null. */
function s3CacheDir(): string | null {
  const v = assetVersion();
  if (!v) return null;
  const root =
    process.env.NUDGE_DS_ASSET_CACHE_DIR || path.join(os.homedir(), ".nudge-ds", "assets");
  return path.join(root, v, "files");
}

/**
 * DS 자산 파일 루트. 로컬(dev) 우선, 없으면 S3 캐시 디렉터리(prefetch 가 채움).
 * 인라이너(동기)는 여기서 읽는다 — prod 에선 prefetchDsAssets 가 먼저 채워야 한다.
 */
export function resolveAssetsFilesDir(): string | null {
  const local = resolveLocalAssetsDir();
  if (local) return local;
  const cache = s3CacheDir();
  return cache && isUsableDir(cache) ? cache : null;
}

/** DOM 에서 @nudge-design/assets/files/* 참조의 상대경로들을 수집. */
function collectAssetRefs($: cheerio.CheerioAPI): Set<string> {
  const refs = new Set<string>();
  const add = (raw?: string | null) => {
    if (!raw || !raw.includes(ASSET_REF_PREFIX)) return;
    for (const m of raw.matchAll(/@nudge-design\/assets\/files\/([^\s'")]+)/g)) {
      if (m[1] && !m[1].includes("..")) refs.add(m[1]);
    }
  };
  $("[src]").each((_, el) => add($(el).attr("src")));
  $("[srcset]").each((_, el) => add($(el).attr("srcset")));
  $("[style]").each((_, el) => add($(el).attr("style")));
  $("style").each((_, el) => add($(el).html()));
  return refs;
}

/**
 * 목업이 참조한 DS 자산 중 로컬에 없는 것을 S3(nds-assets/assets/{ver}/files/)에서 받아
 * 로컬 캐시에 채운다. 이후 동기 인라이너가 캐시에서 읽어 base64 인라인 → 단일 HTML 유지.
 * 자산을 번들에서 뺀 prod(mcpb/터미널)용. dev(로컬 파일 있음)·버전 미상이면 no-op.
 * best-effort — 다운로드 실패는 조용히 두고(인라이너가 missing 으로 보고) 빌드는 안 깬다.
 */
export async function prefetchDsAssets($: cheerio.CheerioAPI): Promise<void> {
  const cacheDir = s3CacheDir();
  if (!cacheDir) return; // 버전 미상 → S3 fetch 불가(dev 로컬에 의존)
  const refs = collectAssetRefs($);
  if (refs.size === 0) return;
  const local = resolveLocalAssetsDir();
  const origin = assetOrigin();
  const version = assetVersion();
  for (const relPath of refs) {
    if (local && fs.existsSync(path.join(local, relPath))) continue; // 로컬에 이미 있음
    const dest = path.join(cacheDir, relPath);
    if (fs.existsSync(dest)) continue; // 이미 캐시됨
    const url = `${origin}/nds-assets/assets/${version}/files/${relPath}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
    } catch {
      /* best-effort — missing 은 인라이너가 보고 */
    }
  }
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

/**
 * 문자열 HTML 에서 DS 자산 참조를 base64 로 인라인한다 — cheerio 트리가 없는 경로(라이브
 * 미리보기 mockup:// 서빙 등)에서 export(build-html)와 동일하게 이미지를 표시하기 위함.
 * 자산 참조가 하나도 없으면 원본 문자열을 그대로 반환(불필요한 cheerio round-trip 회피).
 */
export function inlineDsAssetReferencesInHtml(html: string): { html: string } & AssetInlineResult {
  // 참조 prefix 가 아예 없으면 파싱 자체를 건너뛴다(대부분의 목업은 자산 참조 없음).
  if (!html.includes(ASSET_REF_PREFIX)) return { html, inlined: [], missing: [] };
  const $ = cheerio.load(html, { xmlMode: false });
  const result = inlineDsAssetReferences($);
  if (result.inlined.length === 0 && result.missing.length === 0) {
    return { html, ...result };
  }
  return { html: $.html(), ...result };
}
