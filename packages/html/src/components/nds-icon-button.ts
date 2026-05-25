/**
 * <nds-icon-button> — Web Component version of React IconButton.
 *
 * DOM:
 *   <nds-icon-button size="large" aria-label="닫기">
 *     <svg>...</svg>  ← children = icon
 *   </nds-icon-button>
 *
 *   → <button class="nds-icon-button" data-slot="root" data-size="large"
 *             style="--nds-icon-button-size:32px; --nds-icon-button-icon-size:24px">
 *       <svg>...</svg>
 *     </button>
 *
 * React DS stylesheet 의 :where(.nds-icon-button) 룰이 그대로 매칭.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type IconButtonSize = "x-large" | "large" | "medium" | "small";

const SIZES: readonly IconButtonSize[] = ["x-large", "large", "medium", "small"];

const sizeConfig: Record<IconButtonSize, { box: number; icon: number }> = {
  "x-large": { box: 36, icon: 28 },
  large: { box: 32, icon: 24 },
  medium: { box: 28, icon: 20 },
  small: { box: 24, icon: 16 },
};

const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-pressed",
  "aria-expanded",
  "aria-controls",
  "aria-haspopup",
  "name",
  "value",
  "form",
  "title",
  "autofocus",
  "tabindex",
] as const;

export class NdsIconButton extends NdsElement {
  static elementName = "nds-icon-button";

  static get observedAttributes(): readonly string[] {
    return ["size", "disabled", "type", ...FORWARDED_ATTRS];
  }

  private _inner: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const inner = document.createElement("button");
    inner.className = "nds-icon-button";
    inner.dataset.slot = "root";
    while (this.firstChild) inner.appendChild(this.firstChild);
    this.appendChild(inner);
    this._inner = inner;
  }

  protected update(): void {
    if (!this._inner) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = this._normalizedSize();
    const disabled = this.boolAttr("disabled");
    const type = this.attr("type", "button");
    const cfg = sizeConfig[size];

    const inner = this._inner;
    inner.disabled = disabled;
    inner.type = type === "submit" || type === "reset" ? type : "button";
    inner.dataset.size = size;
    inner.style.setProperty("--nds-icon-button-size", `${cfg.box}px`);
    inner.style.setProperty("--nds-icon-button-icon-size", `${cfg.icon}px`);

    for (const name of FORWARDED_ATTRS) {
      const v = this.getAttribute(name);
      if (v === null) inner.removeAttribute(name);
      else inner.setAttribute(name, v);
    }
  }

  private _normalizedSize(): IconButtonSize {
    const v = this.attr("size", "large");
    return (SIZES as readonly string[]).includes(v) ? (v as IconButtonSize) : "large";
  }
}

define(NdsIconButton);
