/**
 * <nds-project-logo> — DS ProjectLogo 의 vanilla Web Component 버전.
 *
 * 프로젝트 대표 로고를 컴포넌트로 박는다(raw <img>/SVG 직접 조립 금지). data URI 가 내장돼
 * 단일 HTML/오프라인에서도 안 깨진다. `<nds-sidebar project>` / `<nds-project-header project>` 가
 * 주입하는 것과 **동일한 로고 SSOT**(project-logo-defaults). 어드민 온보딩 카드처럼 project chrome
 * 이 없는 화면에서 35KB base64 를 손으로 붙이지 않고 로고를 넣는 표준 진입점이다.
 *
 * DOM 구조 (React ProjectLogo.tsx 와 동일):
 *   <nds-project-logo project="cashwalk-biz" height="40"></nds-project-logo>
 *     └─ <span class="nds-project-logo" data-project="cashwalk-biz">
 *          └─ <img class="nds-project-logo__img" src="data:..." alt="..." />   (href 시 <a> 로 감쌈)
 *        </span>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
import {
  TROST_LOGO_DATA_URI,
  GENIET_LOGO_PC_DATA_URI,
  NUDGE_EAP_LOGO_DATA_URI,
  CASHWALK_BIZ_LOGO_DATA_URI,
  RUNMILE_LOGO_DATA_URI,
} from "./project-logo-defaults.js";

const BL_CLASS = "nds-project-logo";

export type { ProjectSlug } from "@nudge-design/tokens";

interface ProjectLogoEntry {
  src: string;
  alt: string;
}

const PROJECT_LOGOS: Record<string, ProjectLogoEntry> = {
  trost: { src: TROST_LOGO_DATA_URI, alt: "Trost" },
  geniet: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet" },
  "nudge-eap": { src: NUDGE_EAP_LOGO_DATA_URI, alt: "NudgeEAP" },
  "cashwalk-biz": { src: CASHWALK_BIZ_LOGO_DATA_URI, alt: "Cashwalk for Business" },
  runmile: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile" },
};

export class NdsProjectLogo extends NdsElement {
  static elementName = "nds-project-logo";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-project-logo"].observedAttributes];
  }

  private _root: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("span");
    root.className = BL_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const project = this.getAttribute("project") ?? "";
    const entry = PROJECT_LOGOS[project];
    this._root.dataset.project = project;

    if (!entry) {
      this._root.replaceChildren();
      if (typeof console !== "undefined") {
        console.warn(
          `<nds-project-logo>: 미지 project="${project}". trost | geniet | nudge-eap | cashwalk-biz | runmile 중 하나여야 합니다.`,
        );
      }
      return;
    }

    const height = this._numberAttr("height", 40);
    const widthAttr = this.getAttribute("width");
    const alt = this.getAttribute("alt") ?? entry.alt;
    const href = this.getAttribute("href");

    const img = document.createElement("img");
    img.className = `${BL_CLASS}__img`;
    img.src = entry.src;
    img.alt = alt;
    img.style.height = `${height}px`;
    img.style.width =
      widthAttr && widthAttr.trim() !== "" && Number.isFinite(Number(widthAttr))
        ? `${Number(widthAttr)}px`
        : "auto";

    let child: HTMLElement = img;
    if (href) {
      const anchor = document.createElement("a");
      anchor.className = `${BL_CLASS}__link`;
      anchor.href = href;
      anchor.appendChild(img);
      child = anchor;
    }

    this._root.replaceChildren(child);
  }

  private _numberAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }
}

define(NdsProjectLogo);
