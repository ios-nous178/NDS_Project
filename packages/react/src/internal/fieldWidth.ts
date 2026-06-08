import { sizing } from "@nudge-design/tokens";

/**
 * 입력 필드 가로 너비 6단계 스케일 (Figma InputGuide Field Width 3897:1578).
 * 모든 입력 필드(TextInput·Dropdown·DateInput·Selection 등)가 공유하는 단일 SSOT.
 * `full` 은 컨테이너 100% (Textarea·반응형 폼).
 */
export type FieldWidth = "xs" | "sm" | "md" | "lg" | "xl" | "full";

/**
 * `fieldWidth` 토큰 → CSS width 값(px 문자열 또는 "100%").
 * 미지정이면 undefined — 컴포넌트 기본 너비(fullWidth 등)를 그대로 둔다.
 */
export function resolveFieldWidth(fieldWidth: FieldWidth | undefined): string | undefined {
  if (!fieldWidth) return undefined;
  if (fieldWidth === "full") return "100%";
  return `${sizing.fieldWidth[fieldWidth]}px`;
}
