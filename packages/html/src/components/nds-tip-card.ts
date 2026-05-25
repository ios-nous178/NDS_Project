/**
 * <nds-tip-card> — DS TipCard 의 vanilla Web Component 버전.
 */

import {
  createChevronRightSvg,
  createInfoSvg,
  createTestresultWarningSvg,
  createThumbUpSvg,
} from "@nudge-eap/icons/vanilla";

import { NdsElement, define } from "../base/nds-element.js";

const TC_CLASS = "nds-tip-card";
const TC_ICON_CLASS = `${TC_CLASS}__icon`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__desc`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

export type TipCardTone = "info" | "success" | "warning" | "neutral";

const TONES: readonly TipCardTone[] = ["info", "success", "warning", "neutral"];
const TONE_BG: Record<TipCardTone, string> = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  neutral: "var(--semantic-bg-section-default)",
};
const TONE_FG: Record<TipCardTone, string> = {
  info: "var(--semantic-text-status-info)",
  success: "var(--semantic-text-status-success)",
  warning: "var(--semantic-text-status-caution)",
  neutral: "var(--semantic-text-subtle-default)",
};
const TONE_ICON_BG: Record<TipCardTone, string> = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  neutral: "var(--semantic-text-muted-default)",
};
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsTipCard extends NdsElement {
  static elementName = "nds-tip-card";

  static get observedAttributes(): readonly string[] {
    return [
      "tone",
      "label",
      "tip-title",
      "description",
      "action-label",
      "clickable",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TC_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const tone = this._normalizedTone();
    const clickable = this.boolAttr("clickable");
    this._root.dataset.tone = tone;
    this._root.dataset.clickable = clickable ? "true" : "false";
    this._root.style.setProperty("--nds-tip-bg", TONE_BG[tone]);
    this._root.style.setProperty("--nds-tip-fg", TONE_FG[tone]);
    this._root.style.setProperty("--nds-tip-icon-bg", TONE_ICON_BG[tone]);
    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.tabIndex = 0;
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(this._createIcon(tone), this._createBody(), ...this._createAction());
  }

  private _createIcon(tone: TipCardTone): HTMLSpanElement {
    const icon = document.createElement("span");
    icon.className = TC_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(
      tone === "success"
        ? createThumbUpSvg({ size: 20 })
        : tone === "warning"
          ? createTestresultWarningSvg({ size: 20 })
          : createInfoSvg({ size: 20 }),
    );
    return icon;
  }

  private _createBody(): HTMLDivElement {
    const body = document.createElement("div");
    body.className = TC_BODY_CLASS;
    const label = this.getAttribute("label");
    const title = this.getAttribute("tip-title");
    const description = this.getAttribute("description");
    if (label) body.appendChild(createTextEl("p", TC_LABEL_CLASS, label));
    if (title) body.appendChild(createTextEl("p", TC_TITLE_CLASS, title));
    if (description) body.appendChild(createTextEl("p", TC_DESC_CLASS, description));
    return body;
  }

  private _createAction(): Node[] {
    const actionLabel = this.getAttribute("action-label");
    if (!actionLabel) return [];
    const button = document.createElement("button");
    button.type = "button";
    button.className = TC_ACTION_CLASS;
    button.appendChild(createTextEl("span", "", actionLabel));
    button.appendChild(createChevronRightSvg({ size: 14 }));
    return [button];
  }

  private _normalizedTone(): TipCardTone {
    const value = this.attr("tone", "info");
    return (TONES as readonly string[]).includes(value) ? (value as TipCardTone) : "info";
  }
}

function createTextEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

define(NdsTipCard);
