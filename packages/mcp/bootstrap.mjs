#!/usr/bin/env node
/**
 * bootstrap.mjs — Nudge DS MCP 자기갱신 런처 (Claude Desktop .mcpb · Claude Code 터미널 공용)
 *
 * 왜 필요한가:
 *   레포가 프라이빗이라 GitHub Release 직링크/API 로는 외부 사용자가 산출물을 못 받는다.
 *   그래서 진짜 MCP 본체는 S3(에셋 버킷)에 올려두고, 사용자에게는 "얇은 부트스트랩"만 배포한다.
 *   부트스트랩이 실행 때마다 S3 의 최신 본체를 (백그라운드로) 받아두므로
 *   → S3 한 번 갱신하면 Desktop·터미널 사용자 전원에게 (다음 실행부터) 반영된다.
 *
 * 동작 (시작 지연 0 을 위한 background-update):
 *   1) 캐시(~/.nudge-ds/mcp)에 받아둔 최신 본체가 있으면 그걸로, 없으면 .mcpb 에 동봉된
 *      embedded 본체로 **즉시** 서버를 spawn 한다. (오프라인/첫 실행도 바로 동작)
 *   2) 동시에 백그라운드로 S3 version.json 을 확인 → 새 버전이면 tar.gz 를 받아 sha256 검증 후
 *      캐시에 풀어두고 current.json 을 갱신한다. 이 새 버전은 **다음 실행**부터 쓰인다.
 *   3) 로컬에 쓸 본체가 하나도 없으면(첫 실행+동봉 없음) 그때만 블로킹으로 받아 실행한다.
 *
 * 의존성: Node 빌트인만 사용(번들/설치 불필요). 압축 해제는 시스템 `tar` (macOS/Linux/Win10+ 기본).
 *
 * 환경변수:
 *   NUDGE_DS_UPDATE_URL        version.json URL (기본: 에셋 S3 origin + /nds-assets/mcp/version.json)
 *   NUDGE_DS_CACHE_DIR         캐시 루트 (기본: ~/.nudge-ds/mcp)
 *   NUDGE_DS_EMBEDDED_DIR      .mcpb 동봉 본체 루트 (manifest 가 ${__dirname}/embedded 로 주입)
 *   NUDGE_DS_NO_UPDATE=1       업데이트 체크 비활성화 (오프라인/CI)
 *   NUDGE_DS_UPDATE_TIMEOUT_MS version.json fetch 타임아웃 (기본 2500)
 *   그 외 NUDGE_DS_* 는 그대로 서버 자식 프로세스로 전달된다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// stderr 로만 로그(=stdout 은 MCP JSON-RPC 전용이라 절대 오염 금지).
function log(msg) {
  process.stderr.write(`[nudge-ds bootstrap] ${msg}\n`);
}

// ── 설정 해석 ────────────────────────────────────────────────────────────────
const DEFAULT_ORIGIN =
  process.env.NUDGE_DS_ASSET_CDN_ORIGIN ||
  process.env.NUDGE_DS_CDN_ORIGIN ||
  "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com";
const UPDATE_URL =
  process.env.NUDGE_DS_UPDATE_URL ||
  `${DEFAULT_ORIGIN.replace(/\/+$/, "")}/nds-assets/mcp/version.json`;
const CACHE_ROOT = process.env.NUDGE_DS_CACHE_DIR || path.join(os.homedir(), ".nudge-ds", "mcp");
const VERSIONS_DIR = path.join(CACHE_ROOT, "versions");
const CURRENT_JSON = path.join(CACHE_ROOT, "current.json");
const EMBEDDED_DIR = process.env.NUDGE_DS_EMBEDDED_DIR
  ? path.resolve(process.env.NUDGE_DS_EMBEDDED_DIR)
  : path.join(__dirname, "embedded");
const UPDATE_DISABLED = process.env.NUDGE_DS_NO_UPDATE === "1";
const FETCH_TIMEOUT = Number(process.env.NUDGE_DS_UPDATE_TIMEOUT_MS) || 2500;
const KEEP_VERSIONS = 2; // 디스크 누수 방지: 최신 N개만 유지

// ── 작은 유틸 ────────────────────────────────────────────────────────────────
function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeJsonAtomic(file, obj) {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, file);
}

// 본체 루트가 실제로 실행 가능한지(서버 엔트리 존재) 확인.
function serverEntry(rootDir) {
  return path.join(rootDir, "tools", "server.mjs");
}
function isUsableRoot(rootDir) {
  return !!rootDir && fs.existsSync(serverEntry(rootDir));
}

// 지금 즉시 실행할 본체 루트를 고른다: 캐시 current > 동봉 embedded.
// 캐시 디렉터리 이름(=cache key)은 buildId(=git sha, content-addressed) — 버전이
// 그대로여도 main push 로 내용이 바뀌면 buildId 가 달라져 새 본체를 받는다.
function resolveRunRoot() {
  const cur = readJsonSafe(CURRENT_JSON);
  const id = cur?.buildId ?? cur?.version; // 구 캐시(version 키) 하위호환
  if (id) {
    const dir = path.join(VERSIONS_DIR, id);
    if (isUsableRoot(dir)) return { root: dir, version: cur.version ?? id, source: "cache" };
  }
  if (isUsableRoot(EMBEDDED_DIR)) {
    const v = readJsonSafe(path.join(EMBEDDED_DIR, "manifest.json"))?.version ?? "embedded";
    return { root: EMBEDDED_DIR, version: v, source: "embedded" };
  }
  return null;
}

async function fetchJson(url, timeoutMs) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function downloadTo(url, destFile, timeoutMs) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destFile, buf);
    return buf;
  } finally {
    clearTimeout(t);
  }
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function hasTar() {
  const r = spawnSync("tar", ["--version"], { stdio: "ignore" });
  return !r.error && r.status === 0;
}

function extractTarGz(tarFile, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const r = spawnSync("tar", ["-xzf", tarFile, "-C", destDir], { stdio: "inherit" });
  if (r.error || r.status !== 0) {
    throw new Error(`tar 압축 해제 실패 (status=${r.status})`);
  }
}

function pruneOldVersions(keepVersion) {
  try {
    const entries = fs
      .readdirSync(VERSIONS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    // current 는 항상 보존. 나머지를 mtime 최신순으로 KEEP_VERSIONS-1 개만 남김.
    const others = entries
      .filter((n) => n !== keepVersion && !n.includes(".tmp-"))
      .map((n) => ({ n, m: fs.statSync(path.join(VERSIONS_DIR, n)).mtimeMs }))
      .sort((a, b) => b.m - a.m);
    for (const { n } of others.slice(Math.max(0, KEEP_VERSIONS - 1))) {
      fs.rmSync(path.join(VERSIONS_DIR, n), { recursive: true, force: true });
    }
  } catch {
    /* 정리는 best-effort */
  }
}

/**
 * S3 version.json 확인 → 새 빌드(buildId 변경)면 받아서 캐시에 풀고 current.json 갱신.
 * 버전(semver)이 아니라 buildId(=git sha) 로 판단하므로, main push 마다 S3 만 갱신해도
 * 클라이언트가 다음 실행에 새 본체를 가져온다.
 * @returns 새로 설치한 빌드 디렉터리(블로킹 첫 실행용) 또는 null
 */
async function checkAndInstallUpdate() {
  if (UPDATE_DISABLED) return null;
  if (!hasTar()) {
    log("system `tar` 없음 — 자동 업데이트 건너뜀(캐시/동봉본 사용).");
    return null;
  }
  let remote;
  try {
    remote = await fetchJson(UPDATE_URL, FETCH_TIMEOUT);
  } catch (e) {
    log(`업데이트 확인 실패(오프라인 가능): ${e.message}`);
    return null;
  }
  const { version, buildId, bundleUrl, sha256: wantHash } = remote ?? {};
  // cache key = buildId(content-addressed) 우선, 없으면 version 폴백(구 포맷 호환).
  const key = buildId || version;
  if (!key || !bundleUrl) {
    log("version.json 형식 이상 — 건너뜀.");
    return null;
  }
  const targetDir = path.join(VERSIONS_DIR, key);
  if (isUsableRoot(targetDir)) {
    // 이미 받아둔 빌드. current 만 정렬 맞춰주고 끝.
    const cur = readJsonSafe(CURRENT_JSON);
    if (cur?.buildId !== key) writeJsonAtomic(CURRENT_JSON, { buildId: key, version });
    return null;
  }

  log(`새 본체 다운로드: build=${key} (v${version ?? "?"})`);
  fs.mkdirSync(VERSIONS_DIR, { recursive: true });
  const tmpTar = path.join(VERSIONS_DIR, `dl-${key}-${process.pid}.tar.gz`);
  const tmpDir = path.join(VERSIONS_DIR, `${key}.tmp-${process.pid}`);
  try {
    // bundleUrl 이 상대경로면 version.json URL 기준으로 절대화(방어적).
    const absBundleUrl = new URL(bundleUrl, UPDATE_URL).href;
    const buf = await downloadTo(absBundleUrl, tmpTar, 30000);
    if (wantHash) {
      const got = sha256(buf);
      if (got !== wantHash) {
        throw new Error(`sha256 불일치: want=${wantHash} got=${got}`);
      }
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
    extractTarGz(tmpTar, tmpDir);
    if (!isUsableRoot(tmpDir)) {
      throw new Error("압축 해제했지만 tools/server.mjs 가 없음 — 번들 구조 이상");
    }
    // 원자적 교체: 다른 프로세스가 먼저 만들었으면 그걸 둔다.
    if (!fs.existsSync(targetDir)) {
      fs.renameSync(tmpDir, targetDir);
    } else {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    writeJsonAtomic(CURRENT_JSON, { buildId: key, version });
    pruneOldVersions(key);
    log(`설치 완료: build=${key} (다음 실행부터 적용)`);
    return targetDir;
  } catch (e) {
    log(`업데이트 설치 실패: ${e.message}`);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return null;
  } finally {
    fs.rmSync(tmpTar, { force: true });
  }
}

// 선택한 본체의 MCP 서버를 **같은 프로세스에서** import 로 구동한다.
// 자식 process spawn(process.execPath, …) 은 Claude Desktop 의 내장 런타임
// (Electron-as-node 등)에서 execPath 가 일반 node 가 아니라 서버가 안 떴다.
// import() 는 부트스트랩을 띄운 바로 그 런타임을 쓰므로 항상 호환된다.
// (서버는 top-level 에서 StdioServerTransport 로 process.stdin/stdout 에 연결 →
//  부트스트랩의 stdio 가 곧 MCP 채널. 부트스트랩은 stdout 을 절대 안 건드린다.)
async function runServer(root) {
  const entry = serverEntry(root);
  // 서버의 sidecar resolver 가 env 를 먼저 보므로, 선택된 본체 기준으로 지정.
  process.env.NUDGE_DS_STANDALONE_DIR = path.join(root, "standalone");
  process.env.NUDGE_DS_ASSETS_DIR = path.join(root, "assets");
  process.env.NUDGE_DS_ICONS_VANILLA = path.join(root, "icons", "vanilla.js");
  // 서버는 isDirectRun(argv[1]==자기자신)일 때만 stdio 에 연결한다. import 로 구동하므로
  // argv[1] 을 서버 경로로 맞춰 `node server.mjs` 직접 실행과 동일 상태를 만든다.
  process.argv[1] = entry;
  await import(pathToFileURL(entry).href);
}

// ── 엔트리 ───────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(VERSIONS_DIR, { recursive: true });
  const run = resolveRunRoot();

  if (run) {
    // 즉시 실행 + 백그라운드 업데이트(다음 실행 반영). 시작 지연 0.
    log(`start ${run.version} (${run.source}); update check → ${UPDATE_URL}`);
    // 업데이트는 백그라운드(서버 구동을 막지 않음).
    checkAndInstallUpdate().catch((e) => log(`bg update error: ${e.message}`));
    await runServer(run.root);
    return;
  }

  // 로컬에 쓸 본체가 없음 → 첫 실행: 블로킹으로 받아서 실행.
  log("로컬 본체 없음 — 최초 다운로드 시도(블로킹).");
  const installed = await checkAndInstallUpdate();
  const root = installed && isUsableRoot(installed) ? installed : resolveRunRoot()?.root;
  if (!root) {
    log("치명적: 실행할 본체를 확보하지 못함(네트워크/번들 확인 필요).");
    process.exit(1);
  }
  await runServer(root);
}

main().catch((e) => {
  log(`fatal: ${e?.stack || e}`);
  process.exit(1);
});
