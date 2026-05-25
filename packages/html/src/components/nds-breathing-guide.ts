/**
 * <nds-breathing-guide> — DS BreathingGuide 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-breathing-guide auto-start cycles="3"
 *     phases='[{"kind":"inhale","seconds":4},{"kind":"hold","seconds":4},
 *              {"kind":"exhale","seconds":4},{"kind":"rest","seconds":4}]'>
 *   </nds-breathing-guide>
 *
 * Attributes:
 *   phases         JSON [{kind,seconds,label?}] (없으면 기본 4-4-4-4)
 *   auto-start     boolean — 자동 재생
 *   cycles         number — 사이클 수 (없으면 무한)
 *   playing        boolean — 외부 제어
 *   no-count       boolean — 카운트다운 숨김
 *   hide-controls  boolean — 컨트롤 버튼 숨김
 *
 * 이벤트:
 *   breathing-complete  cycles 만큼 끝났을 때
 *   breathing-playing-change (detail: { playing })  재생 상태 변경
 */

import { NdsElement, define } from "../base/nds-element.js";

const BG_CLASS = "nds-breathing-guide";
const BG_STAGE_CLASS = `${BG_CLASS}__stage`;
const BG_CIRCLE_CLASS = `${BG_CLASS}__circle`;
const BG_LABEL_CLASS = `${BG_CLASS}__label`;
const BG_COUNT_CLASS = `${BG_CLASS}__count`;
const BG_INFO_CLASS = `${BG_CLASS}__info`;
const BG_CONTROLS_CLASS = `${BG_CLASS}__controls`;
const BG_BTN_CLASS = `${BG_CLASS}__btn`;
const BG_CYCLE_CLASS = `${BG_CLASS}__cycle`;

export type BreathingPhaseKind = "inhale" | "hold" | "exhale" | "rest";

const KINDS: readonly BreathingPhaseKind[] = ["inhale", "hold", "exhale", "rest"];

interface BreathingPhase {
  kind: BreathingPhaseKind;
  seconds: number;
  label?: string;
}

const DEFAULT_PHASES: BreathingPhase[] = [
  { kind: "inhale", seconds: 4 },
  { kind: "hold", seconds: 4 },
  { kind: "exhale", seconds: 4 },
  { kind: "rest", seconds: 4 },
];

const DEFAULT_LABELS: Record<BreathingPhaseKind, string> = {
  inhale: "들이마시기",
  hold: "잠시 멈춤",
  exhale: "내쉬기",
  rest: "쉬기",
};

const TICK_MS = 1_000;
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsBreathingGuide extends NdsElement {
  static elementName = "nds-breathing-guide";

  static get observedAttributes(): readonly string[] {
    return [
      "phases",
      "auto-start",
      "cycles",
      "playing",
      "no-count",
      "hide-controls",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _phases: BreathingPhase[] = DEFAULT_PHASES;
  private _phaseIdx = 0;
  private _secondsLeft = 4;
  private _cycleCount = 0;
  private _userTogglesPlaying = false;
  private _onPrimaryClick = () => this._togglePlaying();
  private _onResetClick = () => this._reset(true);

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    if (this._isPlaying()) this._startTicking();
  }

  override disconnectedCallback(): void {
    this._stopTicking();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this.isConnected) return;
    if (name === "phases") {
      this._phases = this._readPhases();
      this._reset(false);
    }
    if (name === "playing" || name === "auto-start") {
      if (this._isPlaying()) this._startTicking();
      else this._stopTicking();
    }
  }

  private _mount(): void {
    this._phases = this._readPhases();
    this._secondsLeft = this._phases[0]?.seconds ?? 4;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = BG_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const playing = this._isPlaying();
    this._root.dataset.playing = playing ? "true" : "false";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._render(playing);
  }

  private _render(playing: boolean): void {
    if (!this._root) return;

    const phase = this._phases[this._phaseIdx] ?? this._phases[0];
    const label = phase.label ?? DEFAULT_LABELS[phase.kind];
    const cycles = this._cyclesAttr();

    const stage = document.createElement("div");
    stage.className = BG_STAGE_CLASS;

    const circle = document.createElement("div");
    circle.className = BG_CIRCLE_CLASS;
    circle.dataset.kind = playing ? phase.kind : "rest";
    circle.style.setProperty("--nds-breathing-duration", `${phase.seconds}s`);
    stage.appendChild(circle);

    const info = document.createElement("div");
    info.className = BG_INFO_CLASS;

    const labelEl = document.createElement("p");
    labelEl.className = BG_LABEL_CLASS;
    labelEl.textContent = label;
    info.appendChild(labelEl);

    if (playing && !this.boolAttr("no-count")) {
      const count = document.createElement("p");
      count.className = BG_COUNT_CLASS;
      count.textContent = String(this._secondsLeft);
      info.appendChild(count);
    }

    if (!playing && cycles !== null) {
      const small = document.createElement("small");
      small.className = BG_CYCLE_CLASS;
      small.textContent = `${this._cycleCount} / ${cycles} 사이클`;
      info.appendChild(small);
    }

    stage.appendChild(info);

    const children: Node[] = [stage];
    if (!this.boolAttr("hide-controls")) children.push(this._createControls(playing));
    this._root.replaceChildren(...children);
  }

  private _createControls(playing: boolean): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = BG_CONTROLS_CLASS;

    const primary = document.createElement("button");
    primary.type = "button";
    primary.className = BG_BTN_CLASS;
    primary.dataset.primary = "true";
    primary.textContent = playing ? "일시정지" : this._cycleCount > 0 ? "재개" : "시작";
    primary.addEventListener("click", this._onPrimaryClick);
    wrap.appendChild(primary);

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = BG_BTN_CLASS;
    reset.textContent = "처음부터";
    reset.addEventListener("click", this._onResetClick);
    wrap.appendChild(reset);

    return wrap;
  }

  private _startTicking(): void {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this._tick(), TICK_MS);
  }

  private _stopTicking(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private _tick(): void {
    if (this._secondsLeft > 1) {
      this._secondsLeft -= 1;
    } else {
      const next = (this._phaseIdx + 1) % this._phases.length;
      this._phaseIdx = next;
      this._secondsLeft = this._phases[next].seconds;
      if (next === 0) {
        this._cycleCount += 1;
        const cycles = this._cyclesAttr();
        if (cycles !== null && this._cycleCount >= cycles) {
          this._setPlaying(false);
          this.dispatchEvent(
            new CustomEvent("breathing-complete", { bubbles: true, composed: true }),
          );
        }
      }
    }
    this.scheduleUpdate();
  }

  private _togglePlaying(): void {
    this._setPlaying(!this._isPlaying());
  }

  private _setPlaying(next: boolean): void {
    this._userTogglesPlaying = true;
    if (next) this.setAttribute("playing", "");
    else this.removeAttribute("playing");
    this.dispatchEvent(
      new CustomEvent("breathing-playing-change", {
        detail: { playing: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _reset(rerender: boolean): void {
    this._stopTicking();
    this._phaseIdx = 0;
    this._secondsLeft = this._phases[0]?.seconds ?? 4;
    this._cycleCount = 0;
    if (rerender) {
      this._userTogglesPlaying = true;
      this.removeAttribute("playing");
      this.scheduleUpdate();
    }
  }

  private _isPlaying(): boolean {
    if (this.hasAttribute("playing")) return true;
    if (this._userTogglesPlaying) return false;
    return this.boolAttr("auto-start");
  }

  private _cyclesAttr(): number | null {
    const value = this.getAttribute("cycles");
    if (value === null || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
  }

  private _readPhases(): BreathingPhase[] {
    const attr = this.getAttribute("phases");
    if (!attr || !attr.trim()) return DEFAULT_PHASES;
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PHASES;
      const result: BreathingPhase[] = [];
      for (const raw of parsed) {
        const kind = typeof raw.kind === "string" ? raw.kind : "";
        const seconds = Number(raw.seconds);
        if (!(KINDS as readonly string[]).includes(kind)) continue;
        if (!Number.isFinite(seconds) || seconds <= 0) continue;
        result.push({
          kind: kind as BreathingPhaseKind,
          seconds: Math.trunc(seconds),
          label: typeof raw.label === "string" ? raw.label : undefined,
        });
      }
      return result.length > 0 ? result : DEFAULT_PHASES;
    } catch {
      return DEFAULT_PHASES;
    }
  }
}

define(NdsBreathingGuide);
