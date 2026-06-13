/**
 * <nds-heading> — DS Heading 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Heading.tsx 와 동일):
 *   <nds-heading level="h2" title="안녕" description="반가워"></nds-heading>
 *     └─ <div class="nds-heading" data-slot="root" data-level="h2" style="gap: var(--semantic-gap-title-h2);">
 *          ├─ <h2 class="nds-heading__title" data-slot="title" style="font-size:...;line-height:...">안녕</h2>
 *          └─ <p  class="nds-heading__description" data-slot="description" style="...">반가워</p>
 *
 * title / description attribute 가 없으면 host 의 light DOM 자식을 그대로 사용한다.
 *   <nds-heading level="h3">
 *     <span slot="title">제목</span>
 *     <span slot="description">설명</span>
 *   </nds-heading>
 *
 * as: 렌더 태그 override (기본 = level). 비주얼은 level 이 결정, 시맨틱만 바꿀 때.
 */

import { typeScale } from "@nudge-design/tokens";

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const HD_CLASS = "nds-heading";
const HD_TITLE_CLASS = `${HD_CLASS}__title`;
const HD_DESCRIPTION_CLASS = `${HD_CLASS}__description`;

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5";

const LEVEL_CONFIG: Record<
  HeadingLevel,
  {
    title: { fontSize: number; lineHeight: number };
    description: { fontSize: number; lineHeight: number };
    gapVar: string;
  }
> = {
  h1: { title: typeScale.headline1, description: typeScale.body3, gapVar: "--semantic-gap-title-h1" },
  h2: { title: typeScale.headline2, description: typeScale.body3, gapVar: "--semantic-gap-title-h2" },
  h3: { title: typeScale.headline3, description: typeScale.body3, gapVar: "--semantic-gap-title-h3" },
  h4: {
    title: typeScale.headline4,
    description: typeScale.caption1,
    gapVar: "--semantic-gap-title-h4",
  },
  h5: {
    title: typeScale.headline5,
    description: typeScale.caption1,
    gapVar: "--semantic-gap-title-h5",
  },
};

const LEVELS = Object.keys(LEVEL_CONFIG) as HeadingLevel[];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsHeading extends NdsElement {
  static elementName = "nds-heading";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-heading"].observedAttributes, "title", "description", "as", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _titleEl: HTMLElement | null = null;
  private _descriptionEl: HTMLParagraphElement | null = null;
  private _renderedTag: HeadingLevel | null = null;
  private _slotTitle = "";
  private _slotDescription = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 자식 슬롯이 있으면 attribute 보다 우선순위가 낮으므로 한 번만 캡쳐.
    for (const node of Array.from(this.childNodes)) {
      const slot = node instanceof HTMLElement ? node.getAttribute("slot") : null;
      const text = node.textContent?.trim() ?? "";
      if (!text) continue;
      if (slot === "description") this._slotDescription = text;
      else if (slot === "title" || slot === null) {
        if (!this._slotTitle) this._slotTitle = text;
      }
    }

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = HD_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const level = this._normalizedLevel();
    const config = LEVEL_CONFIG[level];
    const titleText = this.getAttribute("title") ?? this._slotTitle;
    const descriptionText = this.getAttribute("description") ?? this._slotDescription;

    this._root.dataset.level = level;
    this._root.style.gap = `var(${config.gapVar})`;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._syncTitle(this._renderTag(), config, titleText);
    this._syncDescription(config, descriptionText);
  }

  /** 렌더 태그 — as override 가 있으면 그것, 없으면 level. 비주얼은 level 이 그대로 결정한다. */
  private _renderTag(): HeadingLevel {
    const value = this.getAttribute("as");
    if (value && (LEVELS as readonly string[]).includes(value)) return value as HeadingLevel;
    return this._normalizedLevel();
  }

  private _syncTitle(
    tag: HeadingLevel,
    config: (typeof LEVEL_CONFIG)[HeadingLevel],
    text: string,
  ): void {
    if (!this._root) return;
    if (!text) {
      this._titleEl?.remove();
      this._titleEl = null;
      this._renderedTag = null;
      return;
    }
    if (!this._titleEl || this._renderedTag !== tag) {
      this._titleEl?.remove();
      this._titleEl = document.createElement(tag);
      this._titleEl.dataset.slot = "title";
      this._titleEl.className = HD_TITLE_CLASS;
      this._root.prepend(this._titleEl);
      this._renderedTag = tag;
    }
    this._titleEl.style.fontSize = `${config.title.fontSize}px`;
    this._titleEl.style.lineHeight = `${config.title.lineHeight}px`;
    this._titleEl.textContent = text;
  }

  private _syncDescription(config: (typeof LEVEL_CONFIG)[HeadingLevel], text: string): void {
    if (!this._root) return;
    if (!text) {
      this._descriptionEl?.remove();
      this._descriptionEl = null;
      return;
    }
    if (!this._descriptionEl) {
      this._descriptionEl = document.createElement("p");
      this._descriptionEl.dataset.slot = "description";
      this._descriptionEl.className = HD_DESCRIPTION_CLASS;
      this._root.appendChild(this._descriptionEl);
    }
    this._descriptionEl.style.fontSize = `${config.description.fontSize}px`;
    this._descriptionEl.style.lineHeight = `${config.description.lineHeight}px`;
    this._descriptionEl.textContent = text;
  }

  private _normalizedLevel(): HeadingLevel {
    const value = this.attr("level", "h2");
    return (LEVELS as readonly string[]).includes(value) ? (value as HeadingLevel) : "h2";
  }
}

define(NdsHeading);
