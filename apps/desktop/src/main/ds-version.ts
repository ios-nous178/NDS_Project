import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 하네스가 박는 DS 스탬프용 "DS 버전" 해석.
 *
 * 번들러리스 목업 폴더(node_modules 없음)에선 detectDsVersions 가 비므로, 앱이 동봉한
 * @nudge-design/react 패키지 버전을 진리로 쓴다 — 이게 곧 inline 되는 DS runtime/CSS 의 버전이다.
 * assets/icons 는 동봉 MCP manifest 의 asset_version/icon_version 을 쓴다.
 * 1회 resolve 후 캐시. 못 찾으면 null(스탬프는 "—" 로 폴백).
 */
export interface BundledDsVersions {
  dsVersion: string | null;
  assetVersion: string | null;
  iconVersion: string | null;
}

let cached: BundledDsVersions | undefined;

export function resolveBundledDsVersion(): string | null {
  return resolveBundledDsVersions().dsVersion;
}

export function resolveBundledDsVersions(): BundledDsVersions {
  if (cached !== undefined) return cached;
  const manifest = readBundledManifestVersions();
  // 1차: @nudge-design/react 를 resolve (dev/모노레포 — node_modules 심링크가 있을 때).
  try {
    const req = createRequire(import.meta.url);
    // ⚠️ @nudge-design/react 의 exports 맵은 ./package.json 서브패스를 열지 않는다 →
    //    req.resolve("@nudge-design/react/package.json") 는 ERR_PACKAGE_PATH_NOT_EXPORTED 로 던진다.
    //    대신 exports 가 허용하는 엔트리(".")를 resolve 한 뒤 상위 디렉토리를 거슬러 올라가며
    //    이름이 일치하는 package.json 을 찾는다(exports 게이트 우회).
    const entry = req.resolve("@nudge-design/react");
    const v = readVersionFromAncestors(dirname(entry));
    if (v) {
      cached = {
        dsVersion: v,
        assetVersion: manifest?.assetVersion ?? null,
        iconVersion: manifest?.iconVersion ?? null,
      };
      return cached;
    }
  } catch {
    // packaged 앱에선 @nudge-design/react 가 devDependency 라 asar 에 없고, main 프로세스도
    // 번들돼 있어 resolve 가 던진다 → 아래 번들 manifest 폴백으로 넘어간다.
  }
  // 2차: 동봉된 MCP 번들 manifest.json 의 version (CLAUDE.md SSOT — DS 최대 버전의 미러).
  //      packaged 앱에서 확실히 동봉되는 경로이며, 이게 곧 inline 되는 runtime/CSS 의 버전이다.
  cached = {
    dsVersion: manifest?.dsVersion ?? null,
    assetVersion: manifest?.assetVersion ?? null,
    iconVersion: manifest?.iconVersion ?? null,
  };
  return cached;
}

/** 동봉 MCP 번들의 manifest.json version 을 packaged / dev 후보 경로에서 찾는다. */
function readBundledManifestVersions(): BundledDsVersions | null {
  const candidates: string[] = [];
  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  // packaged: extraResources 로 resources/mcp/ 에 동봉된 번들 manifest.
  if (resourcesPath) candidates.push(join(resourcesPath, "mcp", "dist", "manifest.json"));
  // dev: __dirname 에서 위로 올라가며 데스크탑 .mcp-bundle / 모노레포 mcp manifest 탐색.
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    candidates.push(join(dir, "apps", "desktop", ".mcp-bundle", "dist", "manifest.json"));
    candidates.push(join(dir, "packages", "mcp", "manifest.json"));
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const m = JSON.parse(readFileSync(p, "utf8")) as {
        version?: string;
        asset_version?: string;
        icon_version?: string;
      };
      if (m.version || m.asset_version || m.icon_version) {
        return {
          dsVersion: m.version ?? null,
          assetVersion: m.asset_version ?? null,
          iconVersion: m.icon_version ?? null,
        };
      }
    } catch {
      // 손상된 manifest 는 무시하고 다음 후보로.
    }
  }
  return null;
}

/** entry 디렉토리부터 위로 올라가며 name === "@nudge-design/react" 인 package.json 의 version 을 찾는다. */
function readVersionFromAncestors(startDir: string): string | null {
  const root = parse(startDir).root;
  let dir = startDir;
  while (true) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
          name?: string;
          version?: string;
        };
        if (pkg.name === "@nudge-design/react") return pkg.version ?? null;
      } catch {
        // 손상된 package.json 은 무시하고 계속 거슬러 올라간다.
      }
    }
    if (dir === root) return null;
    dir = dirname(dir);
  }
}
