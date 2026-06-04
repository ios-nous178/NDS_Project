/**
 * <nds-vote-poll> — DS VotePoll 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-vote-poll
 *     question="어느 시간대가 좋으세요?"
 *     options='[
 *       {"key":"am","label":"오전","count":24},
 *       {"key":"pm","label":"오후","count":48},
 *       {"key":"night","label":"저녁","count":12}
 *     ]'
 *     voted-key=""
 *   ></nds-vote-poll>
 *
 * 이벤트:
 *   nds-vote (detail: { key }) -> 투표
 *
 * 속성:
 *   question / options (JSON 배열) / voted-key
 *   show-results: 투표 전에도 결과 표시
 *   disabled
 *
 * children:
 *   slot="footer" — 총 투표수 등
 */

import { NdsElement, define } from "../base/nds-element.js";

const VP_CLASS = "nds-vote-poll";
const VP_QUESTION_CLASS = `${VP_CLASS}__question`;
const VP_OPTIONS_CLASS = `${VP_CLASS}__options`;
const VP_OPTION_CLASS = `${VP_CLASS}__option`;
const VP_BAR_CLASS = `${VP_CLASS}__bar`;
const VP_LABEL_CLASS = `${VP_CLASS}__label`;
const VP_PCT_CLASS = `${VP_CLASS}__pct`;
const VP_FOOTER_CLASS = `${VP_CLASS}__footer`;

interface VoteOption {
  key: string;
  label: string;
  count: number;
}

export class NdsVotePoll extends NdsElement {
  static elementName = "nds-vote-poll";

  static get observedAttributes(): readonly string[] {
    return ["question", "options", "voted-key", "show-results", "disabled"];
  }

  private _root: HTMLDivElement | null = null;
  private _questionEl: HTMLParagraphElement | null = null;
  private _optionsWrap: HTMLDivElement | null = null;
  private _footerWrap: HTMLDivElement | null = null;
  private _hasFooter = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const footerStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "footer") {
        footerStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });
    this._hasFooter = footerStash.length > 0;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = VP_CLASS;

    const questionEl = document.createElement("p");
    questionEl.className = VP_QUESTION_CLASS;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = VP_OPTIONS_CLASS;

    const footerWrap = document.createElement("div");
    footerWrap.className = VP_FOOTER_CLASS;
    footerStash.forEach((n) => footerWrap.appendChild(n));

    root.append(questionEl, optionsWrap);
    if (this._hasFooter) root.appendChild(footerWrap);

    this.appendChild(root);

    this._root = root;
    this._questionEl = questionEl;
    this._optionsWrap = optionsWrap;
    this._footerWrap = footerWrap;
  }

  private _parseOptions(): VoteOption[] {
    const raw = this.getAttribute("options");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((o) => o && typeof o.key === "string")
        .map((o) => ({
          key: String(o.key),
          label: typeof o.label === "string" ? o.label : String(o.key),
          count: typeof o.count === "number" ? o.count : 0,
        }));
    } catch (err) {
      // 조용히 삼키지 않는다 — JSON 속성 과이스케이프 시 디버깅 불가. (cf. nds-sidebar)
      console.warn("[nds-vote-poll] options 가 유효한 JSON 이 아닙니다.", {
        error: err,
        rawHead: raw.slice(0, 80),
      });
      return [];
    }
  }

  protected update(): void {
    if (!this._root || !this._questionEl || !this._optionsWrap) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const question = this.getAttribute("question") || "";
    const options = this._parseOptions();
    const votedKey = this.getAttribute("voted-key");
    const showResults = this.boolAttr("show-results");
    const disabled = this.boolAttr("disabled");
    const total = options.reduce((sum, o) => sum + o.count, 0);
    const reveal = !!votedKey || showResults;

    this._questionEl.textContent = question;
    this._optionsWrap.innerHTML = "";

    options.forEach((opt) => {
      const pct = total > 0 ? Math.round((opt.count / total) * 100) : 0;
      const voted = votedKey === opt.key;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = VP_OPTION_CLASS;
      btn.dataset.voted = voted ? "true" : "false";
      btn.disabled = disabled;
      btn.addEventListener("click", () => {
        if (disabled || votedKey) return;
        this.dispatchEvent(
          new CustomEvent("nds-vote", {
            detail: { key: opt.key },
            bubbles: true,
            composed: true,
          }),
        );
      });
      if (reveal) btn.style.setProperty("--nds-vote-pct", `${pct}%`);

      if (reveal) {
        const bar = document.createElement("span");
        bar.className = VP_BAR_CLASS;
        bar.setAttribute("aria-hidden", "true");
        btn.appendChild(bar);
      }

      const labelEl = document.createElement("span");
      labelEl.className = VP_LABEL_CLASS;
      labelEl.textContent = opt.label;
      btn.appendChild(labelEl);

      if (reveal) {
        const pctEl = document.createElement("span");
        pctEl.className = VP_PCT_CLASS;
        pctEl.textContent = `${pct}%`;
        btn.appendChild(pctEl);
      }

      this._optionsWrap!.appendChild(btn);
    });
  }
}

define(NdsVotePoll);
