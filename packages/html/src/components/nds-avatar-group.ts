/**
 * <nds-avatar-group> — DS AvatarGroup 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-avatar-group max="3" size="md"
 *     items='[{"name":"홍길동"},{"name":"이몽룡","src":"/a.png"},{"name":"성춘향"}]'>
 *   </nds-avatar-group>
 *
 *   또는 (선언적 자식 패턴):
 *     <nds-avatar-group max="3" size="md">
 *       <nds-avatar name="홍길동"></nds-avatar>
 *       <nds-avatar name="이몽룡" src="/a.png"></nds-avatar>
 *       <nds-avatar name="성춘향"></nds-avatar>
 *     </nds-avatar-group>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

import type { AvatarShape, AvatarSize } from "./nds-avatar.js";

const AG_CLASS = "nds-avatar-group";
const AG_ITEM_CLASS = `${AG_CLASS}__item`;
const AG_MORE_CLASS = `${AG_CLASS}__more`;

const AVATAR_SIZES: readonly AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];
const AVATAR_SHAPES: readonly AvatarShape[] = ["square", "rounded", "circle"];

// Figma 1337:8 스케일 — React Avatar.tsx avatarSizeConfig / AvatarGroup sizeOverlap 와 1:1.
const SIZE_OVERLAP: Record<AvatarSize, number> = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
};

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const SIZE_MORE_FONT: Record<AvatarSize, number> = {
  xs: 11,
  sm: 14,
  md: 20,
  lg: 26,
  xl: 38,
};

interface AvatarGroupItem {
  src?: string;
  name?: string;
  alt?: string;
}

const FORWARDED_ATTRS = ["aria-labelledby", "title"] as const;

export class NdsAvatarGroup extends NdsElement {
  static elementName = "nds-avatar-group";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-avatar-group"].observedAttributes, "aria-label", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _sourceItems: AvatarGroupItem[] = [];

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._sourceItems = this._readChildAvatars();

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AG_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._readItems();
    const max = this._intAttr("max", 4);
    const size = this._normalizedSize();
    const shape = this._normalizedShape();
    const overlap = this._intAttr("overlap", SIZE_OVERLAP[size]);
    const moreSize = SIZE_PX[size];
    const moreFont = SIZE_MORE_FONT[size];

    this._root.style.setProperty("--nds-avatar-group-overlap", `${overlap}px`);
    this._root.style.setProperty("--nds-avatar-group-more-size", `${moreSize}px`);
    this._root.style.setProperty("--nds-avatar-group-more-font", `${moreFont}px`);

    const ariaLabel = this.getAttribute("aria-label") ?? `총 ${items.length}명`;
    this._root.setAttribute("aria-label", ariaLabel);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const visible = items.slice(0, Math.max(0, max));
    const remaining = items.length - visible.length;
    const children: Node[] = visible.map((item) => this._createAvatar(item, size, shape));
    if (remaining > 0) children.push(this._createMore(remaining));
    this._root.replaceChildren(...children);
  }

  private _readItems(): AvatarGroupItem[] {
    const attr = this.getAttribute("items");
    if (attr && attr.trim()) {
      try {
        const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
        if (Array.isArray(parsed)) {
          return parsed.map((raw) => ({
            src: typeof raw.src === "string" ? raw.src : undefined,
            name: typeof raw.name === "string" ? raw.name : undefined,
            alt: typeof raw.alt === "string" ? raw.alt : undefined,
          }));
        }
      } catch {
        /* fall through to child source */
      }
    }
    return this._sourceItems;
  }

  private _readChildAvatars(): AvatarGroupItem[] {
    const items: AvatarGroupItem[] = [];
    for (const node of Array.from(this.children)) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.tagName.toLowerCase() !== "nds-avatar") continue;
      items.push({
        src: node.getAttribute("src") ?? undefined,
        name: node.getAttribute("name") ?? undefined,
        alt: node.getAttribute("alt") ?? undefined,
      });
    }
    return items;
  }

  private _createAvatar(item: AvatarGroupItem, size: AvatarSize, shape: AvatarShape): HTMLElement {
    const avatar = document.createElement("nds-avatar");
    avatar.classList.add(AG_ITEM_CLASS);
    avatar.setAttribute("size", size);
    avatar.setAttribute("shape", shape);
    if (item.src) avatar.setAttribute("src", item.src);
    if (item.name) avatar.setAttribute("name", item.name);
    const alt = item.alt ?? item.name ?? "";
    avatar.setAttribute("alt", alt);
    return avatar;
  }

  private _createMore(remaining: number): HTMLSpanElement {
    const more = document.createElement("span");
    more.className = AG_MORE_CLASS;
    more.setAttribute("aria-label", `외 ${remaining}명`);
    more.textContent = `+${remaining}`;
    return more;
  }

  private _normalizedSize(): AvatarSize {
    const value = this.attr("size", "md");
    return (AVATAR_SIZES as readonly string[]).includes(value) ? (value as AvatarSize) : "md";
  }

  private _normalizedShape(): AvatarShape {
    const value = this.attr("shape", "circle");
    return (AVATAR_SHAPES as readonly string[]).includes(value) ? (value as AvatarShape) : "circle";
  }

  private _intAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
  }
}

define(NdsAvatarGroup);
