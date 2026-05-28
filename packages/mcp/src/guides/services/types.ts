/**
 * Service overlay 공통 타입.
 *
 * Figma SSOT (450:68 v2 frame) 의 7필드 + copyTone 객체.
 * 모든 필드 optional — 대부분 overlay 는 비어 있어야 정상 (Pattern 'Overlay 0').
 *
 * 머지 시맨틱은 ./merge.ts 참조.
 */
export interface ServiceOverlay {
  /** service 가 있으면 base 의 allowedVariants 를 전체 교체 (좁히기 의미) */
  allowedVariants?: string[];
  /** base.disallowedVariants 와 concat-dedupe */
  disallowedVariants?: string[];
  /** base.pitfalls 와 별개 array — 응답에 둘 다 노출 */
  servicePitfalls?: string[];
  /** key=용도, value=권장 아이콘 이름 배열. base.iconSet 와 shallow merge by key */
  iconSet?: Record<string, string[]>;
  /** concat-dedupe */
  preferredPatterns?: string[];
  /** concat-dedupe */
  forbiddenPatterns?: string[];
  /** 미래 자리. UX_WRITING_GUIDE 가 갈라지는 시점에 사용. base 와 deep merge. */
  copyTone?: {
    voiceToneAddendum?: string;
    eapDomain?: string[];
    principles?: Array<{ name: string; summary: string; do: string[]; dont: string[] }>;
    microcopy?: Array<{ context: string; rule: string; example?: string }>;
  };
}
