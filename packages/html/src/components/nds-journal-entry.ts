/**
 * <nds-journal-entry> — DS JournalEntry 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-journal-entry date="오늘" title="좋은 하루" body="햇살이..."
 *     mood="😊" tags='["산책","감사"]' thumbnail-src="/x.jpg" clickable>
 *   </nds-journal-entry>
 *
 * clickable 일 때 role="button" + tabindex 0 + Enter/Space 키 처리.
 * body 는 attribute 우선, 없으면 <slot name="body"> 자식 텍스트 사용.
 */

import { NdsElement, define } from "../base/nds-element.js";

const JE_CLASS = "nds-journal-entry";
const JE_MAIN_CLASS = `${JE_CLASS}__main`;
const JE_HEADER_CLASS = `${JE_CLASS}__header`;
const JE_DATE_CLASS = `${JE_CLASS}__date`;
const JE_MOOD_CLASS = `${JE_CLASS}__mood`;
const JE_TITLE_CLASS = `${JE_CLASS}__title`;
const JE_BODY_CLASS = `${JE_CLASS}__body`;
const JE_TAGS_CLASS = `${JE_CLASS}__tags`;
const JE_TAG_CLASS = `${JE_CLASS}__tag`;
const JE_FOOTER_CLASS = `${JE_CLASS}__footer`;
const JE_THUMB_CLASS = `${JE_CLASS}__thumb`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsJournalEntry extends NdsElement {
  static elementName = "nds-journal-entry";

  static get observedAttributes(): readonly string[] {
    return [
      "date",
      "mood",
      "title",
      "body",
      "max-lines",
      "tags",
      "thumbnail-src",
      "footer",
      "clickable",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _bodySlotNode: Element | null = null;
  private _footerSlotNode: Element | null = null;
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this._root?.removeEventListener("keydown", this._onKey);
  }

  private _mount(): void {
    for (const node of Array.from(this.children)) {
      const slot = node.getAttribute("slot");
      if (slot === "body" && !this._bodySlotNode) this._bodySlotNode = node;
      else if (slot === "footer" && !this._footerSlotNode) this._footerSlotNode = node;
    }
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = JE_CLASS;
    root.addEventListener("keydown", this._onKey);
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const clickable = this.boolAttr("clickable");
    this._root.dataset.clickable = clickable ? "true" : "false";
    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.tabIndex = 0;
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    const maxLines = this._intAttr("max-lines", 3);
    this._root.style.setProperty("--nds-journal-lines", String(maxLines));

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const children: Node[] = [this._createMain()];
    const thumb = this._createThumbnail();
    if (thumb) children.push(thumb);
    this._root.replaceChildren(...children);
  }

  private _createMain(): HTMLDivElement {
    const main = document.createElement("div");
    main.className = JE_MAIN_CLASS;

    const header = document.createElement("div");
    header.className = JE_HEADER_CLASS;
    const mood = this.getAttribute("mood");
    if (mood) {
      const moodEl = document.createElement("span");
      moodEl.className = JE_MOOD_CLASS;
      moodEl.setAttribute("aria-hidden", "true");
      moodEl.textContent = mood;
      header.appendChild(moodEl);
    }
    const date = document.createElement("span");
    date.className = JE_DATE_CLASS;
    date.textContent = this.attr("date", "");
    header.appendChild(date);
    main.appendChild(header);

    const titleText = this.getAttribute("title");
    if (titleText) {
      const title = document.createElement("h3");
      title.className = JE_TITLE_CLASS;
      title.textContent = titleText;
      main.appendChild(title);
    }

    const body = document.createElement("p");
    body.className = JE_BODY_CLASS;
    const bodyAttr = this.getAttribute("body");
    if (bodyAttr !== null) body.textContent = bodyAttr;
    else if (this._bodySlotNode) body.textContent = this._bodySlotNode.textContent ?? "";
    main.appendChild(body);

    const tags = this._readTags();
    if (tags.length > 0) {
      const tagsWrap = document.createElement("div");
      tagsWrap.className = JE_TAGS_CLASS;
      for (const tag of tags) {
        const tagEl = document.createElement("span");
        tagEl.className = JE_TAG_CLASS;
        tagEl.textContent = `#${tag}`;
        tagsWrap.appendChild(tagEl);
      }
      main.appendChild(tagsWrap);
    }

    const footerSource = this._footerSlotNode ?? null;
    const footerAttr = this.getAttribute("footer");
    if (footerSource || footerAttr) {
      const footer = document.createElement("div");
      footer.className = JE_FOOTER_CLASS;
      if (footerSource) footer.appendChild(footerSource);
      else if (footerAttr) footer.textContent = footerAttr;
      main.appendChild(footer);
    }

    return main;
  }

  private _createThumbnail(): HTMLImageElement | null {
    const src = this.getAttribute("thumbnail-src");
    if (!src) return null;
    const img = document.createElement("img");
    img.className = JE_THUMB_CLASS;
    img.src = src;
    img.alt = "";
    return img;
  }

  private _readTags(): string[] {
    const attr = this.getAttribute("tags");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((t) => String(t)).filter(Boolean);
    } catch {
      return attr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._root?.click();
    }
  }

  private _intAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
  }
}

define(NdsJournalEntry);
