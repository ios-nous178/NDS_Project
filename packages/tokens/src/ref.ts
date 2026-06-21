/**
 * Token reference helper — reference-carrying 토큰 모델 (P2, token-system-overhaul).
 *
 * 시멘틱/컴포넌트 토큰 트리의 leaf 가 primitive 를 "값으로 베끼지" 않고 "가리키게" 한다.
 * 기존엔 `coolGray[50]` 이 import 즉시 `"#F8F9FB"` 로 평가돼 alias 관계가 기계표현으로
 * 사라졌다(→ DTCG/Figma alias emit 불가). `ref("color.coolGray.50")` 는 그 경로를 보존한다.
 *
 * **typed-lie**: 런타임은 `{ $ref: "color.coolGray.50" }` 객체이지만 타입상으로는 `string` 으로
 * 노출한다. 그래야 기존 `SemanticColors`(leaf=string) 타입을 한 줄도 안 바꾸고 토큰 트리에
 * 섞을 수 있다. 이 트리는 **빌드 emitter 전용**이라(외부가 값으로 직접 읽지 않음 — 각 파일
 * 헤더 주석 참조) 안전하다. emitter 는 `isRef()` 로 분기한다:
 *   - 기존 CSS(generate-css.cjs): ref → 해석된 hex (값 동결 — dist/tokens.css 바이트 동일)
 *   - 신규(generate-next.cjs): ref → `var(--color-…)` / DTCG `{color.…}` / Figma variable alias
 */

export interface TokenRef {
  readonly $ref: string;
}

/**
 * primitive 참조 경로. color 티어 + dimension(spacing) 티어.
 * 시멘틱 dimension(gap/inset/gap-title)이 spacing primitive 를 가리킨다 — 예: `spacing.10`.
 */
export type RefPath = `color.${string}` | `spacing.${string}`;

/**
 * 토큰 참조를 만든다. 런타임 객체이지만 타입은 `string`(typed-lie, 상단 주석 참조).
 * emitter-전용 토큰 트리(`*.semantic.ts` 등)의 leaf 에서만 사용한다.
 */
export function ref(path: RefPath): string {
  return { $ref: path } as unknown as string;
}

/** emitter 가 leaf 가 토큰 참조인지 판별. (값으로 박힌 hex/rgba/`var(...)` 문자열과 구분) */
export function isRef(value: unknown): value is TokenRef {
  return typeof value === "object" && value !== null && "$ref" in (value as object);
}
