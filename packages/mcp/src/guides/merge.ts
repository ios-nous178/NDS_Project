import type { ServiceOverlay } from "./services/types.js";

/**
 * Service overlay 머지 함수.
 *
 * 머지 시맨틱 (Figma 450:68 v2 frame SSOT):
 * | 필드                | 정책                                            |
 * | ------------------- | ----------------------------------------------- |
 * | allowedVariants     | service 가 있으면 base 를 전체 교체 (좁히기)    |
 * | disallowedVariants  | base 와 concat-dedupe                           |
 * | preferredPatterns   | concat-dedupe                                   |
 * | forbiddenPatterns   | concat-dedupe                                   |
 * | servicePitfalls     | base.pitfalls 와는 별개 array (둘 다 응답에)    |
 * | iconSet             | base.iconSet 와 shallow merge by key            |
 * | copyTone            | 깊이 1 객체 머지 (overlay 키만 덮어쓰기)        |
 *
 * base 와 overlay 의 다른 키는 base 그대로.
 */

function concatDedupe<T>(...arrays: (T[] | undefined)[]): T[] | undefined {
  const out: T[] = [];
  for (const arr of arrays) {
    if (!arr) continue;
    for (const item of arr) {
      if (!out.includes(item)) out.push(item);
    }
  }
  return out.length > 0 ? out : undefined;
}

export function mergeServiceOverlay(
  base: Record<string, unknown>,
  overlay: ServiceOverlay | undefined,
): Record<string, unknown> {
  if (!overlay) return base;

  const merged: Record<string, unknown> = { ...base };

  if (overlay.allowedVariants) {
    merged.allowedVariants = overlay.allowedVariants;
  }
  if (overlay.disallowedVariants) {
    const baseList = Array.isArray(base.disallowedVariants)
      ? (base.disallowedVariants as string[])
      : undefined;
    merged.disallowedVariants = concatDedupe(baseList, overlay.disallowedVariants);
  }
  if (overlay.preferredPatterns) {
    const baseList = Array.isArray(base.preferredPatterns)
      ? (base.preferredPatterns as string[])
      : undefined;
    merged.preferredPatterns = concatDedupe(baseList, overlay.preferredPatterns);
  }
  if (overlay.forbiddenPatterns) {
    const baseList = Array.isArray(base.forbiddenPatterns)
      ? (base.forbiddenPatterns as string[])
      : undefined;
    merged.forbiddenPatterns = concatDedupe(baseList, overlay.forbiddenPatterns);
  }
  if (overlay.servicePitfalls) {
    merged.servicePitfalls = overlay.servicePitfalls;
  }
  if (overlay.iconSet) {
    const baseIcons = (base.iconSet as Record<string, string[]> | undefined) ?? {};
    merged.iconSet = { ...baseIcons, ...overlay.iconSet };
  }
  if (overlay.copyTone) {
    const baseCopy = (base.copyTone as Record<string, unknown> | undefined) ?? {};
    merged.copyTone = { ...baseCopy, ...overlay.copyTone };
  }

  return merged;
}
