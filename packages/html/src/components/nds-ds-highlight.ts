/**
 * <nds-ds-highlight> — DS DSHighlight 의 vanilla Web Component 버전.
 *
 * DS 디버깅 도구: NDS 컴포넌트와 사용자 정의 영역에 점선 오버레이를 그린다.
 *
 * 사용 예 (앱 한 곳에만 두면 됨):
 *   <nds-ds-highlight></nds-ds-highlight>
 *
 *   <!-- URL ?ds=1 로 진입 시 자동 "all" 모드 -->
 *   <!-- Cmd/Ctrl + Shift + D 로 OFF → 영역 → 개별 → 전체 순환 -->
 *
 *   <!-- 영역 마크는 임의 element 에 data-ds-mark="라벨" 로 표시 -->
 *   <main data-ds-mark="홈/추천 섹션">…</main>
 *
 * 속성:
 *   mode: "off" | "area" | "component" | "all" (default "off")
 *   hide-toggle: 토글 버튼 숨김 (외부에서 mode 만 제어)
 *   default-mode: 페이지 로드 시 초기 모드 (default "off")
 *
 * 이벤트:
 *   nds-ds-highlight-mode-change (detail: { mode })
 */

import { NdsElement, define } from "../base/nds-element.js";

export type DSHighlightMode = "off" | "area" | "component" | "all";

const MODES: DSHighlightMode[] = ["off", "area", "component", "all"];
const MODE_LABELS: Record<DSHighlightMode, string> = {
  off: "OFF",
  area: "영역",
  component: "개별",
  all: "전체",
};

const AREA_COLOR = "#2b96ed";
const COMPONENT_COLOR = "rgba(237, 46, 119, 0.8)";

interface OverlayRect {
  id: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
}

const extractNdsName = (el: Element): string | null => {
  for (const cls of Array.from(el.classList)) {
    const match = /^nds-(.+)__root$/.exec(cls);
    if (match) {
      return match[1]
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
    }
  }
  return null;
};

export class NdsDsHighlight extends NdsElement {
  static elementName = "nds-ds-highlight";

  static get observedAttributes(): readonly string[] {
    return ["mode", "hide-toggle", "default-mode"];
  }

  private _overlay: HTMLDivElement | null = null;
  private _toggleBtn: HTMLButtonElement | null = null;
  private _rafId = 0;
  private _initialized = false;

  private _onKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
      e.preventDefault();
      this._cycle();
    }
  };

  override connectedCallback(): void {
    if (!this._overlay) this._mount();
    super.connectedCallback();
    window.addEventListener("keydown", this._onKeyDown);
    if (!this._initialized) {
      this._initialized = true;
      this._initFromQuery();
    }
  }

  override disconnectedCallback(): void {
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._overlay) this._overlay.remove();
    if (this._toggleBtn) this._toggleBtn.remove();
  }

  private _initFromQuery(): void {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("ds") === "1") {
      this.setAttribute("mode", "all");
      return;
    }
    const defaultMode = this.getAttribute("default-mode") as DSHighlightMode | null;
    if (defaultMode && MODES.includes(defaultMode)) {
      this.setAttribute("mode", defaultMode);
    }
  }

  private _cycle(): void {
    const current = (this.getAttribute("mode") as DSHighlightMode) || "off";
    const idx = MODES.indexOf(current);
    const next = MODES[(idx + 1) % MODES.length];
    this.setAttribute("mode", next);
    this.dispatchEvent(
      new CustomEvent("nds-ds-highlight-mode-change", {
        detail: { mode: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _mount(): void {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:99998;";
    document.body.appendChild(overlay);

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.style.cssText =
      "position:fixed;right:24px;bottom:24px;z-index:99999;display:none;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;border:none;background:#383838;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.25);user-select:none;";
    toggleBtn.addEventListener("click", () => this._cycle());

    const dot = document.createElement("span");
    dot.style.cssText =
      "display:inline-block;width:8px;height:8px;border-radius:50%;background:#666;";
    const label = document.createElement("span");
    label.textContent = "DS OFF";

    toggleBtn.append(dot, label);
    document.body.appendChild(toggleBtn);

    this._overlay = overlay;
    this._toggleBtn = toggleBtn;
  }

  private _measure(): OverlayRect[] {
    const mode = (this.getAttribute("mode") as DSHighlightMode) || "off";
    if (mode === "off") return [];

    const rects: OverlayRect[] = [];

    if (mode === "area" || mode === "all") {
      const areas = document.querySelectorAll<HTMLElement>("[data-ds-mark]");
      areas.forEach((el) => {
        const label = el.getAttribute("data-ds-mark") || "";
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          rects.push({
            id: `area-${label}-${r.top}-${r.left}`,
            label: `DS: ${label}`,
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
            height: r.height,
            color: AREA_COLOR,
          });
        }
      });
    }

    if (mode === "component" || mode === "all") {
      const els = document.querySelectorAll('[class*="__root"]');
      els.forEach((el) => {
        const name = extractNdsName(el);
        if (!name) return;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          rects.push({
            id: `comp-${name}-${r.top}-${r.left}`,
            label: name,
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
            height: r.height,
            color: COMPONENT_COLOR,
          });
        }
      });
    }

    return rects;
  }

  private _drawOverlay(rects: OverlayRect[]): void {
    if (!this._overlay) return;
    this._overlay.innerHTML = "";
    rects.forEach((rect) => {
      const wrap = document.createElement("div");

      const border = document.createElement("div");
      border.style.cssText = `position:absolute;top:${rect.top - 3}px;left:${rect.left - 3}px;width:${rect.width + 6}px;height:${rect.height + 6}px;border:2px dashed ${rect.color};border-radius:8px;pointer-events:none;`;

      const tag = document.createElement("span");
      tag.style.cssText = `position:absolute;top:${rect.top - 14}px;left:${rect.left + 4}px;background:${rect.color};color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:3px;white-space:nowrap;line-height:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;pointer-events:none;`;
      tag.textContent = rect.label;

      wrap.append(border, tag);
      this._overlay!.appendChild(wrap);
    });
  }

  private _scheduleLoop(): void {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    const loop = () => {
      const mode = (this.getAttribute("mode") as DSHighlightMode) || "off";
      if (mode === "off") {
        if (this._overlay) this._overlay.innerHTML = "";
        this._rafId = 0;
        return;
      }
      this._drawOverlay(this._measure());
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    if (!this._toggleBtn || !this._overlay) return;

    const mode = (this.getAttribute("mode") as DSHighlightMode) || "off";
    const hideToggle = this.boolAttr("hide-toggle");

    // Show toggle only when explicitly visible (any mode set ≠ off) or user opened via shortcut.
    const showToggle = !hideToggle;
    this._toggleBtn.style.display = showToggle ? "flex" : "none";

    const label = this._toggleBtn.querySelector("span:last-child");
    if (label) label.textContent = `DS ${MODE_LABELS[mode]}`;
    const dot = this._toggleBtn.querySelector("span:first-child") as HTMLElement | null;
    if (dot) dot.style.background = mode === "off" ? "#666" : "#fff";
    this._toggleBtn.style.background =
      mode === "off" ? "#383838" : "var(--semantic-icon-brand-default, #2b96ed)";

    if (mode === "off") {
      this._overlay.innerHTML = "";
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = 0;
      }
    } else {
      this._scheduleLoop();
    }
  }
}

define(NdsDsHighlight);
