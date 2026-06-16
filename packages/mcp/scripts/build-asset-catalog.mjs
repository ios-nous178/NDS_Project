#!/usr/bin/env node
/**
 * build-asset-catalog.mjs — @nudge-design/assets 의 src/files/** → src/asset-catalog.generated.ts.
 *
 * find_asset 도구가 읽는 **검색용 에셋 카탈로그**의 SSOT 생성기. 파일시스템(전 브랜드 479장)을
 * 걸어 brand/category/id/inlineRef/retina 를 정규화한다. metadata 모듈(Geniet/NudgeImg/…)이
 * 모듈마다 형태가 달라(Record vs 배열) 통합이 깨지기 쉬우므로, **파일이 SSOT**다(빠짐 없음 보장).
 * 이름이 의미를 담은 id(beef·bibimbap·salad…)라 path 토큰만으로도 1차 fuzzy 가 선다.
 *
 * 결정적(타임스탬프·해시 없음) — guides.generated.ts 와 동일하게 커밋되고 --check 로 stale 차단.
 *
 * 사용:
 *   node scripts/build-asset-catalog.mjs          # 재생성
 *   node scripts/build-asset-catalog.mjs --check   # 검증 + stale 검사 (CI/lint)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.join(__dirname, "..");
const FILES_DIR = path.resolve(PKG, "../assets/src/files");
const OUT_PATH = path.join(PKG, "src/asset-catalog.generated.ts");
const KO_TAGS_PATH = path.join(PKG, "asset-tags.ko.json");
const CHECK = process.argv.includes("--check");

// 한글 검색 태그 사이드카(id → [한글 동의어]) — 영문 파일명만으론 한글 질의가 안 잡히는 걸 보강한다.
// 누락돼도 영문 검색은 그대로 동작하므로 파일이 없으면 경고만 하고 빈 맵으로 진행.
const KO_TAGS_BY_ID = (() => {
  if (!fs.existsSync(KO_TAGS_PATH)) {
    console.warn(
      `[asset-catalog] ⚠ 한글 태그 사이드카 없음(${path.basename(KO_TAGS_PATH)}) — 영문 토큰만으로 진행`,
    );
    return {};
  }
  const raw = JSON.parse(fs.readFileSync(KO_TAGS_PATH, "utf8"));
  return raw.byId ?? {};
})();

const MIME_BY_EXT = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
};
const IMAGE_EXTS = new Set(Object.keys(MIME_BY_EXT));

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs, base));
    else if (entry.isFile()) out.push(path.relative(base, abs).split(path.sep).join("/"));
  }
  return out;
}

/** relPath(=files/ 기준) → { scope, brand, category }. category = brand/scope 아래 디렉토리 경로(파일명 제외). */
function classify(relParts) {
  const dirs = relParts.slice(0, -1); // 파일명 제외
  if (dirs[0] === "brand") {
    return {
      scope: "brand",
      brand: dirs[1] ?? "unknown",
      category: dirs.slice(2).join("/") || "root",
    };
  }
  if (dirs[0] === "shared") {
    return { scope: "shared", brand: "shared", category: dirs.slice(1).join("/") || "root" };
  }
  return { scope: "unknown", brand: "unknown", category: dirs.join("/") || "root" };
}

/** 파일 stem 에서 @2x/@3x 레티나 접미사 분리 → { baseId, retina } (retina: null|"2x"|"3x"). */
function splitRetina(stem) {
  const m = stem.match(/^(.*)@(\d+x)$/);
  return m ? { baseId: m[1], retina: m[2] } : { baseId: stem, retina: null };
}

/** kebab/camel/숫자 경계로 토큰화해 소문자 검색어 집합 생성. */
function tokenize(...parts) {
  const set = new Set();
  for (const p of parts) {
    if (!p) continue;
    for (const tok of String(p)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(/[^a-zA-Z0-9가-힣]+/)) {
      const t = tok.toLowerCase();
      if (t) set.add(t);
    }
  }
  return [...set];
}

if (!fs.existsSync(FILES_DIR)) {
  console.error(`[asset-catalog] ✗ files dir 없음: ${FILES_DIR}`);
  process.exit(1);
}

// 1) 파일 walk → base 기준으로 그룹(레티나 변형 흡수).
const groups = new Map(); // key = `${dir}/${baseId}` → entry
for (const rel of walk(FILES_DIR)) {
  const ext = path.extname(rel).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) continue;
  const parts = rel.split("/");
  const file = parts[parts.length - 1];
  const dir = parts.slice(0, -1).join("/");
  const stem = file.slice(0, file.length - ext.length);
  const { baseId, retina } = splitRetina(stem);
  const key = `${dir}/${baseId}${ext}`;
  const { scope, brand, category } = classify(parts);

  let entry = groups.get(key);
  if (!entry) {
    entry = {
      brand,
      scope,
      category,
      id: baseId,
      inlineRef: "", // base(레티나 없는 것 또는 최저배율)로 아래에서 채움
      filename: "",
      mimeType: MIME_BY_EXT[ext] ?? "application/octet-stream",
      retina: [],
      _baseFilled: false,
    };
    groups.set(key, entry);
  }
  const refPath = `${dir}/${file}`;
  if (retina) {
    entry.retina.push(retina);
  } else {
    entry.filename = refPath;
    entry.inlineRef = `@nudge-design/assets/files/${refPath}`;
    entry._baseFilled = true;
  }
  // base(1x)가 없고 레티나만 있는 경우(드묾) → 첫 레티나를 ref 로 폴백.
  if (!entry._baseFilled && !entry.inlineRef) {
    entry.filename = refPath;
    entry.inlineRef = `@nudge-design/assets/files/${refPath}`;
  }
}

// 검색 토큰 = 영문 path 토큰(brand·category·id) + 한글 사이드카 태그(id 매칭).
// 영문 토큰을 먼저(기존 순서 유지 → catalog churn 최소), 한글을 뒤에 append. 결정적.
function buildSearch(e) {
  const set = new Set(tokenize(e.brand, e.category, e.id));
  for (const tag of KO_TAGS_BY_ID[e.id] ?? []) {
    set.add(tag.toLowerCase()); // 구절 전체(예: "돼지족발")
    for (const sub of tokenize(tag)) set.add(sub); // 분절 토큰(공백/기호 포함 태그 대비)
  }
  return [...set];
}

// 2) 정렬 + 검색 토큰 부여 → 직렬화 형태로 정규화.
const catalog = [...groups.values()]
  .map((e) => ({
    brand: e.brand,
    scope: e.scope,
    category: e.category,
    id: e.id,
    inlineRef: e.inlineRef,
    mimeType: e.mimeType,
    ...(e.retina.length ? { retina: [...new Set(e.retina)].sort() } : {}),
    search: buildSearch(e),
  }))
  .sort((a, b) =>
    `${a.brand}/${a.category}/${a.id}` < `${b.brand}/${b.category}/${b.id}` ? -1 : 1,
  );

// 3) 브랜드×카테고리 요약(no-arg find_asset 응답용).
const summary = {};
for (const e of catalog) {
  summary[e.brand] ??= {};
  summary[e.brand][e.category] = (summary[e.brand][e.category] ?? 0) + 1;
}

const generated = `/**
 * AUTO-GENERATED — @nudge-design/assets/src/files/** 에서 build-asset-catalog.mjs 가 생성. 직접 수정 금지.
 *
 * 에셋 추가/이름변경 → packages/assets/src/files/ 를 고치고
 * \`pnpm --filter @nudge-design/mcp build:assets\` 로 재생성해 함께 커밋한다.
 * 한글 검색 태그는 packages/mcp/asset-tags.ko.json(id→[태그]) 에서 search 토큰으로 머지된다.
 * (check-ssot 의 asset-catalog --check 가 stale 을 차단한다.)
 */

export interface AssetCatalogEntry {
  /** 브랜드 slug 또는 "shared". */
  brand: string;
  scope: "brand" | "shared" | "unknown";
  /** 브랜드 아래 디렉토리 경로(예: "images/food-types", "logos", "profiles"). */
  category: string;
  /** 파일 stem(레티나 접미사 제거) — 보통 의미 있는 kebab id(예: "bibimbap"). */
  id: string;
  /** <img src> 에 그대로 박으면 build_singlefile_html 이 base64 인라인하는 경로. */
  inlineRef: string;
  mimeType: string;
  /** 보유 레티나 변형(예: ["3x"]). 없으면 키 자체가 없음. */
  retina?: string[];
  /** 소문자 검색 토큰(brand·category·id 영문 + asset-tags.ko.json 한글 태그). */
  search: string[];
}

export const ASSET_CATALOG: AssetCatalogEntry[] = ${JSON.stringify(catalog, null, 2)};

/** 브랜드 → 카테고리 → 에셋 수 요약. */
export const ASSET_CATALOG_SUMMARY: Record<string, Record<string, number>> = ${JSON.stringify(summary, null, 2)};
`;

if (CHECK) {
  const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : "";
  if (current !== generated) {
    console.error(
      "[asset-catalog] ✗ src/asset-catalog.generated.ts 가 assets/src/files 와 어긋남(stale) — " +
        "`pnpm --filter @nudge-design/mcp build:assets` 로 재생성해 커밋하세요.",
    );
    process.exit(1);
  }
  console.log(`[asset-catalog] ✓ 검증 통과 (assets=${catalog.length}, 생성물 fresh)`);
} else {
  fs.writeFileSync(OUT_PATH, generated, "utf8");
  console.log(
    `[asset-catalog] 생성: ${catalog.length} 에셋 (브랜드 ${Object.keys(summary).length}) → src/asset-catalog.generated.ts`,
  );
}
