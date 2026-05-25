/**
 * <nds-greeting-header> — DS GreetingHeader 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-greeting-header name="홍길동" greeting="안녕하세요" question="오늘 기분은 어떠세요?" tone="primary">
 *     <nds-avatar slot="trailing" src="/me.jpg"></nds-avatar>
 *     <nds-mood-selector slot="actions"></nds-mood-selector>
 *   </nds-greeting-header>
 *
 * 속성:
 *   name: 사용자 이름 (자동으로 "{name}님")
 *   greeting: 인삿말 (default "안녕하세요")
 *   question: 메인 질문 메시지
 *   tone: "default" | "primary"
 *
 * children:
 *   slot="trailing" — 우측 트레일링 (아바타 등)
 *   slot="actions"  — 하단 액션 영역 (MoodSelector 등)
 */

import { NdsElement, define } from "../base/nds-element.js";

const GH_CLASS = "nds-greeting-header";
const GH_TOP_CLASS = `${GH_CLASS}__top`;
const GH_GREETING_CLASS = `${GH_CLASS}__greeting`;
const GH_TITLE_CLASS = `${GH_CLASS}__title`;
const GH_QUESTION_CLASS = `${GH_CLASS}__question`;
const GH_ACTIONS_CLASS = `${GH_CLASS}__actions`;
const GH_TRAILING_CLASS = `${GH_CLASS}__trailing`;

export class NdsGreetingHeader extends NdsElement {
  static elementName = "nds-greeting-header";

  static get observedAttributes(): readonly string[] {
    return ["name", "greeting", "question", "tone"];
  }

  private _root: HTMLDivElement | null = null;
  private _greetingEl: HTMLParagraphElement | null = null;
  private _titleEl: HTMLHeadingElement | null = null;
  private _questionEl: HTMLParagraphElement | null = null;
  private _trailingWrap: HTMLDivElement | null = null;
  private _actionsWrap: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const trailingStash: Node[] = [];
    const actionsStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "trailing") trailingStash.push(node);
        else if (slot === "actions") actionsStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = GH_CLASS;

    const top = document.createElement("div");
    top.className = GH_TOP_CLASS;

    const left = document.createElement("div");

    const greetingEl = document.createElement("p");
    greetingEl.className = GH_GREETING_CLASS;

    const titleEl = document.createElement("h2");
    titleEl.className = GH_TITLE_CLASS;

    const questionEl = document.createElement("p");
    questionEl.className = GH_QUESTION_CLASS;

    left.append(greetingEl, titleEl, questionEl);

    const trailingWrap = document.createElement("div");
    trailingWrap.className = GH_TRAILING_CLASS;
    trailingStash.forEach((n) => trailingWrap.appendChild(n));

    top.append(left, trailingWrap);

    const actionsWrap = document.createElement("div");
    actionsWrap.className = GH_ACTIONS_CLASS;
    actionsStash.forEach((n) => actionsWrap.appendChild(n));

    root.append(top, actionsWrap);
    this.appendChild(root);

    this._root = root;
    this._greetingEl = greetingEl;
    this._titleEl = titleEl;
    this._questionEl = questionEl;
    this._trailingWrap = trailingWrap;
    this._actionsWrap = actionsWrap;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._greetingEl ||
      !this._titleEl ||
      !this._questionEl ||
      !this._trailingWrap ||
      !this._actionsWrap
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const name = this.getAttribute("name") || "";
    const greeting = this.getAttribute("greeting") || "안녕하세요";
    const question = this.getAttribute("question");
    const tone = this.getAttribute("tone") || "default";

    this._root.dataset.tone = tone;
    this._greetingEl.textContent = greeting;
    this._titleEl.textContent = name ? `${name}님` : "";

    if (question) {
      this._questionEl.textContent = question;
      this._questionEl.style.display = "";
    } else {
      this._questionEl.style.display = "none";
    }

    this._trailingWrap.style.display = this._trailingWrap.childNodes.length > 0 ? "" : "none";
    this._actionsWrap.style.display = this._actionsWrap.childNodes.length > 0 ? "" : "none";
  }
}

define(NdsGreetingHeader);
