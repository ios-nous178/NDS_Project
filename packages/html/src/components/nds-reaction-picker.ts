/**
 * <nds-reaction-picker> — DS ReactionPicker 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-reaction-picker
 *     value='["like"]'
 *     options='[
 *       {"key":"like","emoji":"👍","label":"좋아요","count":12},
 *       {"key":"love","emoji":"❤️","label":"공감","count":3},
 *       {"key":"hug","emoji":"🤗","label":"위로","count":1}
 *     ]'
 *   ></nds-reaction-picker>
 *
 * 이벤트:
 *   nds-reaction-change (detail: { value: string[] })
 *
 * 속성:
 *   value: JSON 배열 (선택 키들)
 *   options: JSON 배열 ({ key, emoji, label?, count? })
 *   single: 단일 선택 모드
 *   hide-count: 카운트 숨김
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const RP_CLASS = "nds-reaction-picker";
const RP_ITEM_CLASS = `${RP_CLASS}__item`;
const RP_EMOJI_CLASS = `${RP_CLASS}__emoji`;
const RP_COUNT_CLASS = `${RP_CLASS}__count`;

interface ReactionOption {
  key: string;
  emoji: string;
  label?: string;
  count?: number;
}

export class NdsReactionPicker extends NdsElement {
  static elementName = "nds-reaction-picker";

  static get observedAttributes(): readonly string[] {
    return ["value", "options", "single", "hide-count", "disabled"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.setAttribute("role", "group");
    root.className = RP_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseValue(): Set<string> {
    const raw = this.getAttribute("value");
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map(String));
    } catch {
      return new Set();
    }
  }

  private _parseOptions(): ReactionOption[] {
    const raw = this.getAttribute("options");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((it) => it && typeof it.key === "string")
        .map((it) => ({
          key: String(it.key),
          emoji: typeof it.emoji === "string" ? it.emoji : "",
          label: typeof it.label === "string" ? it.label : undefined,
          count: typeof it.count === "number" ? it.count : undefined,
        }));
    } catch {
      return [];
    }
  }

  private _toggle(key: string): void {
    if (this.boolAttr("disabled")) return;
    const single = this.boolAttr("single");
    const current = this._parseValue();
    let next: string[];
    if (single) {
      next = current.has(key) ? [] : [key];
    } else {
      next = current.has(key)
        ? Array.from(current).filter((v) => v !== key)
        : [...Array.from(current), key];
    }
    this.setAttribute("value", JSON.stringify(next));
    this.dispatchEvent(
      new CustomEvent("nds-reaction-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this._parseValue();
    const options = this._parseOptions();
    const hideCount = this.boolAttr("hide-count");
    const disabled = this.boolAttr("disabled");

    this._root.innerHTML = "";

    options.forEach((opt) => {
      const active = value.has(opt.key);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = RP_ITEM_CLASS;
      btn.dataset.active = active ? "true" : "false";
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", opt.label || opt.key);
      btn.disabled = disabled;
      btn.addEventListener("click", () => this._toggle(opt.key));

      const emoji = document.createElement("span");
      emoji.className = RP_EMOJI_CLASS;
      emoji.setAttribute("aria-hidden", "true");
      emoji.innerHTML = opt.emoji;
      btn.appendChild(emoji);

      if (!hideCount && opt.count !== undefined) {
        const count = document.createElement("span");
        count.className = RP_COUNT_CLASS;
        count.textContent = String(opt.count);
        btn.appendChild(count);
      }

      this._root!.appendChild(btn);
    });
  }
}

define(NdsReactionPicker);
