/**
 * <nds-share-sheet> — DS ShareSheet 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-share-sheet
 *     open
 *     sheet-title="공유하기"
 *     description="아래 채널로 공유할 수 있습니다."
 *     targets='[
 *       {"key":"kakao","label":"카카오톡","emoji":"💬","bg":"#FAE100"},
 *       {"key":"link","label":"링크 복사","emoji":"🔗"}
 *     ]'
 *     link="https://nudge-eap.com/p/123"
 *   ></nds-share-sheet>
 *
 * 이벤트:
 *   nds-share-target (detail: { key }) -> 타겟 선택
 *   nds-share-close -> 닫기
 *   nds-share-link-copied -> 링크 복사 완료
 *
 * 속성:
 *   open: 표시
 *   sheet-title (default "공유하기")
 *   description
 *   targets: JSON 배열 ({ key, label, emoji, bg? })
 *   link: 복사 가능한 링크 (있을 때만 하단 인풋 노출)
 *   copied-label (default "복사됨")
 *   close-on-backdrop-click (default true)
 */

import { NdsElement, define } from "../base/nds-element.js";

const SS_CLASS = "nds-share-sheet";
const SS_BACKDROP_CLASS = `${SS_CLASS}__backdrop`;
const SS_PANEL_CLASS = `${SS_CLASS}__panel`;
const SS_HEADER_CLASS = `${SS_CLASS}__header`;
const SS_TITLE_CLASS = `${SS_CLASS}__title`;
const SS_DESC_CLASS = `${SS_CLASS}__desc`;
const SS_GRID_CLASS = `${SS_CLASS}__grid`;
const SS_ITEM_CLASS = `${SS_CLASS}__item`;
const SS_ICON_CLASS = `${SS_CLASS}__icon`;
const SS_LABEL_CLASS = `${SS_CLASS}__label`;
const SS_LINK_CLASS = `${SS_CLASS}__link`;
const SS_LINK_INPUT_CLASS = `${SS_CLASS}__link-input`;
const SS_COPY_BTN_CLASS = `${SS_CLASS}__copy-btn`;

interface ShareTarget {
  key: string;
  label: string;
  emoji: string;
  bg?: string;
}

export class NdsShareSheet extends NdsElement {
  static elementName = "nds-share-sheet";

  static get observedAttributes(): readonly string[] {
    return [
      "open",
      "sheet-title",
      "description",
      "targets",
      "link",
      "copied-label",
      "close-on-backdrop-click",
    ];
  }

  private _backdrop: HTMLDivElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _prevOverflow = "";
  private _copied = false;
  private _copiedTimer: ReturnType<typeof setTimeout> | null = null;
  private _onEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.boolAttr("open")) this._emitClose();
  };

  override connectedCallback(): void {
    if (!this._backdrop) this._mount();
    super.connectedCallback();
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._onEsc);
    document.body.style.overflow = this._prevOverflow;
    if (this._copiedTimer) clearTimeout(this._copiedTimer);
  }

  private _emitClose(): void {
    this.dispatchEvent(new CustomEvent("nds-share-close", { bubbles: true, composed: true }));
  }

  private _parseTargets(): ShareTarget[] {
    const raw = this.getAttribute("targets");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((t) => t && typeof t.key === "string" && typeof t.label === "string")
        .map((t) => ({
          key: String(t.key),
          label: String(t.label),
          emoji: typeof t.emoji === "string" ? t.emoji : "",
          bg: typeof t.bg === "string" ? t.bg : undefined,
        }));
    } catch {
      return [];
    }
  }

  private _mount(): void {
    const backdrop = document.createElement("div");
    backdrop.className = SS_BACKDROP_CLASS;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.addEventListener("click", (e) => {
      if (e.target !== backdrop) return;
      if (this.attr("close-on-backdrop-click", "true") === "false") return;
      this._emitClose();
    });

    const panel = document.createElement("div");
    panel.className = SS_PANEL_CLASS;
    backdrop.appendChild(panel);

    this.appendChild(backdrop);
    this._backdrop = backdrop;
    this._panel = panel;
  }

  private async _copyLink(): Promise<void> {
    const link = this.getAttribute("link");
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      this._copied = true;
      this.dispatchEvent(
        new CustomEvent("nds-share-link-copied", { bubbles: true, composed: true }),
      );
      this.scheduleUpdate();
      if (this._copiedTimer) clearTimeout(this._copiedTimer);
      this._copiedTimer = setTimeout(() => {
        this._copied = false;
        this.scheduleUpdate();
      }, 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  protected update(): void {
    if (!this._backdrop || !this._panel) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    const title = this.getAttribute("sheet-title") || "공유하기";
    const description = this.getAttribute("description");
    const targets = this._parseTargets();
    const link = this.getAttribute("link");
    const copiedLabel = this.getAttribute("copied-label") || "복사됨";

    this._backdrop.setAttribute("aria-label", title);

    if (open) {
      this._backdrop.style.display = "";
      if (document.body.style.overflow !== "hidden") {
        this._prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
    } else {
      this._backdrop.style.display = "none";
      document.body.style.overflow = this._prevOverflow;
    }

    this._panel.innerHTML = "";

    const header = document.createElement("div");
    header.className = SS_HEADER_CLASS;
    if (title) {
      const titleEl = document.createElement("h3");
      titleEl.className = SS_TITLE_CLASS;
      titleEl.textContent = title;
      header.appendChild(titleEl);
    }
    if (description) {
      const descEl = document.createElement("p");
      descEl.className = SS_DESC_CLASS;
      descEl.textContent = description;
      header.appendChild(descEl);
    }
    this._panel.appendChild(header);

    const grid = document.createElement("div");
    grid.className = SS_GRID_CLASS;
    targets.forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = SS_ITEM_CLASS;
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("nds-share-target", {
            detail: { key: t.key },
            bubbles: true,
            composed: true,
          }),
        );
        this._emitClose();
      });

      const icon = document.createElement("span");
      icon.className = SS_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      if (t.bg) icon.style.setProperty("--nds-share-icon-bg", t.bg);
      icon.innerHTML = t.emoji;

      const label = document.createElement("span");
      label.className = SS_LABEL_CLASS;
      label.textContent = t.label;

      btn.append(icon, label);
      grid.appendChild(btn);
    });
    this._panel.appendChild(grid);

    if (link) {
      const linkWrap = document.createElement("div");
      linkWrap.className = SS_LINK_CLASS;

      const input = document.createElement("input");
      input.className = SS_LINK_INPUT_CLASS;
      input.value = link;
      input.readOnly = true;
      input.setAttribute("aria-label", "공유 링크");

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = SS_COPY_BTN_CLASS;
      copyBtn.textContent = this._copied ? copiedLabel : "복사";
      copyBtn.addEventListener("click", () => this._copyLink());

      linkWrap.append(input, copyBtn);
      this._panel.appendChild(linkWrap);
    }
  }
}

define(NdsShareSheet);
