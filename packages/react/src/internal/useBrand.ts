import { useEffect, useState } from "react";

/**
 * `<html data-brand="...">` 값을 reactive 하게 읽는 hook.
 *
 * 브랜드 토큰은 CSS cascade(`[data-brand="cashpobi"] { ... }`) 로 적용되지만,
 * 아이콘 컴포넌트 swap 처럼 React render 분기가 필요한 경우 이 hook 을 쓴다.
 *
 * SSR 환경에서는 첫 render 시 `null` (서버는 `document` 없음) → mount 이후 update.
 * 브랜드 attribute 변경(storybook global switch 등)은 MutationObserver 로 추적.
 *
 * 일반 컴포넌트는 가능하면 CSS 변수로 끝내고, 정말 marker glyph 가 다른
 * 경우에만 이걸 사용한다 — runtime 분기는 SSR/test 환경에서 hydration 비용이 있음.
 */
export function useBrand(): string | null {
  const [brand, setBrand] = useState<string | null>(() => {
    if (typeof document === "undefined") return null;
    return document.documentElement.getAttribute("data-brand");
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // 마운트 시점에 attribute 가 바뀌어 있었을 수도 있어 한번 재동기화.
    setBrand(root.getAttribute("data-brand"));

    const observer = new MutationObserver(() => {
      setBrand(root.getAttribute("data-brand"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-brand"] });
    return () => observer.disconnect();
  }, []);

  return brand;
}
