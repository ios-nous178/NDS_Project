#!/usr/bin/env node
/**
 * bundle-mcp-desktop.mjs — 데스크탑 앱(apps/desktop) 동봉용 nudge-ds MCP 번들 생성
 *
 * 결과물: apps/desktop/.mcp-bundle/  (electron-builder extraResources → resources/mcp/)
 *
 *   .mcp-bundle/
 *     dist/
 *       tools/server.mjs   ← esbuild 단일 파일(workspace deps 까지 인라인)
 *       catalog.json       ← server 가 __dirname/../catalog.json 로 읽음
 *       manifest.json
 *     references/*.png     ← get_guide imageAbsolutePath 가 가리키는 스크린샷
 *
 * 왜 esbuild 단일 파일인가:
 *  - MCP 서버는 @nudge-design/mockup-core·assets·icons(workspace) 를 런타임에
 *    정적 import 한다. pack-mcpb 의 npm-install 방식은 이 workspace 패키지를 tgz 로
 *    넣지 않아 부팅이 깨진다. esbuild 로 전부 인라인하면 node_modules 없이 한 파일로 동작.
 *  - Windows/Mac 공통: 네이티브 모듈 없음, 심볼릭 링크 없음 → 그대로 복사하면 끝.
 *
 * 왜 dist/tools/server.mjs 깊이인가(핵심):
 *  - 단일 파일로 합치면 모든 모듈의 import.meta.url 이 출력 파일 위치로 collapse 된다.
 *  - 원본은 server.js(dist/) 와 tools/guides.js(dist/tools/) 가 깊이가 달라
 *    catalog 는 `__dirname/../`, references 는 `__dirname/../..`(MCP_PACKAGE_ROOT)로 잡았다.
 *  - 출력을 dist/tools/server.mjs 에 두면 두 수식이 모두 성립한다:
 *      catalog  = dist/tools/../catalog.json   → dist/catalog.json
 *      manifest = dist/tools/../manifest.json  → dist/manifest.json
 *      refs root = dist/tools/../..            → .mcp-bundle  → references/
 *
 * 런타임: agent-runner 가 Electron-as-node(process.execPath + ELECTRON_RUN_AS_NODE=1)로
 * 띄우고 claude --mcp-config 로 주입한다 (apps/desktop/src/main/mcp-config.ts).
 *
 * 사용:
 *   node scripts/bundle-mcp-desktop.mjs              # mcp 빌드 + 번들
 *   node scripts/bundle-mcp-desktop.mjs --no-build   # 이미 빌드된 dist 재사용
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MCP = path.join(ROOT, "packages/mcp");
const OUT = path.join(ROOT, "apps/desktop/.mcp-bundle");

const skipBuild = process.argv.includes("--no-build");

const IS_WIN = process.platform === "win32";
// Windows에서 pnpm은 .cmd shim으로 제공된다. Node 24의 execFileSync(no-shell)로 .cmd를
// 직접 실행하면 GitHub Actions windows runner에서 EINVAL이 날 수 있어 shell을 통해 실행한다.
const PNPM = "pnpm";

function run(command, args) {
  console.log(`$ ${[command, ...args].join(" ")}`);
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit", shell: IS_WIN });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

function sizeMB(p) {
  let bytes = 0;
  const walk = (f) => {
    const st = fs.statSync(f);
    if (st.isDirectory()) for (const e of fs.readdirSync(f)) walk(path.join(f, e));
    else bytes += st.size;
  };
  walk(p);
  return (bytes / 1024 / 1024).toFixed(1);
}

// 1) MCP 빌드 (dist/server.js + catalog.json 생성)
if (!skipBuild) run(PNPM, ["build", "--filter", "@nudge-design/mcp"]);

const serverEntry = path.join(MCP, "dist/server.js");
if (!fs.existsSync(serverEntry)) {
  console.error(
    `[bundle-mcp-desktop] ${path.relative(ROOT, serverEntry)} 없음 — --no-build 없이 실행하세요.`,
  );
  process.exit(1);
}

// prebuilt DS 단일 자산(html intent inline 의 자원). resolver 가 catalog.json 과 같은 레벨
// (dist/standalone)에서 찾는다. 없으면 html 목업 빌드가 깨지므로 강하게 가드.
const standaloneSrc = path.join(ROOT, "packages/html/dist/standalone");
if (!fs.existsSync(path.join(standaloneSrc, "manifest.json"))) {
  console.error(
    `[bundle-mcp-desktop] ${path.relative(ROOT, standaloneSrc)}/manifest.json 없음 — ` +
      `'pnpm build --filter @nudge-design/html' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}

// DS 화면 이미지 자산(@nudge-design/assets/files/*). build_singlefile_html 이 목업이
// 실제 참조한 것만 on-demand base64 로 inline 한다(asset-inliner). packaged 앱은
// node_modules 가 없으니 dist/files 를 dist/assets sidecar 로 동봉 →
// server.mjs(dist/tools) 기준 ../assets 로 resolveAssetsFilesDir 가 찾는다.
const assetsFilesSrc = path.join(ROOT, "packages/assets/dist/files");
if (!fs.existsSync(assetsFilesSrc)) {
  console.error(
    `[bundle-mcp-desktop] ${path.relative(ROOT, assetsFilesSrc)} 없음 — ` +
      `'pnpm build --filter @nudge-design/assets' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}

// find_icon({ name }) 이 lazy 로드하는 아이콘 vanilla 정의(viewBox+body). packaged 앱은
// node_modules 가 없으니 sidecar 로 동봉 → server.mjs(dist/tools) 기준 ../icons/vanilla.js
// 를 icon-svg.ts 의 resolver 가 찾는다. (mcp-config.ts 가 env 로도 명시.)
const iconsVanillaSrc = path.join(ROOT, "packages/icons/dist/vanilla.js");
if (!fs.existsSync(iconsVanillaSrc)) {
  console.error(
    `[bundle-mcp-desktop] ${path.relative(ROOT, iconsVanillaSrc)} 없음 — ` +
      `'pnpm build --filter @nudge-design/icons' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}

// 2) 기존 산출물 비우기
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "dist/tools"), { recursive: true });

// 3) esbuild 단일 파일 (workspace deps 포함 전부 인라인, node: 빌트인만 외부)
console.log("[bundle-mcp-desktop] esbuild → dist/tools/server.mjs");
await build({
  entryPoints: [serverEntry],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: path.join(OUT, "dist/tools/server.mjs"),
  // ESM 출력에서 번들된 CJS 의존성(cheerio→undici 등)이 쓰는 require 를 살린다.
  // __dirname 은 server.js 가 import.meta.url 로 자체 선언하므로 배너에 넣지 않는다(중복 선언 회피).
  banner: {
    js: "import{createRequire as __nudgeCR}from'node:module';const require=__nudgeCR(import.meta.url);",
  },
  logLevel: "warning",
});

// 4) 런타임 부속 자산
fs.copyFileSync(path.join(MCP, "catalog.json"), path.join(OUT, "dist/catalog.json"));
fs.copyFileSync(path.join(MCP, "manifest.json"), path.join(OUT, "dist/manifest.json"));

// 4-a) 빌드 스탬프 — manifest version 이 0.0.1 로 고정이라 번들이 stale 해도 조용히 묻힌다.
// git HEAD + 빌드 시각을 박아 mcp-config.ts 가 주입 로그에 찍게 하고(어떤 빌드의 MCP 가 붙었는지),
// packaged 앱 디버깅 때 "이 번들이 언제/어느 커밋 기준인지"를 한눈에 알 수 있게 한다.
const gitHead = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT }).toString().trim();
  } catch {
    return null;
  }
})();
fs.writeFileSync(
  path.join(OUT, "dist/BUILD_STAMP.json"),
  `${JSON.stringify(
    {
      gitHead,
      builtAt: new Date().toISOString(),
      mcpManifestVersion: JSON.parse(fs.readFileSync(path.join(MCP, "manifest.json"), "utf8"))
        .version,
    },
    null,
    2,
  )}\n`,
);
copyDir(path.join(MCP, "references"), path.join(OUT, "references"));
// prebuilt DS 단일 자산 → dist/standalone (server.mjs 의 __dirname/../standalone 으로 resolve).
copyDir(standaloneSrc, path.join(OUT, "dist/standalone"));
// DS 화면 이미지 자산 → dist/assets (server.mjs 의 __dirname/../assets 으로 resolve).
copyDir(assetsFilesSrc, path.join(OUT, "dist/assets"));
// 아이콘 vanilla 정의 → dist/icons/vanilla.js (server.mjs 의 __dirname/../icons/vanilla.js).
fs.mkdirSync(path.join(OUT, "dist/icons"), { recursive: true });
fs.copyFileSync(iconsVanillaSrc, path.join(OUT, "dist/icons/vanilla.js"));
// vanilla.js 는 ESM(`export …`)인데 패키징되면 이 트리가 resources/mcp/ 로 떨어지며
// 위쪽 `"type":"module"` package.json 조상이 사라진다. 그러면 Electron-as-node 가 bare
// `.js` 를 CommonJS 로 파싱해 `Unexpected token 'export'` 로 죽고 find_icon 의 모든 아이콘
// 로드가 실패한다(모듈 로드 단계라 아이콘 전체 영향). dist/icons 옆에 타입 마커를 떨궈,
// 번들이 어디로 풀리든 ESM 으로 해석되게 한다.
fs.writeFileSync(
  path.join(OUT, "dist/icons/package.json"),
  `${JSON.stringify({ type: "module" })}\n`,
);

console.log(`\n✓ MCP 데스크탑 번들 생성 (${sizeMB(OUT)} MB):`);
console.log(`  ${path.relative(ROOT, OUT)}`);
