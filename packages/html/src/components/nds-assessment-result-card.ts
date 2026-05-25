/**
 * <nds-assessment-result-card> — DS AssessmentResultCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-assessment-result-card
 *     title="PHQ-9 우울 검사"
 *     score="15"
 *     max-score="27"
 *     level="moderate"
 *     description="상당히 우울한 상태입니다."
 *     action-label="결과 자세히 보기"
 *   ></nds-assessment-result-card>
 */

import { NdsElement, define } from "../base/nds-element.js";

const AR_CLASS = "nds-assessment-result";
const AR_HEADER_CLASS = `${AR_CLASS}__header`;
const AR_TITLE_CLASS = `${AR_CLASS}__title`;
const AR_LEVEL_CLASS = `${AR_CLASS}__level`;
const AR_BODY_CLASS = `${AR_CLASS}__body`;
const AR_SCORE_CLASS = `${AR_CLASS}__score`;
const AR_SCORE_VALUE_CLASS = `${AR_CLASS}__score-value`;
const AR_SCORE_UNIT_CLASS = `${AR_CLASS}__score-unit`;
const AR_SCORE_MAX_CLASS = `${AR_CLASS}__score-max`;
const AR_GAUGE_CLASS = `${AR_CLASS}__gauge`;
const AR_GAUGE_BAR_CLASS = `${AR_CLASS}__gauge-bar`;
const AR_GAUGE_SEG_CLASS = `${AR_CLASS}__gauge-seg`;
const AR_GAUGE_LABELS_CLASS = `${AR_CLASS}__gauge-labels`;
const AR_GAUGE_LABEL_CLASS = `${AR_CLASS}__gauge-label`;
const AR_DESC_CLASS = `${AR_CLASS}__description`;
const AR_FOOTER_CLASS = `${AR_CLASS}__footer`;
const AR_ACTION_CLASS = `${AR_CLASS}__action`;

export type AssessmentLevel = "normal" | "mild" | "moderate" | "severe";

const LEVEL_ORDER: AssessmentLevel[] = ["normal", "mild", "moderate", "severe"];

const LEVEL_DEFAULT_TEXT: Record<AssessmentLevel, string> = {
  normal: "정상",
  mild: "주의",
  moderate: "경계",
  severe: "심각",
};

const ChevronRight = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M6 4L10 8L6 12");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  return svg;
};

export class NdsAssessmentResultCard extends NdsElement {
  static elementName = "nds-assessment-result-card";

  static get observedAttributes(): readonly string[] {
    return [
      "title",
      "score",
      "max-score",
      "level",
      "level-text",
      "description",
      "action-label",
      "score-unit",
      "hide-gauge",
      "level-labels",
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
    root.className = AR_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const title = this.attr("title", "");
    const score = this.attr("score", "0");
    const maxScore = this.getAttribute("max-score");
    const level = (this.getAttribute("level") as AssessmentLevel) || "normal";
    const levelText = this.getAttribute("level-text");
    const description = this.getAttribute("description");
    const actionLabel = this.getAttribute("action-label");
    const scoreUnit = this.attr("score-unit", "점");
    const hideGauge = this.boolAttr("hide-gauge");
    const levelLabelsAttr = this.getAttribute("level-labels");

    let levelLabels: Partial<Record<AssessmentLevel, string>> = {};
    if (levelLabelsAttr) {
      try {
        levelLabels = JSON.parse(levelLabelsAttr);
      } catch (e) {
        console.error("[nds-assessment-result-card] Failed to parse level-labels JSON", e);
      }
    }

    const resolveLabel = (lvl: AssessmentLevel) => levelLabels?.[lvl] ?? LEVEL_DEFAULT_TEXT[lvl];
    const levelChipLabel = levelText ?? resolveLabel(level);

    this._root.dataset.level = level;

    // Header
    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = AR_HEADER_CLASS;

    const h3 = document.createElement("h3");
    h3.dataset.slot = "title";
    h3.className = AR_TITLE_CLASS;
    h3.textContent = title;

    const levelSpan = document.createElement("span");
    levelSpan.dataset.slot = "level";
    levelSpan.className = AR_LEVEL_CLASS;
    levelSpan.textContent = levelChipLabel;

    header.append(h3, levelSpan);

    // Body
    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = AR_BODY_CLASS;

    const scoreDiv = document.createElement("div");
    scoreDiv.dataset.slot = "score";
    scoreDiv.className = AR_SCORE_CLASS;

    const scoreVal = document.createElement("span");
    scoreVal.dataset.slot = "score-value";
    scoreVal.className = AR_SCORE_VALUE_CLASS;
    scoreVal.textContent = score;

    scoreDiv.appendChild(scoreVal);

    if (scoreUnit) {
      const unit = document.createElement("span");
      unit.dataset.slot = "score-unit";
      unit.className = AR_SCORE_UNIT_CLASS;
      unit.textContent = scoreUnit;
      scoreDiv.appendChild(unit);
    }

    if (maxScore !== null) {
      const max = document.createElement("span");
      max.dataset.slot = "score-max";
      max.className = AR_SCORE_MAX_CLASS;
      max.textContent = `/ ${maxScore}${scoreUnit ?? ""}`;
      scoreDiv.appendChild(max);
    }

    body.appendChild(scoreDiv);

    if (!hideGauge) {
      const gauge = document.createElement("div");
      gauge.dataset.slot = "gauge";
      gauge.className = AR_GAUGE_CLASS;

      const bar = document.createElement("div");
      bar.className = AR_GAUGE_BAR_CLASS;

      const labels = document.createElement("div");
      labels.className = AR_GAUGE_LABELS_CLASS;

      LEVEL_ORDER.forEach((lvl) => {
        const seg = document.createElement("div");
        seg.className = AR_GAUGE_SEG_CLASS;
        seg.dataset.seg = lvl;
        seg.dataset.active = String(lvl === level);
        bar.appendChild(seg);

        const labelSpan = document.createElement("span");
        labelSpan.className = AR_GAUGE_LABEL_CLASS;
        labelSpan.dataset.seg = lvl;
        labelSpan.dataset.active = String(lvl === level);
        labelSpan.textContent = resolveLabel(lvl);
        labels.appendChild(labelSpan);
      });

      gauge.append(bar, labels);
      body.appendChild(gauge);
    }

    if (description) {
      const p = document.createElement("p");
      p.dataset.slot = "description";
      p.className = AR_DESC_CLASS;
      p.textContent = description;
      body.appendChild(p);
    }

    // Footer
    let footer: HTMLDivElement | null = null;
    if (actionLabel) {
      footer = document.createElement("div");
      footer.dataset.slot = "footer";
      footer.className = AR_FOOTER_CLASS;

      const btn = document.createElement("button");
      btn.dataset.slot = "action";
      btn.className = AR_ACTION_CLASS;
      btn.textContent = actionLabel;
      btn.appendChild(ChevronRight());
      btn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("assessment-action", { bubbles: true, composed: true }));
      });
      footer.appendChild(btn);
    }

    this._root.replaceChildren(header, body);
    if (footer) this._root.appendChild(footer);
  }
}

define(NdsAssessmentResultCard);
