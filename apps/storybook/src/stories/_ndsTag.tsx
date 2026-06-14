import React, { useEffect, useRef } from "react";
import { brandThemes } from "../brand-themes";

/**
 * BrandScope — 한 스토리에 여러 브랜드를 동시에 렌더할 때 **각 브랜드의 색을 그 브랜드
 * 엘리먼트에만** 스코프한다.
 *
 * 왜 필요한가: preview.ts 의 brand decorator 는 **전역 선택 브랜드 1개**의 cssVars(`--semantic-*`)
 * 만 스토리 래퍼에 깐다. 그래서 `<nds-brand-header brand="trost">` 처럼 brand 속성으로 5브랜드를
 * 한 화면에 그리면, 구조/로고는 브랜드별이지만 색(var(--semantic-*))은 전부 전역 브랜드(기본
 * nudge-eap) 값을 상속해 "전부 EAP 색"이 된다. 각 엘리먼트를 자기 브랜드의 cssVars + data-brand
 * 로 감싸 그 서브트리만 브랜드 토큰을 덮어쓴다(custom property 상속 → 안쪽이 이김).
 * 단일 브랜드 스토리(Sidebar=cashwalk-biz)도 toolbar 선택과 무관하게 자기 색을 고정한다.
 */
export function BrandScope({
  brand,
  children,
  style,
  className,
}: {
  brand: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const vars = brandThemes[brand]?.cssVars ?? {};
  return React.createElement(
    "div",
    {
      "data-brand": brand,
      className,
      // display:contents → 레이아웃 영향 없이 custom property 만 이 서브트리에 상속.
      style: { display: "contents", ...vars, ...style } as React.CSSProperties,
    },
    children,
  );
}

/**
 * NdsTag — Storybook 에서 목업 전용 html 웹컴포넌트(`nds-brand-*`, `nds-sidebar` 등)를
 * React 스토리로 렌더하는 헬퍼.
 *
 * 왜 필요한가: 브랜드 chrome·사이드바는 공개 react 패키지에서 제거돼 목업 전용 html
 * 웹컴포넌트가 SSOT 다. 이걸 Storybook(React) 에서 보이게 하려면
 *   1) custom element 등록 — `.storybook/preview.ts` 의 `import "@nudge-design/html/runtime"`.
 *   2) 데이터 주입 — custom element 는 attribute 로 받으므로 ref 로 명령형 set.
 *   3) JSON slot(`<script type="application/json" slot="items">`) — React 가 custom element
 *      자식 script 를 직렬화하지 못해 mount 후 ref 로 주입하고, attr 갱신이 컴포넌트의
 *      update()(=재파싱)를 트리거한다.
 */
export interface NdsJsonSlot {
  /** slot 이름 (예: "items" / "account" / "footer-actions"). */
  slot: string;
  /** JSON.stringify 될 데이터. */
  data: unknown;
}

export interface NdsTagProps {
  /** custom element 태그명 (예: "nds-brand-header"). */
  tag: string;
  /** attribute 맵. boolean true → 빈 속성, false/null/undefined → 제거. */
  attrs?: Record<string, string | number | boolean | null | undefined>;
  /** JSON slot scripts (nds-sidebar items/account/footer-actions). */
  jsonSlots?: NdsJsonSlot[];
  /** custom event 리스너 (예: { "toggle-collapse": () => ... } — nds-sidebar 여닫기). */
  listeners?: Record<string, (e: Event) => void>;
  style?: React.CSSProperties;
  className?: string;
}

export function NdsTag({ tag, attrs = {}, jsonSlots = [], listeners, style, className }: NdsTagProps) {
  const ref = useRef<HTMLElement>(null);

  // custom event 리스너 부착/정리.
  useEffect(() => {
    const el = ref.current;
    if (!el || !listeners) return;
    const entries = Object.entries(listeners);
    for (const [name, fn] of entries) el.addEventListener(name, fn);
    return () => {
      for (const [name, fn] of entries) el.removeEventListener(name, fn);
    };
  }, [listeners]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1) JSON slot scripts (재)주입 — 컴포넌트가 innerHTML 로 덮어쓰는 본문과 분리된 host 직속 자식.
    el.querySelectorAll(":scope > script[data-nds-json-slot]").forEach((s) => s.remove());
    for (const { slot, data } of jsonSlots) {
      const script = document.createElement("script");
      script.type = "application/json";
      script.setAttribute("slot", slot);
      script.setAttribute("data-nds-json-slot", "");
      script.textContent = JSON.stringify(data);
      el.insertBefore(script, el.firstChild);
    }

    // 2) attribute set — 마지막 attr 변경이 custom element 의 attributeChangedCallback →
    //    update()(=재렌더/재파싱)를 트리거하므로, 위에서 주입한 scripts 가 반영된다.
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) el.removeAttribute(k);
      else el.setAttribute(k, v === true ? "" : String(v));
    }
  });

  return React.createElement(tag, { ref, style, className });
}
