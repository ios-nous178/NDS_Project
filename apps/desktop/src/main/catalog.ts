import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  configureValidatorFromCatalog,
  type ValidatorCatalogInput,
} from "@nudge-design/mockup-core";

/**
 * catalog.json 해석 — validator 부트스트랩의 SSOT.
 *
 * 우선순위:
 *  1. NUDGE_DS_CATALOG 환경변수 (명시 경로)
 *  2. packaged 앱: process.resourcesPath/catalog.json (electron-builder extraResources)
 *  3. dev/모노레포: import.meta.dirname 에서 위로 올라가며 packages/mcp/catalog.json 탐색
 *
 * (Phase 0 노트대로 catalog 는 emit-manifest 산출물이며, 장기적으로 core 빌드가
 *  동봉/생성하도록 옮긴다. Phase 1 은 모노레포의 mcp catalog 를 그대로 읽는다.)
 */
function resolveCatalogPath(): string | null {
  const envPath = process.env.NUDGE_DS_CATALOG;
  if (envPath && existsSync(envPath)) return envPath;

  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  if (resourcesPath) {
    const packaged = join(resourcesPath, "catalog.json");
    if (existsSync(packaged)) return packaged;
  }

  // 모노레포 탐색: dirname 에서 위로 올라가며 packages/mcp/catalog.json.
  let dir = import.meta.dirname;
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(dir, "packages", "mcp", "catalog.json");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export interface LoadedCatalog extends ValidatorCatalogInput {
  path: string;
  generatedAt?: string;
}

/**
 * catalog 를 로드하고 HTML validator 를 부트스트랩한다.
 * 빈/누락 catalog 는 throw — validator 가 violation 0개로 조용히 통과하는 사고를
 * main 시작 시점에 하드 차단한다(계획서 최상위 리스크 #2).
 */
export function bootstrapValidator(): LoadedCatalog {
  const path = resolveCatalogPath();
  if (!path) {
    throw new Error(
      "[harness] catalog.json 을 찾지 못했습니다. 모노레포에서 'pnpm --filter @nudge-design/mcp build:manifest' 로 생성하거나 NUDGE_DS_CATALOG 로 경로를 지정하세요.",
    );
  }

  let parsed: Partial<ValidatorCatalogInput> & { generatedAt?: string };
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(`[harness] catalog.json 파싱 실패 (${path}): ${(err as Error).message}`);
  }

  const components = parsed.components ?? [];
  const tokens = parsed.tokens ?? [];
  if (components.length === 0 || tokens.length === 0) {
    throw new Error(
      `[harness] catalog.json 이 비어 있습니다 (components=${components.length}, tokens=${tokens.length}) — validator 가 무력화됩니다. ${path}`,
    );
  }

  const catalog: LoadedCatalog = {
    path,
    generatedAt: parsed.generatedAt,
    components,
    tokens,
    ndsHtmlTags: parsed.ndsHtmlTags,
    ndsHtmlElements: parsed.ndsHtmlElements,
  };

  configureValidatorFromCatalog(catalog);
  const mtime = statSync(path).mtime.toISOString();
  console.log(
    `[harness] validator 부트스트랩: ${path} (components=${components.length}, tokens=${tokens.length}, mtime=${mtime})`,
  );
  return catalog;
}
