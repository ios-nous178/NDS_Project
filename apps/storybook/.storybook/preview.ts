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
                  .replace("--color-semantic-", "")
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
        const tokenName = prop
          .replace("--color-semantic-", "")
          .replace("--nds-", "")
          .replace("--", "");
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
  decorators: [withBrandTheme, withSpecOverlay],
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
