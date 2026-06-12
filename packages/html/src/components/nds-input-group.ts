/**
 * <nds-input-group> — 한 줄에 form control 여러 개를 묶는 wrapper.
 *
 * 사용 예:
 *   <nds-form-field label="기간" label-position="left">
 *     <nds-input-group>
 *       <nds-select size="compact" placeholder="년"></nds-select>
 *       <nds-select size="compact" placeholder="월"></nds-select>
 *       <nds-select size="compact" placeholder="일"></nds-select>
 *     </nds-input-group>
 *   </nds-form-field>
 *
 * 속성:
 *   · gap="tight|default|loose" (8/12/16) — default 12 (Figma 캐포비 admin 3396:988)
 *   · align="stretch|start" — stretch(기본): 모든 자식 flex:1, start: 본래 너비
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const IG_ROOT_CLASS = "nds-input-group";
const GAP_PX = { tight: 8, default: 12, loose: 16 } as const;
type Gap = keyof typeof GAP_PX;
const GAPS: readonly Gap[] = ["tight", "default", "loose"];

const ALIGNS = ["stretch", "start"] as const;
type Align = (typeof ALIGNS)[number];

export class NdsInputGroup extends NdsElement {
  static elementName = "nds-input-group";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-input-group"].observedAttributes];
  }

  protected update(): void {
    if (this.style.display !== "block") this.style.display = "block";

    const gap = this._normalizedGap();
    const align = this._normalizedAlign();

    if (this.classList[0] !== IG_ROOT_CLASS) this.classList.add(IG_ROOT_CLASS);
    this.dataset.slot = "root";
    this.dataset.align = align;
    this.style.setProperty("--nds-input-group-gap", `${GAP_PX[gap]}px`);
  }

  private _normalizedGap(): Gap {
    const v = this.attr("gap", "default");
    return (GAPS as readonly string[]).includes(v) ? (v as Gap) : "default";
  }

  private _normalizedAlign(): Align {
    const v = this.attr("align", "stretch");
    return (ALIGNS as readonly string[]).includes(v) ? (v as Align) : "stretch";
  }
}

define(NdsInputGroup);
