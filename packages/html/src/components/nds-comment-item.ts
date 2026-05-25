/**
 * <nds-comment-item> — DS CommentItem 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-comment-item author="홍길동" time="3분 전" text="좋은 글이네요!" reply-label="답글">
 *     <nds-avatar slot="avatar" src="/me.jpg"></nds-avatar>
 *     <span slot="badge">상담사</span>
 *     <nds-like-button slot="like"></nds-like-button>
 *     <div slot="more">…</div>
 *     <nds-comment-item slot="replies" is-reply author="..." text="..."></nds-comment-item>
 *   </nds-comment-item>
 *
 * 이벤트:
 *   nds-comment-reply -> 답글 버튼 클릭
 *
 * 속성:
 *   author / time / text
 *   reply-label (default "답글")
 *   show-reply: 답글 버튼 노출
 *   is-reply: 답글 들여쓰기 적용
 */

import { NdsElement, define } from "../base/nds-element.js";

const CI_CLASS = "nds-comment-item";
const CI_AVATAR_CLASS = `${CI_CLASS}__avatar`;
const CI_BODY_CLASS = `${CI_CLASS}__body`;
const CI_HEAD_CLASS = `${CI_CLASS}__head`;
const CI_AUTHOR_CLASS = `${CI_CLASS}__author`;
const CI_TIME_CLASS = `${CI_CLASS}__time`;
const CI_TEXT_CLASS = `${CI_CLASS}__text`;
const CI_ACTIONS_CLASS = `${CI_CLASS}__actions`;
const CI_ACTION_CLASS = `${CI_CLASS}__action`;
const CI_REPLIES_CLASS = `${CI_CLASS}__replies`;

export class NdsCommentItem extends NdsElement {
  static elementName = "nds-comment-item";

  static get observedAttributes(): readonly string[] {
    return ["author", "time", "text", "reply-label", "show-reply", "is-reply"];
  }

  private _root: HTMLDivElement | null = null;
  private _avatarWrap: HTMLDivElement | null = null;
  private _authorEl: HTMLSpanElement | null = null;
  private _badgeWrap: HTMLSpanElement | null = null;
  private _timeEl: HTMLSpanElement | null = null;
  private _moreWrap: HTMLSpanElement | null = null;
  private _textEl: HTMLParagraphElement | null = null;
  private _actions: HTMLDivElement | null = null;
  private _likeWrap: HTMLSpanElement | null = null;
  private _replyBtn: HTMLButtonElement | null = null;
  private _repliesWrap: HTMLDivElement | null = null;
  private _hasAvatar = false;
  private _hasBadge = false;
  private _hasLike = false;
  private _hasMore = false;
  private _hasReplies = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const avatarStash: Node[] = [];
    const badgeStash: Node[] = [];
    const likeStash: Node[] = [];
    const moreStash: Node[] = [];
    const repliesStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "avatar") avatarStash.push(node);
        else if (slot === "badge") badgeStash.push(node);
        else if (slot === "like") likeStash.push(node);
        else if (slot === "more") moreStash.push(node);
        else if (slot === "replies") repliesStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });
    this._hasAvatar = avatarStash.length > 0;
    this._hasBadge = badgeStash.length > 0;
    this._hasLike = likeStash.length > 0;
    this._hasMore = moreStash.length > 0;
    this._hasReplies = repliesStash.length > 0;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CI_CLASS;

    const avatarWrap = document.createElement("div");
    avatarWrap.className = CI_AVATAR_CLASS;
    avatarStash.forEach((n) => avatarWrap.appendChild(n));

    const body = document.createElement("div");
    body.className = CI_BODY_CLASS;

    const head = document.createElement("div");
    head.className = CI_HEAD_CLASS;

    const authorEl = document.createElement("span");
    authorEl.className = CI_AUTHOR_CLASS;

    const badgeWrap = document.createElement("span");
    badgeStash.forEach((n) => badgeWrap.appendChild(n));

    const timeEl = document.createElement("span");
    timeEl.className = CI_TIME_CLASS;

    const moreWrap = document.createElement("span");
    moreWrap.style.marginLeft = "auto";
    moreStash.forEach((n) => moreWrap.appendChild(n));

    head.append(authorEl, badgeWrap, timeEl, moreWrap);

    const textEl = document.createElement("p");
    textEl.className = CI_TEXT_CLASS;

    const actions = document.createElement("div");
    actions.className = CI_ACTIONS_CLASS;

    const likeWrap = document.createElement("span");
    likeStash.forEach((n) => likeWrap.appendChild(n));

    const replyBtn = document.createElement("button");
    replyBtn.type = "button";
    replyBtn.className = CI_ACTION_CLASS;
    replyBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("nds-comment-reply", { bubbles: true, composed: true }));
    });

    actions.append(likeWrap, replyBtn);

    const repliesWrap = document.createElement("div");
    repliesWrap.className = CI_REPLIES_CLASS;
    repliesStash.forEach((n) => repliesWrap.appendChild(n));

    body.append(head, textEl, actions, repliesWrap);

    if (this._hasAvatar) root.appendChild(avatarWrap);
    root.appendChild(body);

    this.appendChild(root);

    this._root = root;
    this._avatarWrap = avatarWrap;
    this._authorEl = authorEl;
    this._badgeWrap = badgeWrap;
    this._timeEl = timeEl;
    this._moreWrap = moreWrap;
    this._textEl = textEl;
    this._actions = actions;
    this._likeWrap = likeWrap;
    this._replyBtn = replyBtn;
    this._repliesWrap = repliesWrap;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._authorEl ||
      !this._badgeWrap ||
      !this._timeEl ||
      !this._moreWrap ||
      !this._textEl ||
      !this._actions ||
      !this._likeWrap ||
      !this._replyBtn ||
      !this._repliesWrap
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const author = this.getAttribute("author") || "";
    const time = this.getAttribute("time");
    const text = this.getAttribute("text") || "";
    const replyLabel = this.getAttribute("reply-label") || "답글";
    const showReply = this.boolAttr("show-reply");
    const isReply = this.boolAttr("is-reply");

    this._root.dataset.reply = isReply ? "true" : "false";
    this._authorEl.textContent = author;
    this._badgeWrap.style.display = this._hasBadge ? "" : "none";

    if (time) {
      this._timeEl.textContent = time;
      this._timeEl.style.display = "";
    } else {
      this._timeEl.style.display = "none";
    }

    this._moreWrap.style.display = this._hasMore ? "" : "none";
    this._textEl.textContent = text;

    this._replyBtn.textContent = replyLabel;
    this._likeWrap.style.display = this._hasLike ? "" : "none";
    this._replyBtn.style.display = showReply ? "" : "none";
    this._actions.style.display = this._hasLike || showReply ? "" : "none";

    this._repliesWrap.style.display = this._hasReplies ? "" : "none";
  }
}

define(NdsCommentItem);
