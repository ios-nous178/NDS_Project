/**
 * html 컴포넌트용 브랜드 해석 유틸 — React 의 useBrand 미러.
 *
 * 브랜드는 `[data-brand]` cascade 로 적용되지만(색/토큰), 버튼 배치(actionsLayout)처럼
 * 런타임 분기가 필요한 값은 이 유틸로 현재 브랜드를 읽어 SSOT(@nudge-design/tokens 의
 * resolveActionsLayout)로 기본을 강제한다. 브랜드 토글(스토리북 등)에 반응하도록
 * observeBrand 로 documentElement 의 data-brand 변경을 구독한다.
 */
import { resolveActionsLayout, type ActionsLayout } from "@nudge-design/tokens";

/** 가장 가까운 [data-brand] 조상 → 없으면 documentElement. */
export function readBrand(el: Element): string | null {
  const nearest = el.closest<HTMLElement>("[data-brand]");
  if (nearest) return nearest.getAttribute("data-brand");
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-brand");
  }
  return null;
}

/** actions-layout attribute(있으면) → 없으면 브랜드 기본. */
export function resolveLayoutFor(el: Element, explicit: string | null): ActionsLayout {
  const ex = explicit === "split" || explicit === "end" ? explicit : undefined;
  return resolveActionsLayout(readBrand(el), ex);
}

/** documentElement 의 data-brand 변경 구독 → cb. 반환 함수로 해제. */
export function observeBrand(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-brand"],
  });
  return () => observer.disconnect();
}
