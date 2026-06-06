/**
 * <nds-tip-card> — DS TipCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-tip-card tone="info" label="팁" tip-title="더 잘 자려면" description="자기 1시간 전엔 화면을 멀리해보세요"></nds-tip-card>
 *
 * 속성:
 *   tone: "info" | "success" | "warning" | "neutral" (기본 "info")
 *   label: 상단 보조 라벨
 *   tip-title: 카드 제목
 *   description: 설명 본문
 *   action-label / action-href: 하단 액션
 *   href: 카드 자체를 클릭 가능한 링크로 취급
 *   clickable: 클릭 가능 상태 힌트
 */

import { NdsElement, define } from "../base/nds-element.js";

const TC_CLASS = "nds-tip-card";
const TC_META_CLASS = `${TC_CLASS}__meta`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__description`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

const TONES = ["info", "success", "warning", "neutral"] as const;
type TipCardTone = (typeof TONES)[number];

const ChevronRight = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("fill", "none");
  svg.innerHTML =
    '<path d="M6.5 4.5L11 9L6.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />';
  return svg;
};

export class NdsTipCard extends NdsElement {
  static elementName = "nds-tip-card";

  static get observedAttributes(): readonly string[] {
    return [
      "tone",
      "label",
      "tip-title",
      "description",
      "action-label",
      "action-href",
      "href",
      "clickable",
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
    root.addEventListener("click", () => {
      const href = this.getAttribute("href");
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
      this.dispatchEvent(
        new CustomEvent("nds-tip-card-click", {
          detail: { href: href ?? null },
          bubbles: true,
          composed: true,
        }),
      );
    });
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const tone = this._norm("tone", TONES, "info");
    const label = this.getAttribute("label");
    const title = this.getAttribute("tip-title");
    const description = this.getAttribute("description");
    const actionLabel = this.getAttribute("action-label");
    const actionHref = this.getAttribute("action-href");
    const href = this.getAttribute("href");
    const clickable = this.boolAttr("clickable") || !!href;

    this._root.dataset.tone = tone;
    this._root.dataset.clickable = String(clickable);

    if (clickable) {
      this._root.setAttribute("role", "link");
    } else {
      this._root.removeAttribute("role");
    }

    this._root.innerHTML = "";

    if (label) {
      const meta = document.createElement("div");
      meta.className = TC_META_CLASS;
      meta.dataset.slot = "meta";

      const labelEl = document.createElement("span");
      labelEl.className = TC_LABEL_CLASS;
      labelEl.dataset.slot = "label";
      labelEl.textContent = label;
      meta.appendChild(labelEl);
      this._root.appendChild(meta);
    }

    const body = document.createElement("div");
    body.className = TC_BODY_CLASS;
    body.dataset.slot = "body";

    if (title) {
      const titleEl = document.createElement("div");
      titleEl.className = TC_TITLE_CLASS;
      titleEl.dataset.slot = "title";
      titleEl.textContent = title;
      body.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement("div");
      descEl.className = TC_DESC_CLASS;
      descEl.dataset.slot = "description";
      descEl.textContent = description;
      body.appendChild(descEl);
    }

    if (actionLabel) {
      if (actionHref) {
        const a = document.createElement("a");
        a.className = TC_ACTION_CLASS;
        a.dataset.slot = "action";
        a.href = actionHref;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = actionLabel;
        a.appendChild(ChevronRight());
        a.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(
            new CustomEvent("nds-tip-card-action", {
              detail: { href: actionHref },
              bubbles: true,
              composed: true,
            }),
          );
        });
        body.appendChild(a);
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = TC_ACTION_CLASS;
        btn.dataset.slot = "action";
        btn.textContent = actionLabel;
        btn.appendChild(ChevronRight());
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(
            new CustomEvent("nds-tip-card-action", {
              detail: { href: null },
              bubbles: true,
              composed: true,
            }),
          );
        });
        body.appendChild(btn);
      }
    }

    this._root.appendChild(body);
  }

  private _norm<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(name, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

define(NdsTipCard);
