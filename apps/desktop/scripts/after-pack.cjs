// electron-builder afterPack 훅 — node-pty spawn-helper 실행권한 복구.
//
// macOS 에서 node-pty 는 PTY 를 직접 fork 하지 않고 prebuild 에 동봉된 `spawn-helper`
// 바이너리를 posix_spawnp 로 띄운다. node-pty 1.1.0 prebuild 는 이 헬퍼를 0644(실행불가)
// 로 풀어 놓는 경우가 있고(특히 pnpm content store 추출 시 exec 비트 유실), npmRebuild:false
// 라 재빌드로 권한이 복구될 일도 없다 → 패키징 산출물에서 헬퍼가 0644 면 새 세션 spawn 시
// "posix_spawnp failed" 로 죽는다. 여기서 app.asar.unpacked 안의 모든 spawn-helper 에
// 0755 를 강제한다. (pty.node 도 함께 보정.)
const { chmodSync, existsSync, readdirSync, statSync, rmSync } = require("node:fs");
const { join } = require("node:path");

/** dir 하위에서 파일명이 names 에 들어가는 경로를 모두 모은다. */
function findAll(dir, names, out) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) findAll(full, names, out);
    else if (names.includes(entry)) out.push(full);
  }
  return out;
}

/** context.arch(Arch enum 숫자) → "arm64" | "x64" | "universal" 등 디렉토리명. */
function archName(context) {
  try {
    return require("electron-builder").Arch[context.arch];
  } catch {
    // 폴백: electron-builder Arch enum 값(ia32=0,x64=1,armv7l=2,arm64=3,universal=4).
    return { 0: "ia32", 1: "x64", 2: "armv7l", 3: "arm64", 4: "universal" }[context.arch];
  }
}

exports.default = async function afterPack(context) {
  // macOS 외 플랫폼은 spawn-helper 가 없다(win32 은 conpty.dll 경유). no-op.
  if (context.electronPlatformName !== "darwin") return;

  const resources = join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
    "Contents",
    "Resources",
  );

  // per-arch 빌드면(arm64 또는 x64) 다른 arch 의 동봉 claude 바이너리를 잘라낸다 — extraResources 는
  // .claude-bundle 전체(arm64+x64)를 복사하므로, 이 빌드 arch 것만 남겨 dmg 용량을 절반으로 줄인다.
  // universal 빌드는 둘 다 유지(런타임에 process.arch 로 선택).
  const arch = archName(context);
  const claudeRoot = join(resources, "claude");
  if (existsSync(claudeRoot) && arch && arch !== "universal") {
    const keep = `darwin-${arch}`;
    for (const entry of readdirSync(claudeRoot)) {
      const full = join(claudeRoot, entry);
      if (entry !== keep && entry !== "version.json" && statSync(full).isDirectory()) {
        rmSync(full, { recursive: true, force: true });
        console.log(`[after-pack] claude ${entry} 제거 (이 빌드 arch=${arch})`);
      }
    }
  }

  const unpacked = join(resources, "app.asar.unpacked", "node_modules", "node-pty");
  const targets = findAll(unpacked, ["spawn-helper", "pty.node"], []);

  if (targets.length === 0) {
    console.warn(`[after-pack] node-pty 네이티브 파일을 못 찾음: ${unpacked}`);
  }
  // 앱 동봉 claude 네이티브 바이너리(resources/claude/{arch}/claude)도 실행권한 보정 —
  // extraResources 복사 과정에서 exec 비트가 유실되면 PTY spawn 시 EACCES 로 죽는다.
  for (const file of findAll(claudeRoot, ["claude"], [])) targets.push(file);

  for (const file of targets) {
    chmodSync(file, 0o755);
    console.log(`[after-pack] chmod 755 ${file.replace(resources, "…/Resources")}`);
  }
};
