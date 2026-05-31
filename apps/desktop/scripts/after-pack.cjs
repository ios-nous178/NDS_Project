// electron-builder afterPack 훅 — node-pty spawn-helper 실행권한 복구.
//
// macOS 에서 node-pty 는 PTY 를 직접 fork 하지 않고 prebuild 에 동봉된 `spawn-helper`
// 바이너리를 posix_spawnp 로 띄운다. node-pty 1.1.0 prebuild 는 이 헬퍼를 0644(실행불가)
// 로 풀어 놓는 경우가 있고(특히 pnpm content store 추출 시 exec 비트 유실), npmRebuild:false
// 라 재빌드로 권한이 복구될 일도 없다 → 패키징 산출물에서 헬퍼가 0644 면 새 세션 spawn 시
// "posix_spawnp failed" 로 죽는다. 여기서 app.asar.unpacked 안의 모든 spawn-helper 에
// 0755 를 강제한다. (pty.node 도 함께 보정.)
const { chmodSync, existsSync, readdirSync, statSync } = require("node:fs");
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

exports.default = async function afterPack(context) {
  // macOS 외 플랫폼은 spawn-helper 가 없다(win32 은 conpty.dll 경유). no-op.
  if (context.electronPlatformName !== "darwin") return;

  const resources = join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
    "Contents",
    "Resources",
  );
  const unpacked = join(resources, "app.asar.unpacked", "node_modules", "node-pty");
  const targets = findAll(unpacked, ["spawn-helper", "pty.node"], []);

  if (targets.length === 0) {
    console.warn(`[after-pack] node-pty 네이티브 파일을 못 찾음: ${unpacked}`);
    return;
  }
  for (const file of targets) {
    chmodSync(file, 0o755);
    console.log(`[after-pack] chmod 755 ${file.replace(resources, "…/Resources")}`);
  }
};
