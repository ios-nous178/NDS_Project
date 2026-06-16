/**
 * <nds-list> + <nds-list-item> — Web Component version of React List/ListItem.
 *
 * DOM:
 *   <nds-list variant="card">
 *     <nds-list-item interactive size="md">
 *       <span class="nds-list-item__leading">📦</span>
 *       <div class="nds-list-item__body">
 *         <span class="nds-list-item__title">A</span>
 *         <span class="nds-list-item__description">B</span>
 *       </div>
 *       <span class="nds-list-item__trailing">→</span>
 *     </nds-list-item>
 *   </nds-list>
 *
 *   → <ul class="nds-list__root" data-slot="root" data-variant="card" data-platform="mobile">
 *       <li class="nds-list-item" data-slot="item" data-size="md" data-layout="default" data-interactive="true">
 *         ... (children 그대로)
 *       </li>
 *     </ul>
 *
 * Trost 가이드 (opt-in):
 *   <nds-list platform="pc"> · <nds-list-item layout="table|avatar|thumbnail|compact|action|default">.
 *   layout 명시 시 li 에 data-layout-explicit="true" 가 붙어 새 밀도/인셋divider/PC 룰이 발화한다.
 *   table layout 은 consumer 가 body 에 data-layout="table" + 컬럼 span(data-col="name|status") 을 직접 author.
 *   size 는 폐기 별칭으로 유지(md→default · lg→avatar · xl→thumbnail · sm→compact).
 *
 * 이벤트:
 *   interactive 인 nds-list-item 클릭/Enter/Space → "list-item-select" CustomEvent (bubbles).
 *
 * MVP 정책:
 *   leading/title/description/trailing slot 자동 구성은 미구현.
 *   사용자가 자식 markup 으로 직접 nds-list-item__* 클래스를 사용한다.
 *   추후 attribute 기반 (title="..." description="...") 자동 구성 추가 예정.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

export type ListVariant = "plain" | "card" | "divided";
/** @deprecated layout 의 별칭 — Trost 가이드는 layout 사용. */
export type ListItemSize = "sm" | "md" | "lg" | "xl";
export type ListPlatform = "mobile" | "pc";
export type ListItemLayout = "default" | "avatar" | "thumbnail" | "action" | "compact" | "table";

const LIST_VARIANTS: readonly ListVariant[] = ["plain", "card", "divided"];
const ITEM_SIZES: readonly ListItemSize[] = ["sm", "md", "lg", "xl"];
const LIST_PLATFORMS: readonly ListPlatform[] = ["mobile", "pc"];
const ITEM_LAYOUTS: readonly ListItemLayout[] = [
  "default",
  "avatar",
  "thumbnail",
  "action",
  "compact",
  "table",
];

/** 폐기 size → layout 매핑 (react 미러). */
const SIZE_TO_LAYOUT: Record<ListItemSize, ListItemLayout> = {
  md: "default",
  lg: "avatar",
  xl: "thumbnail",
  sm: "compact",
};

export class NdsList extends NdsElement {
  static elementName = "nds-list";

  static get observedAttributes(): readonly string[] {
    // COMPONENT_ATTRS(catalog 파생) 에 "platform" 이 반영되기 전까지 인라인 보강.
    // (react ListProps.platform 추가분 — 카탈로그 재생성 시 중복돼도 무해)
    return [...COMPONENT_ATTRS["nds-list"].observedAttributes, "platform"];
  }

  private _root: HTMLUListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const ul = document.createElement("ul");
    ul.className = "nds-list__root";
    ul.dataset.slot = "root";
    ul.setAttribute("role", "list");

    // slot="header" / slot="footer" 자식은 presentation li 로 분리해 상/하단에 고정.
    let header: HTMLLIElement | null = null;
    let footer: HTMLLIElement | null = null;
    const slotted = Array.from(this.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        (el.getAttribute("slot") === "header" || el.getAttribute("slot") === "footer"),
    );
    for (const el of slotted) {
      const which = el.getAttribute("slot");
      el.removeAttribute("slot");
      const li = document.createElement("li");
      li.className = `nds-list__${which}`;
      li.dataset.slot = which!;
      li.setAttribute("role", "presentation");
      li.appendChild(el);
      if (which === "header") header = li;
      else footer = li;
    }

    if (header) ul.appendChild(header);
    while (this.firstChild) ul.appendChild(this.firstChild);
    if (footer) ul.appendChild(footer);
    this.appendChild(ul);
    this._root = ul;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    const variant = this.attr("variant", "plain");
    this._root.dataset.variant = (LIST_VARIANTS as readonly string[]).includes(variant)
      ? variant
      : "plain";
    const platform = this.attr("platform", "mobile");
    this._root.dataset.platform = (LIST_PLATFORMS as readonly string[]).includes(platform)
      ? platform
      : "mobile";
  }
}

export class NdsListItem extends NdsElement {
  static elementName = "nds-list-item";

  static get observedAttributes(): readonly string[] {
    return ["size", "layout", "interactive", "active", "disabled"];
  }

  private _root: HTMLLIElement | null = null;
  private _onClick = (_e: MouseEvent) => {
    if (this.boolAttr("disabled") || !this.boolAttr("interactive")) return;
    this.dispatchEvent(new CustomEvent("list-item-select", { bubbles: true, composed: true }));
  };
  private _onKey = (e: KeyboardEvent) => {
    if (this.boolAttr("disabled") || !this.boolAttr("interactive")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("list-item-select", { bubbles: true, composed: true }));
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._root) {
      this._root.removeEventListener("click", this._onClick);
      this._root.removeEventListener("keydown", this._onKey);
    }
  }

  private _mount(): void {
    const li = document.createElement("li");
    li.className = "nds-list-item";
    li.dataset.slot = "item";
    while (this.firstChild) li.appendChild(this.firstChild);
    li.addEventListener("click", this._onClick);
    li.addEventListener("keydown", this._onKey);
    this.appendChild(li);
    this._root = li;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = this.attr("size", "md");
    const layoutAttr = this.attr("layout", "");
    const interactive = this.boolAttr("interactive");
    const active = this.boolAttr("active");
    const disabled = this.boolAttr("disabled");

    const li = this._root;
    const safeSize = (ITEM_SIZES as readonly string[]).includes(size) ? size : "md";
    li.dataset.size = safeSize;
    // layout 명시 시 새 [data-platform][data-layout] 룰 발화, 미명시면 폐기 size 별칭(렌더 불변).
    const layoutOptIn = (ITEM_LAYOUTS as readonly string[]).includes(layoutAttr);
    const resolvedLayout = layoutOptIn
      ? layoutAttr
      : SIZE_TO_LAYOUT[safeSize as ListItemSize];
    li.dataset.layout = resolvedLayout;
    if (layoutOptIn) li.dataset.layoutExplicit = "true";
    else delete li.dataset.layoutExplicit;
    li.dataset.interactive = String(interactive);
    li.dataset.active = String(active);
    li.dataset.disabled = String(disabled);

    if (interactive) {
      li.setAttribute("role", "button");
      if (!disabled) li.setAttribute("tabindex", "0");
      else li.removeAttribute("tabindex");
    } else {
      li.removeAttribute("role");
      li.removeAttribute("tabindex");
    }
    if (disabled) li.setAttribute("aria-disabled", "true");
    else li.removeAttribute("aria-disabled");
  }
}

define(NdsList);
define(NdsListItem);
