/**
 * <nds-chat-bubble> — DS ChatBubble 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-chat-bubble role="them" name="홍길동" time="오후 3:24" group="first" avatar-src="/profile.png">
 *     오늘 기분 어때요?
 *   </nds-chat-bubble>
 *
 *   <nds-chat-bubble role="me" time="오후 3:25" read>
 *     좋아요!
 *   </nds-chat-bubble>
 *
 * children 은 bubble 본문으로 그대로 들어간다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const CB_CLASS = "nds-chat-bubble";
const CB_ROW_CLASS = `${CB_CLASS}__row`;
const CB_AVATAR_CLASS = `${CB_CLASS}__avatar`;
const CB_BODY_CLASS = `${CB_CLASS}__body`;
const CB_NAME_CLASS = `${CB_CLASS}__name`;
const CB_BUBBLE_CLASS = `${CB_CLASS}__bubble`;
const CB_META_CLASS = `${CB_CLASS}__meta`;
const CB_TIME_CLASS = `${CB_CLASS}__time`;
const CB_READ_CLASS = `${CB_CLASS}__read`;

export type ChatRole = "me" | "them";
export type ChatGroupPosition = "single" | "first" | "middle" | "last";

const ROLES: readonly ChatRole[] = ["me", "them"];
const GROUPS: readonly ChatGroupPosition[] = ["single", "first", "middle", "last"];

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

function initialsOf(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export class NdsChatBubble extends NdsElement {
  static elementName = "nds-chat-bubble";

  static get observedAttributes(): readonly string[] {
    return ["role", "group", "time", "name", "avatar-src", "read", "message", ...FORWARDED_ATTRS];
  }

  private _row: HTMLDivElement | null = null;
  private _bubbleInner: HTMLDivElement | null = null;
  private _bodySource = document.createDocumentFragment();

  override connectedCallback(): void {
    if (!this._row) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    while (this.firstChild) this._bodySource.appendChild(this.firstChild);

    const row = document.createElement("div");
    row.dataset.slot = "row";
    row.className = CB_ROW_CLASS;
    this.appendChild(row);
    this._row = row;
  }

  protected update(): void {
    if (!this._row) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const role = this._normalizedRole();
    const group = this._normalizedGroup();
    this._row.dataset.role = role;
    this._row.dataset.group = group;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._row.removeAttribute(name);
      else this._row.setAttribute(name, value);
    }

    const children: Node[] = [];
    const avatar = this._createAvatar(role, group);
    if (avatar) children.push(avatar);
    children.push(this._createBody(role, group));
    this._row.replaceChildren(...children);
  }

  private _createAvatar(role: ChatRole, group: ChatGroupPosition): HTMLSpanElement | null {
    if (role !== "them") return null;
    const span = document.createElement("span");
    span.dataset.slot = "avatar";
    span.className = CB_AVATAR_CLASS;
    span.setAttribute("aria-hidden", "true");
    const hidden = group !== "single" && group !== "last";
    if (hidden) span.dataset.hidden = "true";

    const src = this.getAttribute("avatar-src");
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      span.appendChild(img);
    } else {
      span.textContent = initialsOf(this.getAttribute("name") ?? "");
    }
    return span;
  }

  private _createBody(role: ChatRole, group: ChatGroupPosition): HTMLDivElement {
    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = CB_BODY_CLASS;

    const name = this.getAttribute("name");
    const showName = role === "them" && !!name && (group === "single" || group === "first");
    if (showName) {
      const nameEl = document.createElement("span");
      nameEl.dataset.slot = "name";
      nameEl.className = CB_NAME_CLASS;
      nameEl.textContent = name ?? "";
      body.appendChild(nameEl);
    }

    const bubble = document.createElement("div");
    bubble.dataset.slot = "bubble";
    bubble.className = CB_BUBBLE_CLASS;
    const messageAttr = this.getAttribute("message");
    if (messageAttr !== null) {
      bubble.textContent = messageAttr;
    } else {
      // 첫 update 에서만 원본 children 을 옮긴다. 이후 update 에서는
      // 기존 bubble 내부를 보존하기 위해 새 bubble 에 그대로 transfer.
      if (this._bubbleInner) {
        while (this._bubbleInner.firstChild) bubble.appendChild(this._bubbleInner.firstChild);
      } else {
        bubble.appendChild(this._bodySource);
      }
    }
    body.appendChild(bubble);
    this._bubbleInner = bubble;

    const time = this.getAttribute("time");
    const read = this.boolAttr("read");
    const showTime = !!time && (group === "single" || group === "last");
    const showRead = role === "me" && read;

    if (showTime || showRead) {
      const meta = document.createElement("div");
      meta.dataset.slot = "meta";
      meta.className = CB_META_CLASS;

      if (showRead) {
        const r = document.createElement("span");
        r.dataset.slot = "read";
        r.className = CB_READ_CLASS;
        r.textContent = "읽음";
        meta.appendChild(r);
      }
      if (showTime) {
        const t = document.createElement("span");
        t.dataset.slot = "time";
        t.className = CB_TIME_CLASS;
        t.textContent = time;
        meta.appendChild(t);
      }
      body.appendChild(meta);
    }

    return body;
  }

  private _normalizedRole(): ChatRole {
    const value = this.attr("role", "them");
    return (ROLES as readonly string[]).includes(value) ? (value as ChatRole) : "them";
  }

  private _normalizedGroup(): ChatGroupPosition {
    const value = this.attr("group", "single");
    return (GROUPS as readonly string[]).includes(value) ? (value as ChatGroupPosition) : "single";
  }
}

define(NdsChatBubble);
