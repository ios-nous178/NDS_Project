/**
 * <nds-multi-step-form> — DS MultiStepForm 의 vanilla Web Component 버전.
 *
 * 사용 패턴 — body 영역은 children slot 으로:
 *   <nds-multi-step-form
 *     current="0"
 *     steps='[
 *       {"key":"a","title":"기본정보","description":"이름·이메일"},
 *       {"key":"b","title":"비밀번호 설정"},
 *       {"key":"c","title":"확인","canProceed":false}
 *     ]'
 *     indicator="progress">
 *     <div data-step="a">...</div>
 *     <div data-step="b">...</div>
 *     <div data-step="c">...</div>
 *   </nds-multi-step-form>
 *
 * 이벤트:
 *   current-change (detail: { current }) — 단계 이동
 *   step-submit — 마지막 단계에서 다음 버튼 클릭
 *
 * 속성:
 *   steps: JSON 배열 — [{ key, title, description?, canProceed? }]
 *   current: 현재 인덱스
 *   indicator: "progress" | "steps" | "none" (기본 "progress")
 *   next-label / prev-label / submit-label
 *   submitting: 제출 중 표시 / 버튼 비활성
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const MS_CLASS = "nds-multi-step-form";
const MS_HEADER_CLASS = `${MS_CLASS}__header`;
const MS_INDICATOR_CLASS = `${MS_CLASS}__indicator`;
const MS_TITLE_CLASS = `${MS_CLASS}__title`;
const MS_DESC_CLASS = `${MS_CLASS}__desc`;
const MS_BODY_CLASS = `${MS_CLASS}__body`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_BTN_CLASS = `${MS_CLASS}__btn`;
const MS_PROGRESS_CLASS = `${MS_CLASS}__progress`;
const MS_PROGRESS_FILL_CLASS = `${MS_CLASS}__progress-fill`;

type Indicator = "progress" | "steps" | "none";

interface Step {
  key: string;
  title: string;
  description?: string;
  canProceed?: boolean;
}

export class NdsMultiStepForm extends NdsElement {
  static elementName = "nds-multi-step-form";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-multi-step-form"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _bodyHost: HTMLDivElement | null = null;
  private _userBody: DocumentFragment | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 사용자 children 을 fragment 로 빼서 보관 (한 번씩 보여줄 때마다 재사용)
    const userFrag = document.createDocumentFragment();
    while (this.firstChild) userFrag.appendChild(this.firstChild);
    this._userBody = userFrag;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = MS_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseSteps(): Step[] {
    const raw = this.getAttribute("steps");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Step[];
    } catch {
      /* ignore */
    }
    return [];
  }

  private _setCurrent(next: number): void {
    const steps = this._parseSteps();
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    this.setAttribute("current", String(clamped));
    this.dispatchEvent(
      new CustomEvent("current-change", {
        detail: { current: clamped },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const steps = this._parseSteps();
    const total = steps.length;
    if (total === 0) {
      this._root.replaceChildren();
      return;
    }
    const cur = Math.max(0, Math.min(total - 1, parseInt(this.attr("current", "0"), 10) || 0));
    const step = steps[cur];
    const isFirst = cur === 0;
    const isLast = cur === total - 1;
    const canProceed = step?.canProceed !== false;

    const indicatorAttr = this.attr("indicator", "progress") as Indicator;
    const indicator: Indicator =
      indicatorAttr === "steps" || indicatorAttr === "none" ? indicatorAttr : "progress";
    const nextLabel = this.attr("next-label", "다음");
    const prevLabel = this.attr("prev-label", "이전");
    const submitLabel = this.attr("submit-label", "완료");
    const submitting = this.boolAttr("submitting");

    const children: Node[] = [];

    if (indicator === "progress") {
      const prog = document.createElement("div");
      prog.className = MS_PROGRESS_CLASS;
      prog.setAttribute("role", "progressbar");
      prog.setAttribute("aria-valuenow", String(cur + 1));
      prog.setAttribute("aria-valuemin", "1");
      prog.setAttribute("aria-valuemax", String(total));
      const fill = document.createElement("div");
      fill.className = MS_PROGRESS_FILL_CLASS;
      fill.style.width = `${((cur + 1) / total) * 100}%`;
      prog.appendChild(fill);
      children.push(prog);
    }

    const header = document.createElement("div");
    header.className = MS_HEADER_CLASS;
    if (indicator !== "none") {
      const ind = document.createElement("span");
      ind.className = MS_INDICATOR_CLASS;
      ind.textContent = `${cur + 1} / ${total}`;
      header.appendChild(ind);
    }
    const title = document.createElement("h2");
    title.className = MS_TITLE_CLASS;
    title.textContent = step.title;
    header.appendChild(title);
    if (step.description) {
      const desc = document.createElement("p");
      desc.className = MS_DESC_CLASS;
      desc.textContent = step.description;
      header.appendChild(desc);
    }
    children.push(header);

    const body = document.createElement("div");
    body.className = MS_BODY_CLASS;
    body.dataset.slot = "body";
    // 사용자가 children 으로 step body 를 [data-step] 으로 마킹했다면 해당 단계만 노출
    if (this._userBody) {
      // userBody 는 한 번만 root 에 attach (그렇지 않으면 input state 가 날아감)
      if (!this._bodyHost) {
        // 처음으로 step body 를 마운트
        this._bodyHost = body;
        // user fragment 의 children 을 옮긴다 (fragment 는 이 시점 이후 비어있다)
        while (this._userBody.firstChild) body.appendChild(this._userBody.firstChild);
      } else {
        // 이미 host 가 있다면 children 그대로 옮긴다
        while (this._bodyHost.firstChild) body.appendChild(this._bodyHost.firstChild);
        this._bodyHost = body;
      }
      // 활성 step 만 display
      const stepKey = step.key;
      const stepChildren = body.querySelectorAll<HTMLElement>("[data-step]");
      if (stepChildren.length > 0) {
        stepChildren.forEach((c) => {
          c.style.display = c.dataset.step === stepKey ? "" : "none";
        });
      }
    }
    children.push(body);

    const footer = document.createElement("div");
    footer.className = MS_FOOTER_CLASS;

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = MS_BTN_CLASS;
    prevBtn.textContent = prevLabel;
    prevBtn.disabled = isFirst || submitting;
    if (isFirst) prevBtn.style.visibility = "hidden";
    prevBtn.addEventListener("click", () => {
      if (isFirst) return;
      this._setCurrent(cur - 1);
    });

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = MS_BTN_CLASS;
    nextBtn.dataset.primary = "true";
    nextBtn.disabled = !canProceed || submitting;
    nextBtn.textContent = isLast ? (submitting ? "처리 중..." : submitLabel) : nextLabel;
    nextBtn.addEventListener("click", () => {
      if (!canProceed) return;
      if (isLast) {
        this.dispatchEvent(new CustomEvent("step-submit", { bubbles: true, composed: true }));
        return;
      }
      this._setCurrent(cur + 1);
    });

    footer.append(prevBtn, nextBtn);
    children.push(footer);

    this._root.replaceChildren(...children);
  }
}

define(NdsMultiStepForm);
