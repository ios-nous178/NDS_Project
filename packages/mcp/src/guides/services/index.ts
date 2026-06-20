import type { ServiceOverlay } from "./types.js";
import { genietOverlays } from "./geniet/index.js";
import { cashwalkBizOverlays } from "./cashwalk-biz/index.js";
import { nudgeEapOverlays } from "./nudge-eap/index.js";

export type ProjectSlug = "trost" | "geniet" | "cashwalk-biz" | "nudge-eap";

/**
 * Service overlay registry. project 별 (topic → ServiceOverlay) map.
 *
 * Trost 는 현재 evidence 0 이라 빈 객체. Pattern 'Overlay 0' 케이스 그대로 둠.
 * (overlay 가 두꺼우면 base 가 약하다는 신호 — 빈 게 정상.)
 */
export const SERVICE_OVERLAYS: Record<ProjectSlug, Record<string, ServiceOverlay>> = {
  geniet: genietOverlays,
  "cashwalk-biz": cashwalkBizOverlays,
  "nudge-eap": nudgeEapOverlays,
  trost: {},
};

/** project 별로 어떤 topic 의 overlay 가 존재하는지 슬림 요약 (project 미지정 호출 시 응답에 첨부). */
export function listProjectVariants(topic: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [project, overlays] of Object.entries(SERVICE_OVERLAYS)) {
    const overlay = overlays[topic];
    if (overlay) {
      result[project] = Object.keys(overlay).filter(
        (k) => (overlay as Record<string, unknown>)[k] !== undefined,
      );
    }
  }
  return result;
}

export { type ServiceOverlay };
