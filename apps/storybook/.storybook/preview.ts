import type { Preview, Decorator } from "@storybook/react";
import { brandThemes, defaultBrand } from "../src/brand-themes";
import "../../../packages/tokens/dist/tokens.css";
import "../../../packages/react/dist/styles.css";

const TOKEN_OVERRIDE_KEY = "nds-token-overrides";
const SPEC_OVERLAY_KEY = "nds-spec-overlay";

/* ═══════════════════════════════════════
   Brand Theme Decorator
   ═══════════════════════════════════════ */

const withBrandTheme: Decorator = (Story, context) => {
  const brandKey = (context.globals.brand as string) || defaultBrand;
  const theme = brandThemes[brandKey];

  if (theme) {
    const root = document.documentElement;

    for (const b of Object.values(brandThemes)) {
      for (const key of Object.keys(b.cssVars)) {
        root.style.removeProperty(key);
      }
    }

    for (const [key, value] of Object.entries(theme.cssVars)) {
      root.style.setProperty(key, value);
    }

    try {
      const raw = sessionStorage.getItem(`${TOKEN_OVERRIDE_KEY}:${brandKey}`);
      if (raw) {
        const overrides = JSON.parse(raw) as Record<string, string>;
        for (const [key, value] of Object.entries(overrides)) {
          root.style.setProperty(key, value);
        }
      }
    } catch {
      /* 무시 */
    }
  }

  return Story();
};

/* ═══════════════════════════════════════
   Design Spec Overlay Decorator
   hover 시 요소의 CSS 스펙 표시
   ═══════════════════════════════════════ */

const TOOLTIP_ID = "nds-spec-tooltip";
const HIGHLIGHT_ID = "nds-spec-highlight";

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, "0");
  const g = parseInt(match[2]).toString(16).padStart(2, "0");
  const b = parseInt(match[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`.toUpperCase();
}

/** :root CSS 변수에서 값→토큰명 역매핑 테이블 구축 */
function buildTokenMap(): Map<string, string> {
  const map = new Map<string, string>();
  const root = getComputedStyle(document.documentElement);
  // :root에 선언된 모든 CSS 변수를 순회
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith("--")) {
              const val = root.getPropertyValue(prop).trim();
              if (val) {
                // 컬러는 HEX로 정규화해서 매칭
                const normalized = val.startsWith("#") ? val.toUpperCase() : val;
                const tokenName = prop
                  .replace("--semantic-", "")
                  .replace("--nds-", "")
                  .replace("--", "");
                map.set(normalized, tokenName);
                // rgb로 변환된 버전도 등록
                if (val.startsWith("#") && val.length === 7) {
                  const rr = parseInt(val.slice(1, 3), 16);
                  const gg = parseInt(val.slice(3, 5), 16);
                  const bb = parseInt(val.slice(5, 7), 16);
                  map.set(`rgb(${rr}, ${gg}, ${bb})`, tokenName);
                }
              }
            }
          }
        }
      }
    } catch {
      /* cross-origin 무시 */
    }
  }
  // inline style로 주입된 변수도 (토큰 에디터 오버라이드)
  const rootEl = document.documentElement;
  for (let i = 0; i < rootEl.style.length; i++) {
    const prop = rootEl.style[i];
    if (prop.startsWith("--")) {
      const val = rootEl.style.getPropertyValue(prop).trim();
      if (val) {
        const normalized = val.startsWith("#") ? val.toUpperCase() : val;
        const tokenName = prop.replace("--semantic-", "").replace("--nds-", "").replace("--", "");
        map.set(normalized, tokenName);
        if (val.startsWith("#") && val.length === 7) {
          const rr = parseInt(val.slice(1, 3), 16);
          const gg = parseInt(val.slice(3, 5), 16);
          const bb = parseInt(val.slice(5, 7), 16);
          map.set(`rgb(${rr}, ${gg}, ${bb})`, tokenName);
        }
      }
    }
  }
  return map;
}

/** 값에 토큰명이 매칭되면 "토큰명 (실제값)" 형태로 반환 */
function withToken(value: string, tokenMap: Map<string, string>): string {
  const hex = value.startsWith("rgb") ? rgbToHex(value) : value.toUpperCase();
  const token = tokenMap.get(value) || tokenMap.get(hex) || tokenMap.get(value.toUpperCase());
  if (token) {
    return `<span class="spec-token">${token}</span> <span class="spec-color">(${hex})</span>`;
  }
  return `<span class="spec-color">${hex}</span>`;
}

function withSizeToken(value: string, tokenMap: Map<string, string>): string {
  const token = tokenMap.get(value);
  if (token) {
    return `<span class="spec-token">${token}</span> <span class="spec-size">(${value})</span>`;
  }
  return `<span class="spec-size">${value}</span>`;
}

let tokenMapCache: Map<string, string> | null = null;
let tokenMapTime = 0;

function initSpecOverlay() {
  if (document.getElementById(TOOLTIP_ID)) return;

  // 스타일 주입
  const style = document.createElement("style");
  style.textContent = `
    #${TOOLTIP_ID} {
      position: fixed; z-index: 99999; pointer-events: none;
      background: rgba(0,0,0,0.88); color: #fff; padding: 10px 14px;
      border-radius: 8px; font-size: 11px; font-family: 'SF Mono', Monaco, Consolas, monospace;
      line-height: 1.6; max-width: 320px; display: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); backdrop-filter: blur(4px);
    }
    #${TOOLTIP_ID} .spec-label { color: #999; margin-right: 6px; }
    #${TOOLTIP_ID} .spec-value { color: #7DD3FC; }
    #${TOOLTIP_ID} .spec-color { color: #FCD34D; }
    #${TOOLTIP_ID} .spec-size { color: #A5F3FC; }
    #${TOOLTIP_ID} .spec-token { color: #86EFAC; font-weight: 600; }
    #${TOOLTIP_ID} .spec-divider { border-top: 1px solid #444; margin: 4px 0; }
    #${TOOLTIP_ID} .spec-tag { color: #C084FC; font-weight: 600; margin-bottom: 4px; display: block; }
    #${HIGHLIGHT_ID} {
      position: fixed; z-index: 99998; pointer-events: none;
      border: 2px solid #3B82F6; background: rgba(59,130,246,0.06);
      border-radius: 2px; display: none;
      transition: all 0.05s ease-out;
    }
    #${HIGHLIGHT_ID} .dim-label {
      position: absolute; background: #3B82F6; color: #fff; font-size: 9px;
      padding: 1px 5px; border-radius: 2px; white-space: nowrap;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
    }
    #${HIGHLIGHT_ID} .dim-w { top: -16px; left: 50%; transform: translateX(-50%); }
    #${HIGHLIGHT_ID} .dim-h { top: 50%; right: -4px; transform: translateY(-50%) rotate(90deg); transform-origin: right center; }
  `;
  document.head.appendChild(style);

  // 툴팁 + 하이라이트 엘리먼트
  const tooltip = document.createElement("div");
  tooltip.id = TOOLTIP_ID;
  document.body.appendChild(tooltip);

  const highlight = document.createElement("div");
  highlight.id = HIGHLIGHT_ID;
  highlight.innerHTML =
    '<span class="dim-label dim-w"></span><span class="dim-label dim-h"></span>';
  document.body.appendChild(highlight);

  let active = false;

  function checkActive() {
    active = sessionStorage.getItem(SPEC_OVERLAY_KEY) === "true";
    if (!active) {
      tooltip.style.display = "none";
      highlight.style.display = "none";
    }
  }

  // 주기적 체크 (manager에서 토글 시)
  setInterval(checkActive, 300);

  document.addEventListener("mousemove", (e) => {
    if (!active) return;
    // CSS 편집기 선택 모드 중이면 스펙 오버레이 비활성
    if (sessionStorage.getItem("nds-css-editor-active") === "true") return;

    const el = e.target as HTMLElement;
    if (
      !el ||
      el === document.body ||
      el === document.documentElement ||
      el.id === TOOLTIP_ID ||
      el.id === HIGHLIGHT_ID
    ) {
      tooltip.style.display = "none";
      highlight.style.display = "none";
      return;
    }

    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // 하이라이트 박스
    highlight.style.display = "block";
    highlight.style.top = rect.top + "px";
    highlight.style.left = rect.left + "px";
    highlight.style.width = rect.width + "px";
    highlight.style.height = rect.height + "px";
    (highlight.querySelector(".dim-w") as HTMLElement).textContent = `${Math.round(rect.width)}px`;
    (highlight.querySelector(".dim-h") as HTMLElement).textContent = `${Math.round(rect.height)}px`;

    // 토큰 매핑 테이블 (캐시, 5초마다 갱신)
    if (!tokenMapCache || Date.now() - tokenMapTime > 5000) {
      tokenMapCache = buildTokenMap();
      tokenMapTime = Date.now();
    }
    const tm = tokenMapCache;

    // 스펙 수집
    const tag = el.tagName.toLowerCase();
    const cls =
      el.className
        ?.toString?.()
        .split(" ")
        .filter((c: string) => c.startsWith("nds-"))
        .join(" ") || "";
    const specs: string[] = [];

    specs.push(`<span class="spec-tag">&lt;${tag}&gt;${cls ? " ." + cls : ""}</span>`);

    // 사이즈
    specs.push(
      `<span class="spec-label">size</span><span class="spec-size">${Math.round(rect.width)} × ${Math.round(rect.height)}px</span>`,
    );

    // 폰트
    const fontSize = cs.fontSize;
    const fontWeight = cs.fontWeight;
    const lineHeight = cs.lineHeight;
    if (fontSize !== "0px") {
      specs.push(
        `<span class="spec-label">font</span><span class="spec-value">${fontWeight} ${fontSize}/${lineHeight}</span>`,
      );
    }

    // 색상 (토큰명 매칭)
    const color = cs.color;
    const bgColor = cs.backgroundColor;
    if (color && color !== "rgba(0, 0, 0, 0)") {
      specs.push(`<span class="spec-label">color</span>${withToken(color, tm)}`);
    }
    if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
      specs.push(`<span class="spec-label">bg</span>${withToken(bgColor, tm)}`);
    }

    // 패딩
    const pt = cs.paddingTop,
      pr = cs.paddingRight,
      pb = cs.paddingBottom,
      pl = cs.paddingLeft;
    if (pt !== "0px" || pr !== "0px" || pb !== "0px" || pl !== "0px") {
      specs.push(
        `<span class="spec-label">padding</span><span class="spec-size">${pt} ${pr} ${pb} ${pl}</span>`,
      );
    }

    // 마진
    const mt = cs.marginTop,
      mr = cs.marginRight,
      mb = cs.marginBottom,
      ml = cs.marginLeft;
    if (mt !== "0px" || mr !== "0px" || mb !== "0px" || ml !== "0px") {
      specs.push(
        `<span class="spec-label">margin</span><span class="spec-size">${mt} ${mr} ${mb} ${ml}</span>`,
      );
    }

    // 보더
    const border = cs.border;
    const borderRadius = cs.borderRadius;
    if (border && !border.startsWith("0px")) {
      specs.push(`<span class="spec-label">border</span><span class="spec-value">${border}</span>`);
    }
    if (borderRadius && borderRadius !== "0px") {
      specs.push(`<span class="spec-label">radius</span>${withSizeToken(borderRadius, tm)}`);
    }

    // gap
    const gap = cs.gap;
    if (gap && gap !== "normal" && gap !== "0px") {
      specs.push(`<span class="spec-label">gap</span><span class="spec-size">${gap}</span>`);
    }

    tooltip.innerHTML = specs.join("<br>");
    tooltip.style.display = "block";

    // 위치 조정
    const tx = Math.min(e.clientX + 16, window.innerWidth - tooltip.offsetWidth - 10);
    const ty =
      e.clientY + 24 + tooltip.offsetHeight > window.innerHeight
        ? e.clientY - tooltip.offsetHeight - 8
        : e.clientY + 24;
    tooltip.style.left = tx + "px";
    tooltip.style.top = ty + "px";
  });

  document.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    highlight.style.display = "none";
  });
}

const withSpecOverlay: Decorator = (Story) => {
  if (typeof window !== "undefined") {
    // 한 번만 초기화
    setTimeout(initSpecOverlay, 100);
  }
  return Story();
};

/* ═══════════════════════════════════════
   CSS Editor Decorator
   요소 선택 + 실시간 CSS 편집
   ═══════════════════════════════════════ */

const CSS_EDITOR_STYLE_ID = "nds-css-editor-style";
const CSS_EDITOR_CUSTOM_ID = "nds-css-editor-custom";

function isDefaultCss(prop: string, val: string): boolean {
  if (
    val === "0px" &&
    /^(padding|margin|gap|row-gap|column-gap|letter-spacing|border-radius)/.test(prop)
  )
    return true;
  if (val === "auto" && /^(width|height|min-|max-|top|right|bottom|left|flex-basis)/.test(prop))
    return true;
  if (val === "0" && /^(flex-grow|flex-shrink|order|z-index)/.test(prop)) return true;
  const skip: Record<string, string[]> = {
    "background-color": ["rgba(0, 0, 0, 0)", "transparent"],
    "border-color": ["rgb(0, 0, 0)"],
    border: ["0px none rgb(0, 0, 0)", "none"],
    "box-shadow": ["none"],
    opacity: ["1"],
    display: ["block", "inline"],
    position: ["static"],
    overflow: ["visible"],
    "flex-direction": ["row"],
    "flex-wrap": ["nowrap"],
    "align-items": ["normal", "stretch"],
    "align-self": ["auto"],
    "justify-content": ["normal"],
    "flex-grow": ["0"],
    "flex-shrink": ["1"],
    "flex-basis": ["auto"],
    order: ["0"],
    gap: ["normal"],
    "row-gap": ["normal"],
    "column-gap": ["normal"],
    "letter-spacing": ["normal"],
    "z-index": ["auto"],
    "grid-template-columns": ["none"],
    "grid-template-rows": ["none"],
    "grid-column": ["auto"],
    "grid-row": ["auto"],
  };
  return skip[prop]?.includes(val) ?? false;
}

function buildCssPath(el: Element): string {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body && cur !== document.documentElement) {
    let s = cur.tagName.toLowerCase();
    if (cur.id) {
      parts.unshift(`#${cur.id}`);
      break;
    }
    const cls = Array.from(cur.classList).filter(
      (c) => c && !c.startsWith("nds-css-") && !c.startsWith("nds-spec"),
    );
    if (cls.length) s += "." + cls.slice(0, 2).join(".");
    const p = cur.parentElement;
    if (p) {
      const same = Array.from(p.children).filter((c) => c.tagName === cur!.tagName);
      if (same.length > 1) s += `:nth-of-type(${same.indexOf(cur) + 1})`;
    }
    parts.unshift(s);
    cur = cur.parentElement;
  }
  return parts.join(" > ");
}

function findTokenVars(
  el: Element,
  cs: CSSStyleDeclaration,
): { name: string; value: string; prop: string }[] {
  const result: { name: string; value: string; prop: string }[] = [];
  const seen = new Set<string>();
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!(rule instanceof CSSStyleRule)) continue;
        try {
          if (!el.matches(rule.selectorText)) continue;
        } catch {
          continue;
        }
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          const val = rule.style.getPropertyValue(prop);
          for (const m of val.matchAll(/var\((--[^,)]+)/g)) {
            const vn = m[1];
            if (seen.has(vn)) continue;
            seen.add(vn);
            const resolved = cs.getPropertyValue(vn).trim();
            if (resolved) result.push({ name: vn, value: resolved, prop });
          }
        }
      }
    } catch {
      /* cross-origin 무시 */
    }
  }
  return result;
}

function initCssEditor() {
  if (document.getElementById(CSS_EDITOR_STYLE_ID)) return;

  let selectMode = false;
  let selectedEl: HTMLElement | null = null;
  let origStyle = "";
  let hoverEl: HTMLElement | null = null;

  // 스타일 주입
  const editorStyle = document.createElement("style");
  editorStyle.id = CSS_EDITOR_STYLE_ID;
  editorStyle.textContent = `
    .nds-css-hover {
      outline: 2px dashed #F59E0B !important;
      outline-offset: 1px !important;
      cursor: crosshair !important;
    }
    .nds-css-selected {
      outline: 2px solid #F59E0B !important;
      outline-offset: 2px !important;
    }
    .nds-css-text-editing {
      outline: 2px solid #8B5CF6 !important;
      outline-offset: 2px !important;
      cursor: text !important;
      -webkit-user-select: text !important;
      user-select: text !important;
      min-height: 1em;
    }
    .nds-css-text-editing * {
      cursor: text !important;
      -webkit-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(editorStyle);

  // 커스텀 CSS 스타일 태그
  const customStyle = document.createElement("style");
  customStyle.id = CSS_EDITOR_CUSTOM_ID;
  document.head.appendChild(customStyle);

  let textEditMode = false;

  // 호버 하이라이트
  document.addEventListener("mouseover", (e) => {
    if (!selectMode || textEditMode) return;
    const el = e.target as HTMLElement;
    if (hoverEl) hoverEl.classList.remove("nds-css-hover");
    if (el && el !== document.body && el !== document.documentElement) {
      el.classList.add("nds-css-hover");
      hoverEl = el;
    }
  });

  document.addEventListener("mouseout", () => {
    if (hoverEl) {
      hoverEl.classList.remove("nds-css-hover");
      hoverEl = null;
    }
  });

  // 클릭 선택
  document.addEventListener(
    "click",
    (e) => {
      if (!selectMode) return;
      // 텍스트 편집 중이면 선택된 요소 내부 클릭 허용
      if (textEditMode && selectedEl && selectedEl.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();

      const el = e.target as HTMLElement;
      if (!el || el === document.body || el === document.documentElement) return;
      if (hoverEl) hoverEl.classList.remove("nds-css-hover");
      if (selectedEl) selectedEl.classList.remove("nds-css-selected");

      selectedEl = el;
      origStyle = el.getAttribute("style") || "";
      el.classList.add("nds-css-selected");

      // computed styles 수집
      const cs = getComputedStyle(el);
      const keyProps = [
        // 색상
        "color",
        "background-color",
        "border-color",
        // 크기
        "width",
        "height",
        "min-width",
        "max-width",
        "min-height",
        "max-height",
        // 간격
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "gap",
        "row-gap",
        "column-gap",
        // 모양
        "border-radius",
        "border",
        "box-shadow",
        "opacity",
        "overflow",
        // 타이포
        "font-size",
        "font-weight",
        "line-height",
        "letter-spacing",
        // 레이아웃
        "display",
        "position",
        "top",
        "right",
        "bottom",
        "left",
        "z-index",
        "flex-direction",
        "flex-wrap",
        "align-items",
        "align-self",
        "justify-content",
        "flex-grow",
        "flex-shrink",
        "flex-basis",
        "order",
        "grid-template-columns",
        "grid-template-rows",
        "grid-column",
        "grid-row",
      ];

      const styles: Record<string, string> = {};
      for (const p of keyProps) {
        const v = cs.getPropertyValue(p).trim();
        if (v && !isDefaultCss(p, v)) styles[p] = v;
      }

      const tokenVars = findTokenVars(el, cs);

      // 자식 요소 정보
      const children = Array.from(el.children)
        .slice(0, 30) // 최대 30개
        .map((child, i) => ({
          index: i,
          tag: child.tagName.toLowerCase(),
          text: (child.textContent || "").trim().slice(0, 25),
        }));

      // 이미지 정보
      const imgSrc = el.tagName === "IMG" ? (el as HTMLImageElement).src : undefined;
      const bgImg = cs.backgroundImage;
      const bgImage =
        bgImg && bgImg !== "none"
          ? bgImg.replace(/^url\(["']?/, "").replace(/["']?\)$/, "")
          : undefined;

      window.parent.postMessage(
        {
          type: "nds-css-select",
          payload: {
            path: buildCssPath(el),
            tag: el.tagName.toLowerCase(),
            classes: Array.from(el.classList).filter((c) => !c.startsWith("nds-css-")),
            id: el.id,
            styles,
            tokenVars,
            children,
            imgSrc,
            bgImage,
          },
        },
        "*",
      );
    },
    true,
  );

  // 메시지 핸들러
  window.addEventListener("message", (e) => {
    if (e.data?.type === "nds-css-mode") {
      selectMode = e.data.enabled;
      sessionStorage.setItem("nds-css-editor-active", String(selectMode));
      if (!selectMode && hoverEl) {
        hoverEl.classList.remove("nds-css-hover");
        hoverEl = null;
      }
    }

    if (e.data?.type === "nds-css-apply") {
      // 요소 인라인 스타일 적용
      if (selectedEl && e.data.styleOvr) {
        selectedEl.setAttribute("style", origStyle);
        for (const [p, v] of Object.entries(e.data.styleOvr as Record<string, string>)) {
          selectedEl.style.setProperty(p, v, "important");
        }
      }
      // 토큰 오버라이드 (:root)
      if (e.data.tokenOvr) {
        for (const [k, v] of Object.entries(e.data.tokenOvr as Record<string, string>)) {
          document.documentElement.style.setProperty(k, v);
        }
      }
      // 자식 요소 순서 (CSS order)
      if (selectedEl && e.data.childOrders) {
        const orders = e.data.childOrders as Record<string, number>;
        for (let i = 0; i < selectedEl.children.length; i++) {
          const child = selectedEl.children[i] as HTMLElement;
          if (i in orders) {
            child.style.order = String(orders[i]);
          } else {
            child.style.removeProperty("order");
          }
        }
      }
      // 자식 요소 숨기기
      if (selectedEl && e.data.hiddenChildren) {
        const hidden = new Set(e.data.hiddenChildren as number[]);
        for (let i = 0; i < selectedEl.children.length; i++) {
          const child = selectedEl.children[i] as HTMLElement;
          if (hidden.has(i)) {
            child.style.setProperty("display", "none", "important");
          } else if (!child.style.order) {
            // order가 설정된 건 건드리지 않음 (display 복원)
            child.style.removeProperty("display");
          }
        }
      }
      // 아이콘 삽입은 별도 메시지로 처리
      // (apply와 분리 — 한 번만 실행)

      // 이미지 교체
      if (selectedEl && e.data.imageReplace) {
        if (selectedEl.tagName === "IMG") {
          (selectedEl as HTMLImageElement).src = e.data.imageReplace;
        } else {
          selectedEl.style.setProperty(
            "background-image",
            `url("${e.data.imageReplace}")`,
            "important",
          );
        }
      }
      // 텍스트 편집 모드
      textEditMode = !!e.data.textEditing;
      if (selectedEl) {
        if (e.data.textEditing) {
          selectedEl.contentEditable = "true";
          selectedEl.classList.add("nds-css-text-editing");
          selectedEl.classList.remove("nds-css-selected");
          selectedEl.focus();
        } else {
          selectedEl.contentEditable = "false";
          selectedEl.removeAttribute("contenteditable");
          selectedEl.classList.remove("nds-css-text-editing");
          selectedEl.classList.add("nds-css-selected");
        }
      }
      // 여백 시각화
      updateBoxModel(selectedEl, e.data.boxModel);
      // 커스텀 CSS
      if (e.data.customCss !== undefined) {
        customStyle.textContent = e.data.customCss;
      }
    }

    if (e.data?.type === "nds-css-icon" && selectedEl) {
      // 선택된 요소에 아이콘 SVG 삽입
      const svg = e.data.svg as string;
      if (selectedEl.tagName === "IMG") {
        // img → svg로 교체
        const wrapper = document.createElement("span");
        wrapper.innerHTML = svg;
        wrapper.style.display = "inline-flex";
        selectedEl.parentNode?.replaceChild(wrapper, selectedEl);
        selectedEl = wrapper as HTMLElement;
      } else if (
        selectedEl.tagName === "SVG" ||
        selectedEl.tagName === "svg" ||
        selectedEl.closest("svg")
      ) {
        // 기존 SVG → 새 SVG로 교체
        const target =
          selectedEl.tagName === "SVG" || selectedEl.tagName === "svg"
            ? selectedEl
            : selectedEl.closest("svg")!;
        const wrapper = document.createElement("span");
        wrapper.innerHTML = svg;
        wrapper.style.display = "inline-flex";
        target.parentNode?.replaceChild(wrapper, target);
        selectedEl = wrapper as HTMLElement;
      } else {
        // 일반 요소 → 내부에 SVG 삽입 (기존 내용 유지하면서 앞에 추가)
        const wrapper = document.createElement("span");
        wrapper.innerHTML = svg;
        wrapper.style.display = "inline-flex";
        wrapper.style.verticalAlign = "middle";
        wrapper.style.marginRight = "4px";
        selectedEl.insertBefore(wrapper, selectedEl.firstChild);
      }
    }

    if (e.data?.type === "nds-css-reset") {
      if (selectedEl) {
        // 자식 order + display 초기화
        for (const child of Array.from(selectedEl.children)) {
          (child as HTMLElement).style.removeProperty("order");
          (child as HTMLElement).style.removeProperty("display");
        }
        selectedEl.removeAttribute("contenteditable");
        selectedEl.classList.remove("nds-css-text-editing");
        selectedEl.setAttribute("style", origStyle);
        selectedEl.classList.remove("nds-css-selected");
      }
      textEditMode = false;
      updateBoxModel(null, false);
      customStyle.textContent = "";
      selectedEl = null;
      origStyle = "";
    }
  });

  // ── 여백 시각화 (box model overlay) ──

  const boxOverlay = document.createElement("div");
  boxOverlay.id = "nds-css-box-overlay";
  boxOverlay.style.cssText = "position:fixed;z-index:99996;pointer-events:none;display:none;";
  boxOverlay.innerHTML = `
    <div class="bm-margin" style="position:absolute;background:rgba(249,115,22,0.15);border:1px dashed rgba(249,115,22,0.4);"></div>
    <div class="bm-border" style="position:absolute;background:rgba(250,204,21,0.2);"></div>
    <div class="bm-padding" style="position:absolute;background:rgba(34,197,94,0.15);border:1px dashed rgba(34,197,94,0.4);"></div>
    <div class="bm-content" style="position:absolute;background:rgba(59,130,246,0.1);border:1px dashed rgba(59,130,246,0.3);"></div>
    <div class="bm-labels" style="position:absolute;top:-20px;left:0;display:flex;gap:8px;font-size:9px;font-family:monospace;white-space:nowrap;">
      <span style="color:#F97316;">■ margin</span>
      <span style="color:#22C55E;">■ padding</span>
      <span style="color:#3B82F6;">■ content</span>
    </div>
  `;
  document.body.appendChild(boxOverlay);

  function updateBoxModel(el: HTMLElement | null, show: boolean) {
    if (!el || !show) {
      boxOverlay.style.display = "none";
      return;
    }
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const mt = parseFloat(cs.marginTop) || 0;
    const mr = parseFloat(cs.marginRight) || 0;
    const mb = parseFloat(cs.marginBottom) || 0;
    const ml = parseFloat(cs.marginLeft) || 0;
    const pt = parseFloat(cs.paddingTop) || 0;
    const pr = parseFloat(cs.paddingRight) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;
    const pl = parseFloat(cs.paddingLeft) || 0;
    const bt = parseFloat(cs.borderTopWidth) || 0;
    const br2 = parseFloat(cs.borderRightWidth) || 0;
    const bb = parseFloat(cs.borderBottomWidth) || 0;
    const bl = parseFloat(cs.borderLeftWidth) || 0;

    boxOverlay.style.display = "block";

    // margin box
    const marginEl = boxOverlay.querySelector(".bm-margin") as HTMLElement;
    marginEl.style.top = `${rect.top - mt}px`;
    marginEl.style.left = `${rect.left - ml}px`;
    marginEl.style.width = `${rect.width + ml + mr}px`;
    marginEl.style.height = `${rect.height + mt + mb}px`;

    // border box (= rect)
    const borderEl = boxOverlay.querySelector(".bm-border") as HTMLElement;
    borderEl.style.top = `${rect.top}px`;
    borderEl.style.left = `${rect.left}px`;
    borderEl.style.width = `${rect.width}px`;
    borderEl.style.height = `${rect.height}px`;

    // padding box
    const paddingEl = boxOverlay.querySelector(".bm-padding") as HTMLElement;
    paddingEl.style.top = `${rect.top + bt}px`;
    paddingEl.style.left = `${rect.left + bl}px`;
    paddingEl.style.width = `${rect.width - bl - br2}px`;
    paddingEl.style.height = `${rect.height - bt - bb}px`;

    // content box
    const contentEl = boxOverlay.querySelector(".bm-content") as HTMLElement;
    contentEl.style.top = `${rect.top + bt + pt}px`;
    contentEl.style.left = `${rect.left + bl + pl}px`;
    contentEl.style.width = `${rect.width - bl - br2 - pl - pr}px`;
    contentEl.style.height = `${rect.height - bt - bb - pt - pb}px`;

    // labels
    const labelsEl = boxOverlay.querySelector(".bm-labels") as HTMLElement;
    labelsEl.style.top = `${rect.top - mt - 18}px`;
    labelsEl.style.left = `${rect.left - ml}px`;
  }
}

const withCssEditor: Decorator = (Story) => {
  if (typeof window !== "undefined") {
    setTimeout(initCssEditor, 100);
  }
  return Story();
};

/* ═══════════════════════════════════════
   Preview Config
   ═══════════════════════════════════════ */

const preview: Preview = {
  globalTypes: {
    brand: {
      description: "브랜드 테마 전환",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: Object.values(brandThemes).map((t) => ({
          value: t.name,
          title: t.label,
          right: t.description,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: defaultBrand,
  },
  decorators: [withBrandTheme, withSpecOverlay, withCssEditor],
  parameters: {
    a11y: {
      test: "error",
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "aria-valid-attr", enabled: true },
          { id: "aria-valid-attr-value", enabled: true },
          { id: "label", enabled: true },
          { id: "image-alt", enabled: true },
          { id: "button-name", enabled: true },
          { id: "link-name", enabled: true },
        ],
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "gray", value: "#F5F5F5" },
        { name: "dark", value: "#383838" },
      ],
    },
    chromatic: {
      modes: {
        mobile: { viewport: 375 },
        desktop: { viewport: 1280 },
      },
    },
  },
};

export default preview;
