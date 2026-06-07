/**
 * 컴포넌트 액션(버튼) 배치 variant + 브랜드별 기본값 해석기 — "하네스".
 *
 * Modal/Popup 등 푸터 버튼 배치는 색/모양(토큰)과 분리된 **구조 variant** 다:
 *   · "split" — 가로 균등 분할(2버튼 50/50, 1버튼 full). NudgeEAP/Geniet/Trost/Runmile 기본.
 *   · "end"   — 우측 정렬 hug(1버튼 120 고정, 2버튼 우측 hug). 캐포비 admin 기본.
 *
 * 컴포넌트는 `actionsLayout` prop 으로 직접 받을 수 있고, 생략하면 현재 브랜드의
 * 기본값이 강제 적용된다(override 가능). CSS 는 `data-layout` 으로 키잉해 브랜드와
 * 무관하게 재사용된다(색/pill 모양은 여전히 브랜드 토큰/cascade).
 *
 * **SSOT 통합(v4.4 Harness)**: 브랜드 기본 배치는 더 이상 여기서 별도 맵으로 들고
 * 있지 않고 각 `BrandTheme.actionsLayout` (tokens/src/brands/*.ts) 에 산다 —
 * 색/spacing/component 오버라이드와 같은 브랜드 정의 한 곳. `BRAND_ACTIONS_LAYOUT`
 * 은 그 테마들에서 **파생**된 조회 맵일 뿐이라 드리프트가 구조적으로 불가능하다.
 *
 * **하드 게이트**: 새 브랜드를 추가하면 그 테마에 `actionsLayout` 을 선언해야 한다 —
 * `pnpm lint:actions-layout` 가 tokens/src/brands/*.ts 를 검사해 누락 시 빌드를 막는다.
 * react(useBrand)·html(data-brand) 양쪽이 이 한 곳을 읽는다.
 */
import { nudgeEapTheme, trostTheme, genietTheme, cashwalkBizTheme, runmileTheme } from "./brands";

export type ActionsLayout = "split" | "end";

export const DEFAULT_ACTIONS_LAYOUT: ActionsLayout = "split";

/**
 * brand slug → 기본 버튼 배치. 각 `BrandTheme.actionsLayout` 에서 파생 —
 * 키는 `theme.name` (= `tokens/src/brands/*.ts` 의 slug) 와 1:1.
 * 테마에 미선언 시 `DEFAULT_ACTIONS_LAYOUT` fallback (게이트가 누락을 별도로 막음).
 */
export const BRAND_ACTIONS_LAYOUT: Record<string, ActionsLayout> = Object.fromEntries(
  [nudgeEapTheme, trostTheme, genietTheme, cashwalkBizTheme, runmileTheme].map((theme) => [
    theme.name,
    theme.actionsLayout ?? DEFAULT_ACTIONS_LAYOUT,
  ]),
);

/** explicit prop 우선 → 없으면 브랜드 기본 → 없으면 split. */
export function resolveActionsLayout(
  brand: string | null | undefined,
  explicit?: ActionsLayout,
): ActionsLayout {
  if (explicit) return explicit;
  if (brand && brand in BRAND_ACTIONS_LAYOUT) return BRAND_ACTIONS_LAYOUT[brand];
  return DEFAULT_ACTIONS_LAYOUT;
}
