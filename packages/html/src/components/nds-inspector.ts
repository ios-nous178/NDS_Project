/**
 * <nds-inspector> — DS Inspector 의 vanilla Web Component 버전.
 *
 * React DsInspector.tsx 와 동일한 분류 / outline / floating UI 동작을 React 없이 제공한다.
 *
 * 사용:
 *   <!-- index.html -->
 *   <script type="module">
 *     import "@nudge-design/html/elements/nds-inspector";
 *     document.body.appendChild(document.createElement("nds-inspector"));
 *   </script>
 *
 *   <!-- 또는 markup 으로 직접 -->
 *   <nds-inspector></nds-inspector>
 *
 * 분류:
 *   · DS    (초록 실선): className 에 `nds-` prefix 또는 tagName 이 `nds-*` Web Component
 *   · antd  (주황 실선): className 에 `ant-` prefix
 *   · native(빨강 점선): plain <button>/<input>/<select>/<textarea>/<form>/<label>
 *
 * 토글: 우하단 floating 버튼 클릭, Ctrl/Cmd + Shift + D 단축키.
 *
 * 호스트 attribute:
 *   default-enabled  — 마운트 직후 자동으로 활성화
 *   no-outline       — 기본 outline 표시 OFF (체크박스로 다시 켤 수 있음)
 */

import { NdsElement, define } from "../base/nds-element.js";

type Category = "ds" | "antd" | "native";

interface InspectorStats {
  ds: number;
  antd: number;
  native: number;
}

const DS_CLASS_PREFIX = "nds-";
const ANTD_CLASS_PREFIX = "ant-";
const NATIVE_TAGS = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "FORM", "LABEL"]);

const CATEGORY_COLOR: Record<Category, string> = {
  ds: "var(--semantic-text-status-success)",
  antd: "var(--semantic-text-status-caution)",
  native: "var(--semantic-text-status-error)",
};

const CATEGORY_LABEL: Record<Category, string> = {
  ds: "DS",
  antd: "antd",
  native: "native",
};

const STYLE_ID = "nds-inspector-style";
const UI_ATTR = "data-nds-inspector-ui";
const MARK_ATTR = "data-nds-inspect";

function elementClassList(el: Element): string[] {
  const cls = (el as HTMLElement).className;
  if (typeof cls === "string") return cls.split(/\s+/);
  if (cls && typeof (cls as { baseVal?: string }).baseVal === "string") {
    return (cls as { baseVal: string }).baseVal.split(/\s+/);
  }
  return [];
}

function classify(el: Element): Category | null {
  const classes = elementClassList(el);
  if (classes.some((c) => c.startsWith(DS_CLASS_PREFIX))) return "ds";
  // nds-* custom element 자체도 DS — host wrapper 가 className 없이 children 에 nds-* class 를
  // 박는 경우가 있어, tagName 으로도 잡는다.
  if (el.tagName.toLowerCase().startsWith("nds-")) return "ds";
  if (classes.some((c) => c.startsWith(ANTD_CLASS_PREFIX))) return "antd";
  if (NATIVE_TAGS.has(el.tagName)) return "native";
  return null;
}

function injectOutlineStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    [${MARK_ATTR}="ds"] { outline: 2px solid ${CATEGORY_COLOR.ds} !important; outline-offset: -2px !important; }
    [${MARK_ATTR}="antd"] { outline: 2px solid ${CATEGORY_COLOR.antd} !important; outline-offset: -2px !important; }
    [${MARK_ATTR}="native"] { outline: 2px dashed ${CATEGORY_COLOR.native} !important; outline-offset: -2px !important; }
  `;
  document.head.appendChild(s);
}

function removeOutlineStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}

function clearMarks(): void {
  document.querySelectorAll(`[${MARK_ATTR}]`).forEach((el) => el.removeAttribute(MARK_ATTR));
}

function scanAndMark(): InspectorStats {
  const counts: InspectorStats = { ds: 0, antd: 0, native: 0 };
  const all = document.body.querySelectorAll("*");
  all.forEach((el) => {
    if (el.closest(`[${UI_ATTR}]`)) return;
    const cat = classify(el);
    if (cat) {
      el.setAttribute(MARK_ATTR, cat);
      counts[cat] += 1;
    } else if (el.hasAttribute(MARK_ATTR)) {
      el.removeAttribute(MARK_ATTR);
    }
  });
  return counts;
}

export class NdsInspector extends NdsElement {
  static elementName = "nds-inspector";

  static get observedAttributes(): readonly string[] {
    return ["default-enabled", "no-outline"];
  }

  private _mounted = false;
  private _enabled = false;
  private _showOutline = true;
  private _stats: InspectorStats = { ds: 0, antd: 0, native: 0 };
  private _observer: MutationObserver | null = null;
  private _rafId: number | null = null;

  private _root: HTMLDivElement | null = null;
  private _toggleBtn: HTMLButtonElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _statRows: Partial<Record<Category, HTMLElement>> = {};
  private _totalSpan: HTMLSpanElement | null = null;
  private _ratioStrong: HTMLElement | null = null;
  private _outlineCheck: HTMLInputElement | null = null;

  private _onKey = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      this._setEnabled(!this._enabled);
    }
  };

  override connectedCallback(): void {
    if (!this._mounted) {
      this._mount();
      this._showOutline = !this.boolAttr("no-outline");
      if (this.boolAttr("default-enabled")) this._enabled = true;
    }
    window.addEventListener("keydown", this._onKey);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    window.removeEventListener("keydown", this._onKey);
    this._teardownScanning();
    removeOutlineStyle();
    clearMarks();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.setAttribute(UI_ATTR, "");
    root.style.cssText = [
      "position: fixed",
      "right: 16px",
      "bottom: 16px",
      "z-index: 2147483647",
      "font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      "font-size: 12px",
      "line-height: 1.4",
      "color: var(--semantic-text-strong-default)",
    ].join(";");

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.title = "DS Inspector 켜기 (Ctrl/Cmd+Shift+D)";
    toggleBtn.textContent = "🔍 DS Inspector";
    toggleBtn.style.cssText = [
      "background: var(--semantic-bg-inverse-default)",
      "color: var(--semantic-text-inverse-default)",
      "border: none",
      "border-radius: 9999px",
      "padding: 8px 14px",
      "cursor: pointer",
      "box-shadow: 0 4px 12px rgba(0,0,0,0.18)",
      "font-size: 12px",
      "font-weight: 600",
    ].join(";");
    toggleBtn.addEventListener("click", () => this._setEnabled(true));

    const panel = document.createElement("div");
    panel.style.cssText = [
      "background: var(--semantic-bg-surface-default)",
      "border: var(--stroke-thin) solid var(--semantic-border-normal-default)",
      "border-radius: 12px",
      "box-shadow: 0 8px 24px rgba(0,0,0,0.16)",
      "padding: 12px",
      "min-width: 220px",
      "display: none",
    ].join(";");

    const header = document.createElement("div");
    header.style.cssText = [
      "display: flex",
      "justify-content: space-between",
      "align-items: center",
      "margin-bottom: 8px",
    ].join(";");
    const title = document.createElement("strong");
    title.textContent = "DS Inspector";
    title.style.fontSize = "13px";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Inspector 끄기");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = [
      "background: transparent",
      "border: none",
      "cursor: pointer",
      "font-size: 16px",
      "line-height: 1",
      "color: var(--semantic-text-muted-default)",
    ].join(";");
    closeBtn.addEventListener("click", () => this._setEnabled(false));
    header.append(title, closeBtn);

    const dsRow = this._buildStatRow("ds");
    const antdRow = this._buildStatRow("antd");
    const nativeRow = this._buildStatRow("native");

    const footer = document.createElement("div");
    footer.style.cssText = [
      "margin-top: 8px",
      "padding-top: 8px",
      "border-top: var(--stroke-thin) solid var(--semantic-border-subtle-default)",
      "display: flex",
      "justify-content: space-between",
      "color: var(--semantic-text-muted-default)",
    ].join(";");
    const totalSpan = document.createElement("span");
    totalSpan.textContent = "총 0";
    const ratioWrap = document.createElement("span");
    ratioWrap.append("DS 비율 ");
    const ratioStrong = document.createElement("strong");
    ratioStrong.style.color = "var(--semantic-text-strong-default)";
    ratioStrong.textContent = "0%";
    ratioWrap.appendChild(ratioStrong);
    footer.append(totalSpan, ratioWrap);

    const outlineLabel = document.createElement("label");
    outlineLabel.style.cssText = [
      "display: flex",
      "align-items: center",
      "gap: 6px",
      "margin-top: 10px",
      "cursor: pointer",
      "user-select: none",
    ].join(";");
    const outlineCheck = document.createElement("input");
    outlineCheck.type = "checkbox";
    outlineCheck.checked = true;
    outlineCheck.addEventListener("change", () => {
      this._showOutline = outlineCheck.checked;
      if (this._enabled) {
        if (this._showOutline) injectOutlineStyle();
        else removeOutlineStyle();
      }
    });
    const outlineText = document.createElement("span");
    outlineText.textContent = "outline 표시";
    outlineLabel.append(outlineCheck, outlineText);

    const hint = document.createElement("div");
    hint.style.cssText =
      "margin-top: 6px; color: var(--semantic-text-muted-default); font-size: 11px";
    hint.textContent = "Ctrl/Cmd + Shift + D 로 토글";

    panel.append(header, dsRow.row, antdRow.row, nativeRow.row, footer, outlineLabel, hint);
    root.append(toggleBtn, panel);
    this.appendChild(root);

    this._root = root;
    this._toggleBtn = toggleBtn;
    this._panel = panel;
    this._statRows = { ds: dsRow.count, antd: antdRow.count, native: nativeRow.count };
    this._totalSpan = totalSpan;
    this._ratioStrong = ratioStrong;
    this._outlineCheck = outlineCheck;
    this._mounted = true;
  }

  private _buildStatRow(cat: Category): { row: HTMLElement; count: HTMLElement } {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 3px 0";
    const swatch = document.createElement("span");
    swatch.setAttribute("aria-hidden", "true");
    swatch.style.cssText = [
      "width: 10px",
      "height: 10px",
      "border-radius: 2px",
      `background: ${CATEGORY_COLOR[cat]}`,
      "flex-shrink: 0",
    ].join(";");
    const label = document.createElement("span");
    label.style.flex = "1";
    label.textContent = CATEGORY_LABEL[cat];
    const count = document.createElement("strong");
    count.textContent = "0";
    row.append(swatch, label, count);
    return { row, count };
  }

  protected update(): void {
    if (!this._mounted) return;
    // attribute 변경으로 default-enabled / no-outline 가 갱신될 때 반영.
    if (this.hasAttribute("default-enabled") && !this._enabled) {
      this._setEnabled(true);
    }
    if (this._outlineCheck) {
      const wantOutline = !this.boolAttr("no-outline");
      if (this._outlineCheck.checked !== wantOutline) {
        this._outlineCheck.checked = wantOutline;
        this._showOutline = wantOutline;
      }
    }
  }

  private _setEnabled(value: boolean): void {
    if (this._enabled === value) return;
    this._enabled = value;

    if (this._toggleBtn) this._toggleBtn.style.display = value ? "none" : "";
    if (this._panel) this._panel.style.display = value ? "" : "none";

    if (!value) {
      this._teardownScanning();
      removeOutlineStyle();
      clearMarks();
      this._renderStats({ ds: 0, antd: 0, native: 0 });
      return;
    }

    if (this._showOutline) injectOutlineStyle();
    this._refresh();
    this._observer = new MutationObserver(() => this._refresh());
    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private _teardownScanning(): void {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  private _refresh(): void {
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      this._stats = scanAndMark();
      this._renderStats(this._stats);
    });
  }

  private _renderStats(stats: InspectorStats): void {
    if (this._statRows.ds) this._statRows.ds.textContent = String(stats.ds);
    if (this._statRows.antd) this._statRows.antd.textContent = String(stats.antd);
    if (this._statRows.native) this._statRows.native.textContent = String(stats.native);
    const total = stats.ds + stats.antd + stats.native;
    if (this._totalSpan) this._totalSpan.textContent = `총 ${total}`;
    if (this._ratioStrong) {
      const ratio = total === 0 ? 0 : Math.round((stats.ds / total) * 100);
      this._ratioStrong.textContent = `${ratio}%`;
    }
  }
}

define(NdsInspector);
