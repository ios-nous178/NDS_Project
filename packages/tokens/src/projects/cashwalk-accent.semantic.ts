/**
 * Cashwalk accent 형제(동네산책·팀워크) Semantic 빌더.
 *
 * 동네산책/팀워크는 cashwalk(캐시워크) 의 **형제 브랜드** — 구조·status·neutral CTA·input focus 는
 * cashwalk 를 그대로 상속하고, **brand 색 슬롯만** accent family(cornflower=팀워크 · indigo=동네산책)
 * 로 스왑한다. 디자이너 결정(2026-06-21): "브랜드 색 전면 스왑".
 *
 * 스왑 대상(yellow → accent):
 *   bg/brand · text/brand · text/link · border/focus · border/brand · icon/brand ·
 *   buttonBg(Primary default/hover/pressed + outlined/hover) · buttonText/default(흰) · fill/brand
 * cashwalk 유지(스왑 안 함):
 *   status(error/success/caution/info=노랑) · Neutral CTA(검정) · confirmCta(검정) · input focus(검정)
 *
 * 파일명을 `*.semantic.ts` 로 둔 이유: `check-actions-layout` 게이트가 projects/ 의 비-semantic/palette
 * `.ts` 를 프로젝트로 보고 actionsLayout 리터럴을 요구하므로, 헬퍼는 그 스캔에서 제외시킨다.
 */

import { ref, isRef } from "../ref.js";
import { cashwalkSemantic } from "./cashwalk.semantic.js";
import type { SemanticColors } from "./types.js";

type AccentFamily = "cornflower" | "indigo";

function isLeaf(v: unknown): boolean {
  return v == null || typeof v === "string" || isRef(v);
}

/** ref/문자열을 leaf 로 보는 deep merge — base 를 변형하지 않고 새 트리를 만든다(generate-next 와 동일 규칙). */
function mergeDeep(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (isLeaf(over)) return over;
  const src = isLeaf(base) || base == null ? {} : (base as Record<string, unknown>);
  const out: Record<string, unknown> = { ...src };
  for (const k of Object.keys(over as Record<string, unknown>)) {
    out[k] = mergeDeep(src[k], (over as Record<string, unknown>)[k]);
  }
  return out;
}

/**
 * cashwalkSemantic 위에 accent brand 색만 덮은 시멘틱 트리를 만든다.
 * generate-css/next 가 base(nudge-eap) 위에 cascade/merge 하므로, cashwalk override 전체 +
 * accent 스왑을 한 벌로 담아야 한다(cashwalk.css 는 형제 브랜드에 로드되지 않음).
 */
export function cashwalkAccentSemantic(accent: AccentFamily): SemanticColors {
  const a = (stop: string) => ref(`color.${accent}.${stop}`);
  const override: SemanticColors = {
    bg: { brand: { default: a("500"), subtle: a("100") } },
    text: {
      brand: { default: a("800"), strong: a("800") },
      link: { default: a("500") },
    },
    border: {
      focus: { default: a("500") },
      brand: { default: a("500") },
    },
    icon: { brand: { default: a("700") } },
    buttonBg: {
      default: a("500"),
      hover: a("600"),
      pressed: a("700"),
      outlined: { hover: a("50") },
    },
    buttonText: { default: ref("color.common.00") }, // accent fill 위 흰 텍스트(노랑 위 검정에서 전환)
    fill: { brand: { default: a("500"), hover: a("600"), pressed: a("700") } },
  };
  return mergeDeep(cashwalkSemantic, override) as SemanticColors;
}
