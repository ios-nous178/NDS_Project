/**
 * <nds-modal> — DS Modal 의 vanilla Web Component 버전 (MVP).
 *
 * 사용 예:
 *   <nds-modal id="m1" open title="안내" max-width="332">
 *     <p>본문 내용입니다.</p>
 *     <div slot="footer">  ← .nds-modal__footer 로 승격돼 body 의 형제로 배치됨
 *       <nds-button>확인</nds-button>          (단일: 캐포비는 우측 정렬 검정 pill)
 *     </div>
 *   </nds-modal>
 *
 * footer slot:
 *   · slot="footer" 컨테이너는 자동으로 .nds-modal__footer 클래스를 받고 content 안
 *     body 의 형제로 올라간다 → footer 레이아웃 CSS(본문↔푸터 gap, 버튼 정렬)가 적용됨.
 *   · 버튼이 2개 이상이면 data-has-both-actions="true" 로 가로 분할(dual),
 *     1개면 single — data-brand="cashwalk-biz" 에서는 우측 정렬 + 검정 pill 로 cascade.
 *   · 직접 가로 정렬을 제어하려면 footer 컨테이너에 data-layout="custom".
 *
 * 동작:
 *   · `open` boolean attribute. 빈 값/없음 = 닫힘.
 *   · 닫힘 동작: ESC, overlay 클릭(`mask`/`is-mask-close` 가 false 가 아니면), close 버튼 클릭 (closable)
 *   · 닫힘 시 host 의 `open` attribute 가 제거되고 "modal-close" CustomEvent 디스패치
 *   · open 시 modal content 안의 첫 focusable 자동 focus, ESC + Tab focus trap
 *
 * 구조 (React Modal.tsx 와 동일):
 *   host(<nds-modal>) 자체에 nds-modal__root + fixed positioning 박는다 (Portal 없이).
 *   light DOM 으로 충분 — host 가 그냥 fixed 컨테이너.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { observeBrand, resolveLayoutFor } from "../base/brand.js";

const MODAL_CLASS = "nds-modal";
const ROOT_CLASS = `${MODAL_CLASS}__root`;
const OVERLAY_CLASS = `${MODAL_CLASS}__overlay`;
const CONTENT_CLASS = `${MODAL_CLASS}__content`;
const HEADER_CLASS = `${MODAL_CLASS}__header`;
const HEADER_TITLE_CLASS = `${MODAL_CLASS}__header-title`;
const CLOSE_CLASS = `${MODAL_CLASS}__close`;
const BODY_CLASS = `${MODAL_CLASS}__body`;
const FOOTER_CLASS = `${MODAL_CLASS}__footer`;
const FOOTER_ACTION_CLASS = `${MODAL_CLASS}__footer-action`;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableIn(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export class NdsModal extends NdsElement {
  static elementName = "nds-modal";

  static get observedAttributes(): readonly string[] {
    return ["open", "title", "closable", "mask", "is-mask-close", "max-width", "actions-layout"];
  }

  private _root: HTMLDivElement | null = null;
  private _overlay: HTMLDivElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _header: HTMLDivElement | null = null;
  private _body: HTMLDivElement | null = null;
  private _footer: HTMLElement | null = null;
  private _close: HTMLButtonElement | null = null;
  private _userBody: HTMLDivElement | null = null;
  private _wasOpen = false;
  private _previousFocus: Element | null = null;
  private _unobserveBrand: (() => void) | null = null;
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);
  private _onOverlayClick = () => {
    const maskClose = this.getAttribute("is-mask-close") !== "false";
    if (maskClose) this.close();
  };
  private _onCloseClick = () => this.close();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    // 브랜드 토글 시 actionsLayout 기본값을 다시 적용(스토리북 brand switch 등).
    if (!this._unobserveBrand) this._unobserveBrand = observeBrand(() => this.scheduleUpdate());
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._onKey, true);
    this._unobserveBrand?.();
    this._unobserveBrand = null;
  }

  private _mount(): void {
    // children 분리: slot="footer" 컨테이너는 footer 로 승격(아래), 나머지는 body 로.
    //   React Modal.tsx 와 달리 MVP 는 예전엔 slot 을 무시하고 전부 body 로 덤프했다 —
    //   그 결과 .nds-modal__footer 레이아웃 CSS(캐포비 single 우측정렬/pill 포함)가
    //   닿지 않아 모달 버튼이 본문 가운데에 끼는 회귀가 있었다. 이제 footer 를 body 의
    //   형제로 content 에 올려 CSS 가 정상 적용되게 한다.
    const footerSource = this.querySelector<HTMLElement>(':scope > [slot="footer"]');
    const userFrag = document.createDocumentFragment();
    while (this.firstChild) {
      if (this.firstChild === footerSource) {
        this.removeChild(this.firstChild);
        continue;
      }
      userFrag.appendChild(this.firstChild);
    }

    const root = document.createElement("div");
    const overlay = document.createElement("div");
    const content = document.createElement("div");
    const header = document.createElement("div");
    const body = document.createElement("div");
    const userBody = document.createElement("div");

    root.className = ROOT_CLASS;
    root.dataset.slot = "root";

    overlay.className = OVERLAY_CLASS;
    overlay.dataset.slot = "overlay";
    overlay.addEventListener("click", this._onOverlayClick);

    content.className = CONTENT_CLASS;
    content.dataset.slot = "content";
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", "true");

    header.className = HEADER_CLASS;
    header.dataset.slot = "header";

    body.className = BODY_CLASS;
    body.dataset.slot = "body";
    userBody.appendChild(userFrag);
    body.appendChild(userBody);

    content.append(header, body);

    // footer 승격: slot="footer" 컨테이너에 nds-modal__footer 클래스를 부여하고
    //   body 의 형제로 content 에 둔다(React 구조 미러 — content gap 이 본문↔푸터 간격을 만든다).
    //   액션 버튼이 2개 이상이면 data-has-both-actions="true" → dual(가로 분할),
    //   아니면 single — 캐포비는 [data-brand] cascade 로 우측 정렬 + 검정 pill.
    if (footerSource) {
      footerSource.classList.add(FOOTER_CLASS);
      footerSource.dataset.slot = "footer";
      if (!footerSource.dataset.layout && !footerSource.dataset.hasBothActions) {
        const actionCount = Array.from(footerSource.children).filter(
          (c) =>
            c.tagName === "BUTTON" ||
            c.tagName === "NDS-BUTTON" ||
            c.classList.contains(FOOTER_ACTION_CLASS),
        ).length;
        if (actionCount >= 2) footerSource.dataset.hasBothActions = "true";
      }
      content.appendChild(footerSource);
      this._footer = footerSource;
    }

    root.append(overlay, content);
    this.appendChild(root);

    this._root = root;
    this._overlay = overlay;
    this._content = content;
    this._header = header;
    this._body = body;
    this._userBody = userBody;
  }

  protected update(): void {
    if (!this._root || !this._content) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    const mask = this.getAttribute("mask") !== "false";
    const maxWidth = this.getAttribute("max-width");
    const titleText = this.getAttribute("title");
    const closable = this.boolAttr("closable");

    this._root.dataset.open = String(open);
    this._root.style.display = open ? "" : "none";
    this._overlay!.style.display = mask ? "" : "none";

    if (maxWidth) this._content.style.setProperty("--nds-modal-max-width", `${maxWidth}px`);
    else this._content.style.removeProperty("--nds-modal-max-width");

    // 버튼 배치 — actions-layout attr 우선, 없으면 브랜드 기본(SSOT). custom 은 존중.
    if (this._footer && this._footer.dataset.layout !== "custom") {
      this._footer.dataset.layout = resolveLayoutFor(this, this.getAttribute("actions-layout"));
    }

    this._syncHeader(titleText, closable);

    if (open && !this._wasOpen) this._handleOpen();
    else if (!open && this._wasOpen) this._handleClose();
    this._wasOpen = open;
  }

  private _syncHeader(titleText: string | null, closable: boolean): void {
    if (!this._header) return;
    this._header.innerHTML = "";

    if (titleText) {
      const h = document.createElement("h2");
      h.dataset.slot = "header-content";
      h.className = HEADER_TITLE_CLASS;
      h.textContent = titleText;
      this._header.appendChild(h);
      this._content?.setAttribute("aria-labelledby", "");
    }

    if (closable) {
      if (!this._close) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = CLOSE_CLASS;
        btn.dataset.slot = "close";
        btn.setAttribute("aria-label", "닫기");
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>' +
          "</svg>";
        btn.addEventListener("click", this._onCloseClick);
        this._close = btn;
      }
      this._header.appendChild(this._close);
    } else if (this._close) {
      this._close.remove();
    }

    // header 가 비어있으면 (title 도 closable 도 없음) 자체를 숨겨 layout 영향 0
    this._header.style.display = this._header.children.length === 0 ? "none" : "";
  }

  private _handleOpen(): void {
    this._previousFocus = document.activeElement;
    document.addEventListener("keydown", this._onKey, true);
    // 첫 focusable 자동 focus — content 내부에서 찾음
    queueMicrotask(() => {
      if (!this._content) return;
      const focusables = focusableIn(this._content);
      const first = focusables[0] ?? this._content;
      (first as HTMLElement).focus({ preventScroll: true });
    });
  }

  private _handleClose(): void {
    document.removeEventListener("keydown", this._onKey, true);
    // 원래 focus 위치 복원
    if (this._previousFocus instanceof HTMLElement) {
      this._previousFocus.focus({ preventScroll: true });
    }
    this._previousFocus = null;
    this.dispatchEvent(new CustomEvent("modal-close", { bubbles: true, composed: true }));
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key === "Tab" && this._content) {
      // 단순 focus trap
      const focusables = focusableIn(this._content);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !this._content.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /** 외부에서 호출 가능: el.open() / el.close() */
  open(): void {
    this.setAttribute("open", "");
  }

  close(): void {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
  }
}

define(NdsModal);
