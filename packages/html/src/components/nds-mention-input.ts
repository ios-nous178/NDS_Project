/**
 * <nds-mention-input> — DS MentionInput 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-mention-input
 *     placeholder="@로 사용자를 멘션할 수 있어요"
 *     users='[{"key":"a","name":"민지","description":"디자이너"},{"key":"b","name":"서연"}]'
 *     label="댓글">
 *   </nds-mention-input>
 *
 * 이벤트:
 *   input-change (detail: { value }) — 텍스트 변경
 *   mention (detail: { user }) — 사용자가 멘션 선택
 *
 * 속성:
 *   value: 입력값 (controlled)
 *   users: JSON 배열 [{ key, name, description? }]
 *   label / placeholder / helper-text / trigger (기본 "@")
 *   error / disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const MI_CLASS = "nds-mention-input";
const MI_LABEL_CLASS = `${MI_CLASS}__label`;
const MI_FIELD_CLASS = `${MI_CLASS}__field`;
const MI_TEXTAREA_CLASS = `${MI_CLASS}__textarea`;
const MI_LIST_CLASS = `${MI_CLASS}__list`;
const MI_ITEM_CLASS = `${MI_CLASS}__item`;
const MI_HELPER_CLASS = `${MI_CLASS}__helper`;

let nextId = 0;

interface MentionUser {
  key: string;
  name: string;
  description?: string;
}

export class NdsMentionInput extends NdsElement {
  static elementName = "nds-mention-input";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "users",
      "label",
      "placeholder",
      "helper-text",
      "trigger",
      "error",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _textarea: HTMLTextAreaElement | null = null;
  private _list: HTMLUListElement | null = null;
  private _helper: HTMLParagraphElement | null = null;
  private _inputId = "";

  private _open = false;
  private _query = "";
  private _activeIdx = 0;
  private _mentionStart = -1;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = `nds-mention-${++nextId}`;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = MI_CLASS;

    const label = document.createElement("label");
    label.className = MI_LABEL_CLASS;
    label.htmlFor = this._inputId;

    const field = document.createElement("div");
    field.className = MI_FIELD_CLASS;

    const textarea = document.createElement("textarea");
    textarea.id = this._inputId;
    textarea.className = MI_TEXTAREA_CLASS;
    textarea.addEventListener("input", () => this._handleInput());
    textarea.addEventListener("keydown", (e) => this._handleKey(e));
    textarea.addEventListener("select", () => this._detectMention());

    const list = document.createElement("ul");
    list.className = MI_LIST_CLASS;
    list.setAttribute("role", "listbox");
    list.style.top = "100%";
    list.style.left = "8px";
    list.style.marginTop = "4px";
    list.style.display = "none";

    field.append(textarea, list);

    const helper = document.createElement("p");
    helper.className = MI_HELPER_CLASS;

    root.append(label, field, helper);
    this.appendChild(root);

    this._root = root;
    this._label = label;
    this._field = field;
    this._textarea = textarea;
    this._list = list;
    this._helper = helper;
  }

  private _parseUsers(): MentionUser[] {
    const raw = this.getAttribute("users");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MentionUser[];
    } catch {
      /* ignore */
    }
    return [];
  }

  private _filtered(): MentionUser[] {
    const users = this._parseUsers();
    if (!this._query) return users;
    const q = this._query.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }

  private _trigger(): string {
    return this.attr("trigger", "@");
  }

  private _detectMention(): void {
    const ta = this._textarea;
    if (!ta) return;
    const text = ta.value;
    const caret = ta.selectionStart ?? text.length;
    const trigger = this._trigger();
    const before = text.slice(0, caret);
    const idx = before.lastIndexOf(trigger);
    if (idx === -1) {
      this._closeList();
      return;
    }
    const prevChar = idx === 0 ? " " : before[idx - 1];
    if (prevChar && !/\s/.test(prevChar)) {
      this._closeList();
      return;
    }
    const q = before.slice(idx + trigger.length);
    if (/\s/.test(q)) {
      this._closeList();
      return;
    }
    this._mentionStart = idx;
    this._query = q;
    this._open = true;
    this._activeIdx = 0;
    this._renderList();
  }

  private _closeList(): void {
    this._open = false;
    this._query = "";
    this._mentionStart = -1;
    this._renderList();
  }

  private _handleInput(): void {
    if (!this._textarea) return;
    const next = this._textarea.value;
    this.setAttribute("value", next);
    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
    this._detectMention();
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this._open) return;
    const filtered = this._filtered();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._activeIdx = Math.min(filtered.length - 1, this._activeIdx + 1);
      this._renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._activeIdx = Math.max(0, this._activeIdx - 1);
      this._renderList();
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (filtered[this._activeIdx]) {
        e.preventDefault();
        this._insert(filtered[this._activeIdx]);
      }
    } else if (e.key === "Escape") {
      this._closeList();
    }
  }

  private _insert(user: MentionUser): void {
    if (this._mentionStart < 0 || !this._textarea) return;
    const trigger = this._trigger();
    const value = this._textarea.value;
    const before = value.slice(0, this._mentionStart);
    const after = value.slice(this._mentionStart + trigger.length + this._query.length);
    const next = `${before}${trigger}${user.name} ${after}`;
    this._textarea.value = next;
    this.setAttribute("value", next);
    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("mention", { detail: { user }, bubbles: true, composed: true }),
    );
    this._closeList();
  }

  private _renderList(): void {
    if (!this._list) return;
    if (!this._open) {
      this._list.style.display = "none";
      this._list.replaceChildren();
      return;
    }
    const filtered = this._filtered();
    if (filtered.length === 0) {
      this._list.style.display = "none";
      this._list.replaceChildren();
      return;
    }
    this._list.style.display = "";
    const items = filtered.slice(0, 6).map((u, i) => {
      const li = document.createElement("li");
      li.className = MI_ITEM_CLASS;
      li.dataset.active = i === this._activeIdx ? "true" : "false";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === this._activeIdx));
      const wrap = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = `@${u.name}`;
      wrap.appendChild(strong);
      if (u.description) {
        const span = document.createElement("span");
        span.textContent = u.description;
        wrap.appendChild(span);
      }
      li.appendChild(wrap);
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this._insert(u);
      });
      li.addEventListener("mouseenter", () => {
        this._activeIdx = i;
        this._renderList();
      });
      return li;
    });
    this._list.replaceChildren(...items);
  }

  protected update(): void {
    if (!this._root || !this._label || !this._field || !this._textarea || !this._helper) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") ?? "";
    const labelText = this.getAttribute("label");
    const placeholder = this.getAttribute("placeholder");
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const disabled = this.boolAttr("disabled");

    if (labelText) {
      this._label.textContent = labelText;
      this._label.style.display = "";
    } else {
      this._label.textContent = "";
      this._label.style.display = "none";
    }

    if (placeholder !== null) this._textarea.placeholder = placeholder;
    else this._textarea.removeAttribute("placeholder");

    this._textarea.disabled = disabled;
    if (this._textarea.value !== value) this._textarea.value = value;

    this._field.dataset.error = error ? "true" : "false";

    if (helperText) {
      this._helper.textContent = helperText;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.style.display = "";
    } else {
      this._helper.textContent = "";
      this._helper.style.display = "none";
    }

    this._renderList();
  }
}

define(NdsMentionInput);
