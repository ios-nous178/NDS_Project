import { NdsElement, define } from "../base/nds-element.js";

const CC_CLASS = "nds-crisis-callout";
const CC_ICON_CLASS = `${CC_CLASS}__icon`;
const CC_CONTENT_CLASS = `${CC_CLASS}__content`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__description`;
const CC_ACTIONS_CLASS = `${CC_CLASS}__actions`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

export type CrisisTone = "danger" | "caution";

const AlertIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M12 2L22 20H2L12 2Z");
  path1.setAttribute("stroke", "currentColor");
  path1.setAttribute("stroke-width", "2");
  path1.setAttribute("stroke-linejoin", "round");
  path1.setAttribute("fill", "currentColor");
  path1.setAttribute("fill-opacity", "0.15");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M12 9V14");
  path2.setAttribute("stroke", "currentColor");
  path2.setAttribute("stroke-width", "2");
  path2.setAttribute("stroke-linecap", "round");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "17");
  circle.setAttribute("r", "1");
  circle.setAttribute("fill", "currentColor");

  svg.append(path1, path2, circle);
  return svg;
};

const PhoneIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M3.5 2.5C3.5 2.22386 3.72386 2 4 2H6L7 5L5.5 6C6.5 8 8 9.5 10 10.5L11 9L14 10V12C14 12.2761 13.7761 12.5 13.5 12.5C7.97715 12.5 3.5 8.02285 3.5 2.5Z",
  );
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("fill-opacity", "0.2");

  svg.appendChild(path);
  return svg;
};

/* ──────────────── <nds-crisis-callout> ──────────────── */

export class NdsCrisisCallout extends NdsElement {
  static elementName = "nds-crisis-callout";

  static get observedAttributes(): readonly string[] {
    return ["tone", "title", "description"];
  }

  private _root: HTMLDivElement | null = null;
  private _iconContainer: HTMLSpanElement | null = null;
  private _title: HTMLParagraphElement | null = null;
  private _desc: HTMLParagraphElement | null = null;
  private _actions: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.className = CC_CLASS;
    root.dataset.slot = "root";
    root.setAttribute("role", "alert");

    const iconSpan = document.createElement("span");
    iconSpan.className = CC_ICON_CLASS;
    iconSpan.dataset.slot = "icon";

    const content = document.createElement("div");
    content.className = CC_CONTENT_CLASS;
    content.dataset.slot = "content";

    const title = document.createElement("p");
    title.className = CC_TITLE_CLASS;
    title.dataset.slot = "title";

    const desc = document.createElement("p");
    desc.className = CC_DESC_CLASS;
    desc.dataset.slot = "description";

    const actions = document.createElement("div");
    actions.className = CC_ACTIONS_CLASS;
    actions.dataset.slot = "actions";

    // Move children to appropriate places
    const children = Array.from(this.childNodes);
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        if (child.getAttribute("slot") === "icon") {
          iconSpan.appendChild(child);
          return;
        }
        if (
          child.tagName.toLowerCase() === "nds-crisis-callout-action" ||
          child.getAttribute("slot") === "action"
        ) {
          actions.appendChild(child);
          return;
        }
      }
      // Everything else just goes to description or somewhere?
      // React version doesn't have a default slot for children besides props.
      // But we can keep them in description if it's text.
    });

    content.append(title, desc, actions);
    root.append(iconSpan, content);
    this.appendChild(root);

    this._root = root;
    this._iconContainer = iconSpan;
    this._title = title;
    this._desc = desc;
    this._actions = actions;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const tone = (this.getAttribute("tone") as CrisisTone) || "danger";
    const titleText = this.getAttribute("title") || "";
    const descText = this.getAttribute("description") || "";

    this._root.dataset.tone = tone;

    if (this._title) {
      this._title.textContent = titleText;
      this._title.style.display = titleText ? "" : "none";
    }

    if (this._desc) {
      this._desc.textContent = descText;
      this._desc.style.display = descText ? "" : "none";
    }

    // Default icon if none provided
    if (this._iconContainer && !this._iconContainer.querySelector('[slot="icon"]')) {
      if (!this._iconContainer.querySelector("svg")) {
        this._iconContainer.appendChild(AlertIcon());
      }
    }

    // Actions visibility
    if (this._actions) {
      const hasActions = this._actions.children.length > 0;
      this._actions.style.display = hasActions ? "" : "none";
    }
  }
}

/* ──────────────── <nds-crisis-callout-action> ──────────────── */

export class NdsCrisisCalloutAction extends NdsElement {
  static elementName = "nds-crisis-callout-action";

  static get observedAttributes(): readonly string[] {
    return ["label", "phone-number", "variant", "with-phone-icon"];
  }

  private _el: HTMLAnchorElement | HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._el) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const phoneNumber = this.getAttribute("phone-number");
    const tag = phoneNumber ? "a" : "button";
    const el = document.createElement(tag) as HTMLAnchorElement | HTMLButtonElement;
    el.className = CC_ACTION_CLASS;
    el.dataset.slot = "action";

    this.appendChild(el);
    this._el = el;
  }

  protected update(): void {
    if (!this._el) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const label = this.getAttribute("label") || "";
    const phoneNumber = this.getAttribute("phone-number");
    const variant = this.getAttribute("variant") || "solid";
    const withPhoneIcon = this.boolAttr("with-phone-icon") || !!phoneNumber;

    // Handle tag change if phone-number attribute is added/removed dynamically
    const expectedTag = phoneNumber ? "a" : "button";
    let el = this._el;
    if (el.tagName.toLowerCase() !== expectedTag) {
      const newEl = document.createElement(expectedTag) as HTMLAnchorElement | HTMLButtonElement;
      newEl.className = CC_ACTION_CLASS;
      newEl.dataset.slot = "action";
      el.replaceWith(newEl);
      this._el = newEl;
      el = newEl;
    }

    el.dataset.variant = variant;

    if (phoneNumber) {
      (el as HTMLAnchorElement).href = `tel:${phoneNumber}`;
    } else {
      (el as HTMLButtonElement).type = "button";
    }

    el.innerHTML = "";
    if (withPhoneIcon) {
      el.appendChild(PhoneIcon());
    }
    el.appendChild(document.createTextNode(label));
  }
}

define(NdsCrisisCallout);
define(NdsCrisisCalloutAction);
