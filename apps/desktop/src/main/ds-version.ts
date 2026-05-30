import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

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
    const pkgPath = req.resolve("@nudge-design/react/package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
    cached = pkg.version ?? null;
  } catch {
    cached = null;
  }
  return cached;
}
