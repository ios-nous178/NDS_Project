// postinstall — node-pty prebuild 의 spawn-helper 실행권한 보정.
//
// macOS 에서 node-pty 는 spawn-helper 바이너리를 posix_spawnp 로 띄운다. pnpm content
// store 에서 풀릴 때 exec 비트가 유실돼 0644 로 깔리면 dev(`pnpm dev`) · 패키징 양쪽에서
// PTY spawn 이 "posix_spawnp failed" 로 죽는다. install 직후 0755 로 복구한다.
// (패키징 산출물은 별도로 electron-builder afterPack 훅이 한 번 더 보정한다.)
const { chmodSync, existsSync, readdirSync, statSync } = require("node:fs");
const { join, dirname } = require("node:path");

function ptyRoot() {
  try {
    // node-pty 의 심볼릭 링크/실제 경로 모두에서 prebuilds 디렉터리를 찾는다.
    return dirname(dirname(require.resolve("node-pty")));
  } catch {
    return join(__dirname, "..", "node_modules", "node-pty");
  }
}

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

const root = ptyRoot();
const targets = findAll(join(root, "prebuilds"), ["spawn-helper", "pty.node"], []);
for (const file of targets) {
  try {
    chmodSync(file, 0o755);
  } catch (err) {
    console.warn(`[fix-pty-perms] chmod 실패: ${file} — ${err.message}`);
  }
}
if (targets.length)
  console.log(`[fix-pty-perms] chmod 755 × ${targets.length} (node-pty prebuilds)`);
