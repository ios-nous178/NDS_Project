import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";

/**
 * 하네스가 박는 DS 스탬프용 "DS 버전" 해석.
 *
 * 번들러리스 목업 폴더(node_modules 없음)에선 detectDsVersions 가 비므로, 앱이 동봉한
 * @nudge-design/react 패키지 버전을 진리로 쓴다 — 이게 곧 inline 되는 DS runtime/CSS 의 버전이다.
 * 1회 resolve 후 캐시. 못 찾으면 null(스탬프는 "—" 로 폴백).
 */
let cached: string | null | undefined;

export function resolveBundledDsVersion(): string | null {
  if (cached !== undefined) return cached;
  try {
    const req = createRequire(import.meta.url);
    // ⚠️ @nudge-design/react 의 exports 맵은 ./package.json 서브패스를 열지 않는다 →
    //    req.resolve("@nudge-design/react/package.json") 는 ERR_PACKAGE_PATH_NOT_EXPORTED 로 던진다.
    //    대신 exports 가 허용하는 엔트리(".")를 resolve 한 뒤 상위 디렉토리를 거슬러 올라가며
    //    이름이 일치하는 package.json 을 찾는다(exports 게이트 우회).
    const entry = req.resolve("@nudge-design/react");
    cached = readVersionFromAncestors(dirname(entry)) ?? null;
  } catch {
    cached = null;
  }
  return cached;
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
