/**
 * <nds-card> — Web Component version of React Card (단순 컨테이너 MVP).
 *
 * DOM:
 *   <nds-card variant="outlined" clickable>
 *     ...자유로운 자식 markup (그대로 보존)...
 *   </nds-card>
 *
 *   → <div class="nds-card__root" data-slot="root" data-variant="outlined" data-clickable="true">
 *       ...
 *     </div>
 *
 * React Card 의 풍부한 compound API (CardHeader / CardThumbnail / CardCta 등) 는
 * 이번 MVP 에서는 미구현. 사용자/AI 는 nds-card 안에 일반 markup 을 자유롭게 작성하고,
 * React DS stylesheet 의 .nds-card__title / .nds-card__description 등 클래스를
 * 직접 사용하면 같은 스타일이 적용된다.
 *
 * clickable 일 때:
 *   · cursor: pointer + role="button" + tabindex=0 + Enter/Space → "card-click" CustomEvent
 *   · React 의 onClick 콜백 위치
 */

import { NdsElement, define } from "../base/nds-element.js";

export type CardVariant = "outlined" | "flat";

const VARIANTS: readonly CardVariant[] = ["outlined", "flat"];

export class NdsCard extends NdsElement {
  static elementName = "nds-card";

  static get observedAttributes(): readonly string[] {
    return ["variant", "clickable"];
  }

  private _root: HTMLDivElement | null = null;
  private _onClick = (_e: MouseEvent) => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(new CustomEvent("card-click", { bubbles: true, composed: true }));
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("card-click", { bubbles: true, composed: true }));
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
    const root = document.createElement("div");
    root.className = "nds-card__root";
    root.dataset.slot = "root";
    while (this.firstChild) root.appendChild(this.firstChild);
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = this._norm("variant", VARIANTS, "flat");
    const clickable = this.boolAttr("clickable");

    const root = this._root;
    root.dataset.variant = variant;
    root.dataset.clickable = String(clickable);

    if (clickable) {
      root.setAttribute("role", "button");
      root.setAttribute("tabindex", "0");
    } else {
      root.removeAttribute("role");
      root.removeAttribute("tabindex");
    }
  }

  private _norm<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(name, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

/* ──────────────── compound sub-elements ──────────────── */
/**
 * <nds-card-header> / <nds-card-body> / <nds-card-footer> / <nds-card-thumbnail>
 *
 * 모두 단순 div wrapper — host 안에 <div class="nds-card__{slot}"> 만 만든다.
 * React Card 의 stylesheet 룰 (.nds-card__header { ... } 등) 이 그대로 매칭.
 * children 은 그대로 보존. thumbnail 만 ratio attribute 지원.
 */

abstract class CardSlot extends NdsElement {
  protected abstract slotClass: string;
  protected abstract slotName: string;

  protected _inner: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) {
      const inner = document.createElement("div");
      inner.className = this.slotClass;
      inner.dataset.slot = this.slotName;
      while (this.firstChild) inner.appendChild(this.firstChild);
      this.appendChild(inner);
      this._inner = inner;
    }
    super.connectedCallback();
  }

  protected update(): void {
    if (!this._inner) return;
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

export class NdsCardHeader extends CardSlot {
  static elementName = "nds-card-header";
  protected slotClass = "nds-card__header";
  protected slotName = "header";
}

export class NdsCardBody extends CardSlot {
  static elementName = "nds-card-body";
  protected slotClass = "nds-card__body";
  protected slotName = "body";
}

export class NdsCardFooter extends CardSlot {
  static elementName = "nds-card-footer";
  protected slotClass = "nds-card__footer";
  protected slotName = "footer";
}

export class NdsCardThumbnail extends CardSlot {
  static elementName = "nds-card-thumbnail";
  protected slotClass = "nds-card__thumbnail";
  protected slotName = "thumbnail";

  static get observedAttributes(): readonly string[] {
    return ["ratio"];
  }

  protected override update(): void {
    super.update();
    if (!this._inner) return;
    if (this.boolAttr("ratio")) this._inner.dataset.ratio = "true";
    else delete this._inner.dataset.ratio;
  }
}

define(NdsCard);
define(NdsCardHeader);
define(NdsCardBody);
define(NdsCardFooter);
define(NdsCardThumbnail);
