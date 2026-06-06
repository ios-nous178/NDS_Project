/**
 * <nds-tabs> + sub-elements — DS Tabs 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-tabs active-key="home" variant="line" size="mobile" tone="neutral">
 *     <nds-tabs-list>
 *       <nds-tabs-trigger key="home">홈</nds-tabs-trigger>
 *       <nds-tabs-trigger key="profile">프로필</nds-tabs-trigger>
 *     </nds-tabs-list>
 *     <nds-tabs-panel key="home">홈 내용</nds-tabs-panel>
 *     <nds-tabs-panel key="profile">프로필 내용</nds-tabs-panel>
 *   </nds-tabs>
 *
 * 이벤트:
 *   trigger 클릭/Enter/Space/Arrow → 부모 nds-tabs 의 active-key 변경 +
 *   부모에서 "tabs-change" CustomEvent (detail: { activeKey }) 디스패치 (bubbles).
 *
 * MVP 제약:
 *   variant: "line" | "chip" (구 "segment" 는 SegmentedControl 로 이관·폐지).
 *   indicator (line variant) measurement 는 active trigger 의 offsetLeft/offsetWidth 사용.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type TabsVariant = "line" | "chip";
export type TabsSize = "mobile" | "pc";
export type TabsTone = "neutral" | "color";

const VARIANTS: readonly TabsVariant[] = ["line", "chip"];
const SIZES: readonly TabsSize[] = ["mobile", "pc"];
const TONES: readonly TabsTone[] = ["neutral", "color"];

const TABS_ROOT_CLASS = "nds-tabs__root";
const TABS_LIST_CLASS = "nds-tabs__list";
const TABS_TRIGGER_CLASS = "nds-tabs__trigger";
const TABS_TRIGGER_INNER_CLASS = "nds-tabs__trigger-inner";
const TABS_INDICATOR_CLASS = "nds-tabs__indicator";
const TABS_PANEL_CLASS = "nds-tabs__panel";

let nextBaseId = 0;

function triggerId(base: string, key: string): string {
  return `${base}-trigger-${key}`;
}

function panelId(base: string, key: string): string {
  return `${base}-panel-${key}`;
}

/** active trigger 의 offsetLeft / offsetWidth 로 indicator transform. */
function applyIndicatorStyle(indicator: HTMLElement, active: HTMLElement | null): void {
  if (!active) {
    indicator.style.transform = "";
    indicator.style.width = "";
    return;
  }
  indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  indicator.style.width = `${active.offsetWidth}px`;
}

/* ──────────────── <nds-tabs> ──────────────── */

export class NdsTabs extends NdsElement {
  static elementName = "nds-tabs";

  static get observedAttributes(): readonly string[] {
    return ["active-key", "variant", "size", "tone", "full-width", "base-id"];
  }

  private _root: HTMLDivElement | null = null;
  private _baseId = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._baseId = this.attr("base-id", `nds-tabs-${++nextBaseId}`);
    const root = document.createElement("div");
    root.className = TABS_ROOT_CLASS;
    root.dataset.slot = "root";
    while (this.firstChild) root.appendChild(this.firstChild);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const root = this._root;
    root.style.setProperty("--nds-tabs-width", this.boolAttr("full-width") ? "100%" : "auto");

    // 자식 trigger/panel 에게 active-key 와 base id 전달 → 각자 갱신.
    this._notifyChildren();
  }

  private _notifyChildren(): void {
    if (!this._root) return;
    const activeKey = this.getAttribute("active-key") ?? "";
    const variant = this._norm("variant", VARIANTS, "line");
    const size = this._norm("size", SIZES, "mobile");
    const tone = this._norm("tone", TONES, "neutral");

    // list 와 trigger 들
    const lists = this._root.querySelectorAll<NdsTabsList>("nds-tabs-list");
    lists.forEach((l) => l.applyParentState(variant, size, tone));

    const triggers = this._root.querySelectorAll<NdsTabsTrigger>("nds-tabs-trigger");
    triggers.forEach((t) => t.applyParentState(this._baseId, activeKey));

    const panels = this._root.querySelectorAll<NdsTabsPanel>("nds-tabs-panel");
    panels.forEach((p) => p.applyParentState(this._baseId, activeKey));

    // indicator 위치 갱신 (microtask 다음에 — child reflect 끝난 뒤)
    queueMicrotask(() => {
      const list = this._root?.querySelector<HTMLUListElement>("ul." + TABS_LIST_CLASS);
      const indicator = list?.querySelector<HTMLSpanElement>("span." + TABS_INDICATOR_CLASS);
      if (!list || !indicator) return;
      const active = list.querySelector<HTMLElement>('[data-active="true"]');
      applyIndicatorStyle(indicator, active);
    });
  }

  /** trigger 가 호출 — active-key 변경 후 이벤트 디스패치. */
  selectKey(key: string): void {
    if (this.getAttribute("active-key") === key) return;
    this.setAttribute("active-key", key);
    this.dispatchEvent(
      new CustomEvent("tabs-change", { detail: { activeKey: key }, bubbles: true, composed: true }),
    );
  }

  private _norm<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(name, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

/* ──────────────── <nds-tabs-list> ──────────────── */

export class NdsTabsList extends NdsElement {
  static elementName = "nds-tabs-list";

  static get observedAttributes(): readonly string[] {
    return [];
  }

  private _ul: HTMLUListElement | null = null;
  private _indicator: HTMLSpanElement | null = null;
  private _variant: TabsVariant = "line";
  private _size: TabsSize = "mobile";
  private _tone: TabsTone = "neutral";

  override connectedCallback(): void {
    if (!this._ul) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const ul = document.createElement("ul");
    ul.className = TABS_LIST_CLASS;
    ul.dataset.slot = "list";
    ul.setAttribute("role", "tablist");
    while (this.firstChild) ul.appendChild(this.firstChild);
    this.appendChild(ul);
    this._ul = ul;
  }

  protected update(): void {
    if (!this._ul) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    this._applyDataset();
    this._syncIndicator();
  }

  applyParentState(variant: TabsVariant, size: TabsSize, tone: TabsTone): void {
    this._variant = variant;
    this._size = size;
    this._tone = tone;
    this._applyDataset();
    this._syncIndicator();
  }

  private _applyDataset(): void {
    if (!this._ul) return;
    this._ul.dataset.variant = this._variant;
    this._ul.dataset.size = this._size;
    this._ul.dataset.tone = this._tone;
  }

  private _syncIndicator(): void {
    if (!this._ul) return;
    const needIndicator = this._variant === "line";
    if (needIndicator && !this._indicator) {
      const span = document.createElement("span");
      span.className = TABS_INDICATOR_CLASS;
      span.dataset.slot = "indicator";
      span.setAttribute("aria-hidden", "true");
      this._ul.appendChild(span);
      this._indicator = span;
    } else if (!needIndicator && this._indicator) {
      this._indicator.remove();
      this._indicator = null;
    }
  }
}

/* ──────────────── <nds-tabs-trigger> ──────────────── */

export class NdsTabsTrigger extends NdsElement {
  static elementName = "nds-tabs-trigger";

  static get observedAttributes(): readonly string[] {
    return ["key", "disabled"];
  }

  private _li: HTMLLIElement | null = null;
  private _baseId = "";
  private _activeKey = "";
  private _onClick = (_e: MouseEvent) => this._activate();
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);

  override connectedCallback(): void {
    if (!this._li) this._mount();
    // 부모 nds-tabs / nds-tabs-list 의 _mount() 가 자식을 reparent 하면
    // 이 trigger 도 disconnect→reconnect 됩니다. 리스너를 host element 자체에
    // 달면 light DOM bubble 로 li 클릭이 그대로 잡히고, addEventListener 가
    // 같은 (type, listener) 에 idempotent 이므로 재mount 가드와 무관하게 안전.
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKey);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKey);
  }

  private _mount(): void {
    const li = document.createElement("li");
    li.className = TABS_TRIGGER_CLASS;
    li.dataset.slot = "trigger";
    li.setAttribute("role", "tab");

    const inner = document.createElement("span");
    inner.className = TABS_TRIGGER_INNER_CLASS;
    const label = document.createElement("span");
    while (this.firstChild) label.appendChild(this.firstChild);
    inner.appendChild(label);
    li.appendChild(inner);

    this.appendChild(li);
    this._li = li;
  }

  applyParentState(baseId: string, activeKey: string): void {
    this._baseId = baseId;
    this._activeKey = activeKey;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._li) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const key = this.attr("key", "");
    const disabled = this.boolAttr("disabled");
    const active = key !== "" && key === this._activeKey;
    const li = this._li;

    li.dataset.active = String(active);
    li.dataset.disabled = String(disabled);
    li.dataset.tabKey = key;
    if (this._baseId && key) {
      li.id = triggerId(this._baseId, key);
      li.setAttribute("aria-controls", panelId(this._baseId, key));
    }
    li.setAttribute("aria-selected", String(active));
    if (disabled) li.setAttribute("aria-disabled", "true");
    else li.removeAttribute("aria-disabled");
    li.tabIndex = disabled ? -1 : active ? 0 : -1;
  }

  private _activate(): void {
    if (this.boolAttr("disabled")) return;
    const key = this.attr("key", "");
    if (!key) return;
    const parent = this.closest<NdsTabs>("nds-tabs");
    parent?.selectKey(key);
  }

  private _handleKey(e: KeyboardEvent): void {
    if (this.boolAttr("disabled")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._activate();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = this.closest('[role="tablist"]');
      if (!list) return;
      const triggers = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
        (el) => el.getAttribute("aria-disabled") !== "true",
      );
      if (triggers.length === 0) return;
      const idx = triggers.indexOf(this._li!);
      let nextIdx = idx;
      if (e.key === "ArrowRight") nextIdx = (idx + 1) % triggers.length;
      else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + triggers.length) % triggers.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = triggers.length - 1;
      const nextLi = triggers[nextIdx];
      nextLi?.focus();
      const nextKey = nextLi?.dataset.tabKey;
      if (nextKey) this.closest<NdsTabs>("nds-tabs")?.selectKey(nextKey);
    }
  }
}

/* ──────────────── <nds-tabs-panel> ──────────────── */

export class NdsTabsPanel extends NdsElement {
  static elementName = "nds-tabs-panel";

  static get observedAttributes(): readonly string[] {
    return ["key"];
  }

  private _div: HTMLDivElement | null = null;
  private _baseId = "";
  private _activeKey = "";

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = TABS_PANEL_CLASS;
    div.dataset.slot = "panel";
    div.setAttribute("role", "tabpanel");
    div.tabIndex = 0;
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  applyParentState(baseId: string, activeKey: string): void {
    this._baseId = baseId;
    this._activeKey = activeKey;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const key = this.attr("key", "");
    const hidden = key === "" || key !== this._activeKey;
    this._div.dataset.hidden = String(hidden);
    if (this._baseId && key) {
      this._div.id = panelId(this._baseId, key);
      this._div.setAttribute("aria-labelledby", triggerId(this._baseId, key));
    }
  }
}

define(NdsTabs);
define(NdsTabsList);
define(NdsTabsTrigger);
define(NdsTabsPanel);
