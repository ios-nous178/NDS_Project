/**
 * <nds-title-block> — DS TitleBlock 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React TitleBlock.tsx 와 동일):
 *   <nds-title-block level="h2" title="안녕" subtitle="반가워"></nds-title-block>
 *     └─ <div class="nds-title-block" data-slot="root" data-level="h2" style="gap: var(--gap-title-h2);">
 *          ├─ <h2 class="nds-title-block__title" data-slot="title" style="font-size:...;line-height:...">안녕</h2>
 *          └─ <p  class="nds-title-block__subtitle" data-slot="subtitle" style="...">반가워</p>
 *
 * title / subtitle attribute 가 없으면 host 의 light DOM 자식을 그대로 사용한다.
 *   <nds-title-block level="h3">
 *     <span slot="title">제목</span>
 *     <span slot="subtitle">설명</span>
 *   </nds-title-block>
 */

import { typeScale } from "@nudge-eap/tokens";

import { NdsElement, define } from "../base/nds-element.js";

const TB_CLASS = "nds-title-block";
const TB_TITLE_CLASS = `${TB_CLASS}__title`;
const TB_SUBTITLE_CLASS = `${TB_CLASS}__subtitle`;

export type TitleBlockLevel = "h1" | "h2" | "h3" | "h4" | "h5";

const LEVEL_CONFIG: Record<
  TitleBlockLevel,
  {
    title: { fontSize: number; lineHeight: number };
    subtitle: { fontSize: number; lineHeight: number };
    gapVar: string;
  }
> = {
  h1: { title: typeScale.headline1, subtitle: typeScale.body3, gapVar: "--gap-title-h1" },
  h2: { title: typeScale.headline2, subtitle: typeScale.body3, gapVar: "--gap-title-h2" },
  h3: { title: typeScale.headline3, subtitle: typeScale.body3, gapVar: "--gap-title-h3" },
  h4: { title: typeScale.headline4, subtitle: typeScale.caption1, gapVar: "--gap-title-h4" },
  h5: { title: typeScale.headline5, subtitle: typeScale.caption1, gapVar: "--gap-title-h5" },
};

const LEVELS = Object.keys(LEVEL_CONFIG) as TitleBlockLevel[];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsTitleBlock extends NdsElement {
  static elementName = "nds-title-block";

  static get observedAttributes(): readonly string[] {
    return ["level", "title", "subtitle", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _titleEl: HTMLElement | null = null;
  private _subtitleEl: HTMLParagraphElement | null = null;
  private _renderedLevel: TitleBlockLevel | null = null;
  private _slotTitle = "";
  private _slotSubtitle = "";

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
      if (slot === "subtitle") this._slotSubtitle = text;
      else if (slot === "title" || slot === null) {
        if (!this._slotTitle) this._slotTitle = text;
      }
    }

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TB_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const level = this._normalizedLevel();
    const config = LEVEL_CONFIG[level];
    const titleText = this.getAttribute("title") ?? this._slotTitle;
    const subtitleText = this.getAttribute("subtitle") ?? this._slotSubtitle;

    this._root.dataset.level = level;
    this._root.style.gap = `var(${config.gapVar})`;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._syncTitle(level, config, titleText);
    this._syncSubtitle(config, subtitleText);
  }

  private _syncTitle(
    level: TitleBlockLevel,
    config: (typeof LEVEL_CONFIG)[TitleBlockLevel],
    text: string,
  ): void {
    if (!this._root) return;
    if (!text) {
      this._titleEl?.remove();
      this._titleEl = null;
      this._renderedLevel = null;
      return;
    }
    if (!this._titleEl || this._renderedLevel !== level) {
      this._titleEl?.remove();
      this._titleEl = document.createElement(level);
      this._titleEl.dataset.slot = "title";
      this._titleEl.className = TB_TITLE_CLASS;
      this._root.prepend(this._titleEl);
      this._renderedLevel = level;
    }
    this._titleEl.style.fontSize = `${config.title.fontSize}px`;
    this._titleEl.style.lineHeight = `${config.title.lineHeight}px`;
    this._titleEl.textContent = text;
  }

  private _syncSubtitle(config: (typeof LEVEL_CONFIG)[TitleBlockLevel], text: string): void {
    if (!this._root) return;
    if (!text) {
      this._subtitleEl?.remove();
      this._subtitleEl = null;
      return;
    }
    if (!this._subtitleEl) {
      this._subtitleEl = document.createElement("p");
      this._subtitleEl.dataset.slot = "subtitle";
      this._subtitleEl.className = TB_SUBTITLE_CLASS;
      this._root.appendChild(this._subtitleEl);
    }
    this._subtitleEl.style.fontSize = `${config.subtitle.fontSize}px`;
    this._subtitleEl.style.lineHeight = `${config.subtitle.lineHeight}px`;
    this._subtitleEl.textContent = text;
  }

  private _normalizedLevel(): TitleBlockLevel {
    const value = this.attr("level", "h2");
    return (LEVELS as readonly string[]).includes(value) ? (value as TitleBlockLevel) : "h2";
  }
}

define(NdsTitleBlock);
