/**
 * icon-svg.ts — find_icon({ name }) 가 돌려줄 inline SVG 를 lazy 로드한다.
 *
 * 왜 lazy + sidecar 인가:
 *  - 아이콘 SVG 본문 전체(~1.5MB, 2055개)를 catalog.json / server 번들에 박으면 모든 .mcpb
 *    다운로드와 데스크톱 번들이 그만큼 무거워진다. 그래서 standalone-assets.ts 와 동일하게
 *    "필요할 때(=find_icon({name})) 한 번 로드 후 캐시" 전략을 쓴다.
 *  - 데이터 출처는 `@nudge-design/icons` 빌드가 떨구는 `dist/vanilla.js`
 *    (`vanillaIconDefinitions: { [name]: { viewBox, body } }`) — 새 빌드 단계 없음.
 *
 * resolver(standalone-assets 와 동형):
 *  ① NUDGE_DS_ICONS_VANILLA (desktop packaged 가 sidecar 경로를 명시)
 *  ② require.resolve("@nudge-design/icons/vanilla")  (dev 모노레포 · mcpb node_modules)
 *  ③ __dirname 상대 sidecar 후보(server.mjs 옆) — bundle-mcp-desktop 이 복사한 위치
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

interface IconDefinition {
  viewBox: string;
  body: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * vanilla.js 를 import() 할 수 있는 URL 해석. 못 찾으면 시도 전략을 모두 적은 에러를 throw.
 * ⚠️ require.resolve 는 못 쓴다 — @nudge-design/icons 의 "./vanilla" export 가 `import` 조건만
 *    있어 CJS resolver(require)로는 매칭이 안 된다. ESM resolver(import.meta.resolve)를 쓴다.
 */
function resolveVanillaUrl(): string {
  const tried: string[] = [];

  const envPath = process.env.NUDGE_DS_ICONS_VANILLA;
  if (envPath) {
    tried.push(`env NUDGE_DS_ICONS_VANILLA=${envPath}`);
    if (fs.existsSync(envPath)) return pathToFileURL(envPath).href;
  }

  // ESM resolver — "import" 조건 매칭(dev 모노레포 · mcpb node_modules).
  const metaResolve = (import.meta as { resolve?: (spec: string) => string }).resolve;
  if (metaResolve) {
    try {
      const url = metaResolve("@nudge-design/icons/vanilla");
      tried.push(`import.meta.resolve → ${url}`);
      if (fs.existsSync(fileURLToPath(url))) return url;
    } catch (err) {
      tried.push(`import.meta.resolve 실패: ${(err as Error).message}`);
    }
  }

  // server.mjs 가 dist/tools/server.mjs → ../icons/vanilla.js = dist/icons/vanilla.js.
  // dev(dist/icon-svg.js)에선 ../../icons/dist/vanilla.js 가 워크스페이스 실경로.
  for (const rel of ["../icons/vanilla.js", "icons/vanilla.js", "../../icons/dist/vanilla.js"]) {
    const candidate = path.resolve(here, rel);
    tried.push(`__dirname/${rel} → ${candidate}`);
    if (fs.existsSync(candidate)) return pathToFileURL(candidate).href;
  }

  throw new Error(
    "아이콘 vanilla 정의(@nudge-design/icons/vanilla)를 찾지 못했습니다. " +
      "`pnpm build --filter @nudge-design/icons` 로 생성하거나, 번들에 sidecar 로 복사됐는지 확인하세요.\n" +
      `시도한 경로:\n  - ${tried.join("\n  - ")}`,
  );
}

let defsPromise: Promise<Record<string, IconDefinition>> | null = null;

async function loadDefinitions(): Promise<Record<string, IconDefinition>> {
  if (!defsPromise) {
    defsPromise = (async () => {
      const mod = (await import(resolveVanillaUrl())) as {
        vanillaIconDefinitions: Record<string, IconDefinition>;
      };
      return mod.vanillaIconDefinitions;
    })().catch((err) => {
      // 다음 호출에서 재시도할 수 있게 캐시를 비운다.
      defsPromise = null;
      throw err;
    });
  }
  return defsPromise;
}

export interface IconSvgResult {
  viewBox: string;
  /** 붙여 넣을 수 있는 완성형 인라인 SVG (DS 컴포넌트 템플릿과 동일 래퍼). */
  svg: string;
  /** <svg> 내부 본문만 — 직접 래핑하고 싶을 때. */
  body: string;
}

/** DS 아이콘 컴포넌트(generate.js)와 동일한 래퍼로 inline SVG 문자열을 만든다. */
function renderSvg(def: IconDefinition, size: number): string {
  return (
    `<svg width="${size}" height="${size}" viewBox="${def.viewBox}" fill="none" ` +
    `xmlns="http://www.w3.org/2000/svg" color="currentColor" aria-hidden="true" focusable="false">` +
    `${def.body}</svg>`
  );
}

/**
 * 아이콘 이름(catalog 의 PascalCase + "Icon")으로 inline SVG 를 반환. 없으면 null.
 * @param size width/height(px). nds-icon-button 안에선 CSS 가 덮으므로 기본 24 로 충분.
 */
export async function getIconSvg(name: string, size = 24): Promise<IconSvgResult | null> {
  const defs = await loadDefinitions();
  const def = defs[name];
  if (!def) return null;
  return { viewBox: def.viewBox, body: def.body, svg: renderSvg(def, size) };
}
