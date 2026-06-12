/**
 * guideMeta — MCP 컴포넌트 가이드(SSOT)에서 DesignGuideBadge 용 GuideMeta 파생.
 *
 * 과거에는 packages/react 의 Badge.guide.ts / Chip.guide.ts 가 variant 별
 * {status, figmaNode} 를 수기로 들고 있었지만, 전 항목이 동일한 core 메타라
 * 정보량이 가이드 frontmatter 의 figmaNodeUrl 과 같았다(이중 SSOT).
 * 이제 metadata/componentGuides.json(guides-src 산출물)에서 노드를 읽는다.
 */

import type { GuideMeta } from "@nudge-design/tokens";
import componentGuides from "../../../../metadata/componentGuides.json";

const guides =
  (componentGuides as { components?: Record<string, { figmaNodeUrl?: string }> }).components ?? {};

/** 컴포넌트의 figmaNodeUrl 에서 "171:10856" 형태 노드 ID 추출. */
function figmaNodeOf(component: string): string | undefined {
  const url = guides[component]?.figmaNodeUrl;
  const m = url?.match(/node-id=(\d+)-(\d+)/);
  return m ? `${m[1]}:${m[2]}` : undefined;
}

/** Figma 가이드에 정식 등재된(core) 컴포넌트의 DesignGuideBadge 메타. */
export function coreGuideMeta(component: string): GuideMeta {
  return { status: "core", figmaNode: figmaNodeOf(component) };
}
