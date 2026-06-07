#!/usr/bin/env node
/**
 * bundle-claude-desktop.mjs — 데스크탑 앱(apps/desktop) 동봉용 claude CLI 네이티브 바이너리 번들
 *
 * 결과물: apps/desktop/.claude-bundle/  (electron-builder extraResources → resources/claude/)
 *
 *   .claude-bundle/
 *     darwin-arm64/claude      ← Apple Silicon 네이티브 단일 바이너리(~205MB)
 *     darwin-x64/claude        ← Intel 맥(universal 빌드용)
 *     win32-x64/claude.exe     ← Windows x64
 *     version.json             ← 번들된 claude 버전 + 타깃 기록(런타임 표기/캐시 판정)
 *
 * 왜 네이티브 바이너리인가:
 *  - 요즘 `@anthropic-ai/claude-code` npm 패키지는 thin 래퍼(install.cjs)일 뿐이고,
 *    실제 CLI 는 `@anthropic-ai/claude-code-{platform}-{arch}` optionalDependency 에 담긴
 *    플랫폼별 단일 실행파일(self-contained, node 불필요)이다.
 *  - 그래서 번들 = 타깃 플랫폼의 그 바이너리 하나를 그대로 복사하는 것. node_modules·런타임
 *    의존성 없음 → resources/claude 에 두고 agent-runner 가 PATH 폴백으로 직접 spawn 한다.
 *  - 로그인 자격(~/.claude)은 어느 바이너리든 공유하므로 사용자 로그인이 그대로 유효.
 *
 * 우선순위(런타임): 사용자 PATH 설치본 우선, 없을 때만 이 동봉본 사용(agent-runner.ts).
 *
 * 사용:
 *   node scripts/bundle-claude-desktop.mjs                       # host 기준 기본 타깃, 최신 버전
 *   node scripts/bundle-claude-desktop.mjs --targets=darwin-arm64
 *   node scripts/bundle-claude-desktop.mjs --version=2.1.159 --force
 *
 * 제거(나중에 빼기): apps/desktop/.claude-bundle 디렉토리 삭제 + electron-builder.yml 의
 *   `from: .claude-bundle` extraResources 한 줄 제거 + package.json 의 bundle:claude 단계 제거.
 *   런타임 resolveBundledClaude 는 번들이 없으면 자동으로 PATH 폴백(=현재 동작)으로 돌아간다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "apps/desktop/.claude-bundle");
const WRAPPER_PKG = "@anthropic-ai/claude-code";

const IS_WIN = process.platform === "win32";

const argv = process.argv.slice(2);
function argVal(name) {
  const pref = `--${name}=`;
  const hit = argv.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : null;
}
const force = argv.includes("--force");

// Windows 의 npm 은 .cmd shim → no-shell execFileSync 가 EINVAL 날 수 있어 shell 경유(bundle-mcp 와 동일).
function run(command, args, opts = {}) {
  return execFileSync(command, args, { stdio: "inherit", shell: IS_WIN, ...opts });
}
function capture(command, args) {
  return execFileSync(command, args, { encoding: "utf8", shell: IS_WIN }).trim();
}

// 타깃: --targets=darwin-arm64,win32-x64 / 없으면 host 기준 기본값.
//   darwin host → universal(.dmg) 대비 arm64+x64 둘 다, win host → win32-x64.
function defaultTargets() {
  if (process.platform === "darwin") return ["darwin-arm64", "darwin-x64"];
  if (process.platform === "win32") return ["win32-x64"];
  if (process.platform === "linux") return [`linux-${process.arch}`];
  return [`${process.platform}-${process.arch}`];
}
const targets =
  argVal("targets")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? defaultTargets();

// 버전: --version=x / 없으면 npm 최신(가장 최신 버전 동봉이 기본 요구).
const version = argVal("version") || capture("npm", ["view", WRAPPER_PKG, "version"]);
if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`[bundle-claude-desktop] 버전 해석 실패: "${version}"`);
  process.exit(1);
}

function binNameFor(target) {
  return target.startsWith("win32") ? "claude.exe" : "claude";
}

function sizeMB(p) {
  let bytes = 0;
  const walk = (f) => {
    const st = fs.statSync(f);
    if (st.isDirectory()) for (const e of fs.readdirSync(f)) walk(path.join(f, e));
    else bytes += st.size;
  };
  walk(p);
  return (bytes / 1024 / 1024).toFixed(0);
}

console.log(`[bundle-claude-desktop] claude ${version} → ${targets.join(", ")}`);

let skipped = 0;
for (const target of targets) {
  const pkg = `${WRAPPER_PKG}-${target}`;
  const binName = binNameFor(target);
  const destDir = path.join(OUT, target);
  const destBin = path.join(destDir, binName);

  // 캐시: 같은 버전 바이너리가 이미 있으면 재다운로드 생략(바이너리당 ~200MB).
  if (!force && fs.existsSync(destBin) && readBundledVersion(target) === version) {
    console.log(`  · ${target}: 캐시 적중 (${version}) — 생략`);
    skipped += 1;
    continue;
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-claude-"));
  try {
    console.log(`  · ${target}: npm pack ${pkg}@${version} …`);
    run("npm", ["pack", `${pkg}@${version}`, "--pack-destination", tmp]);

    const tgz = fs.readdirSync(tmp).find((f) => f.endsWith(".tgz"));
    if (!tgz) throw new Error(`tgz 산출물을 못 찾음(${pkg}@${version})`);

    // tar 는 macOS·Windows10+ 모두 기본 제공(bsdtar). package/{binName} 만 추출하면 충분.
    run("tar", ["-xzf", path.join(tmp, tgz), "-C", tmp]);

    const src = path.join(tmp, "package", binName);
    if (!fs.existsSync(src)) {
      throw new Error(`바이너리(${binName})가 패키지에 없음 — ${pkg}@${version} 구조 변경?`);
    }

    fs.rmSync(destDir, { recursive: true, force: true });
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, destBin);
    if (!binName.endsWith(".exe")) fs.chmodSync(destBin, 0o755); // 실행권한(packaged 후 후속 chmod 보강도 있음)

    console.log(`    → ${path.relative(ROOT, destBin)} (${sizeMB(destBin)} MB)`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// version.json — 디스크에 실제 존재하는 타깃을 스캔해 기록(런타임 표기 + 다음 빌드 캐시 판정).
fs.mkdirSync(OUT, { recursive: true });
const present = fs
  .readdirSync(OUT, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((t) => fs.existsSync(path.join(OUT, t, binNameFor(t))));
fs.writeFileSync(
  path.join(OUT, "version.json"),
  `${JSON.stringify({ version, targets: present }, null, 2)}\n`,
);

console.log(
  `\n✓ claude 데스크탑 번들 (${version}) — ${present.join(", ")} ` +
    `(${sizeMB(OUT)} MB${skipped ? `, ${skipped} 캐시` : ""})`,
);

/** 기존 번들의 version.json 에서 해당 target 이 기록된 버전을 읽는다(없으면 null). */
function readBundledVersion(target) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(OUT, "version.json"), "utf8"));
    return meta.version && (meta.targets ?? []).includes(target) ? meta.version : null;
  } catch {
    return null;
  }
}
