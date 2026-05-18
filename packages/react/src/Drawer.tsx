import React, { useEffect, useId, useRef } from "react";
import { cv, fontFamily, fontWeight, shadow, spacing, typeScale, zIndex } from "@nudge-eap/tokens";
import { WebPortal } from "./internal/web";

/* ─── Class names ─── */

const DR_CLASS = "nds-drawer";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_OVERLAY_CLASS = `${DR_CLASS}__overlay`;
const DR_CONTENT_CLASS = `${DR_CLASS}__content`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_HEADER_TITLE_CLASS = `${DR_CLASS}__header-title`;
const DR_HEADER_DESC_CLASS = `${DR_CLASS}__header-desc`;
const DR_CLOSE_CLASS = `${DR_CLASS}__close`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_FOOTER_CLASS = `${DR_CLASS}__footer`;

/* ─── Types ─── */

export type DrawerSide = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

const sizePx: Record<DrawerSize, number> = {
  sm: 320,
  md: 400,
  lg: 520,
};

export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 열림 상태 */
  open: boolean;
  /** 닫기 콜백 (오버레이 클릭, ESC, 닫기 버튼) */
  onClose: () => void;
  /** 좌/우 위치 */
  side?: DrawerSide;
  /** 크기 (또는 width 직접 지정) */
  size?: DrawerSize;
  /** 너비 직접 지정 (px) — size보다 우선 */
  width?: number;
  /** 헤더 타이틀 */
  title?: React.ReactNode;
  /** 헤더 보조 텍스트 */
  description?: React.ReactNode;
  /** 푸터 (보통 액션 버튼) */
  footer?: React.ReactNode;
  /** 오버레이 클릭 시 닫기 @default true */
  closeOnOverlayClick?: boolean;
  /** ESC로 닫기 @default true */
  closeOnEsc?: boolean;
  /** 헤더 닫기(X) 버튼 표시 @default true */
  showCloseButton?: boolean;
  /** body 콘텐츠 */
  children?: React.ReactNode;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const drawerStyles = `
  :where(.${DR_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    z-index: ${zIndex.modal};
    display: flex;
    font-family: ${fontFamily.web};
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"]) {
    justify-content: flex-start;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"]) {
    justify-content: flex-end;
  }

  :where(.${DR_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    animation: nds-drawer-fade-in 0.2s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-closing="true"] .${DR_OVERLAY_CLASS}) {
    animation: nds-drawer-fade-out 0.2s ease-out forwards;
  }

  :where(.${DR_CONTENT_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--nds-drawer-width, 400px);
    max-width: 100vw;
    height: 100%;
    background: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    box-sizing: border-box;
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-in-left 0.22s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-in-right 0.22s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"][data-closing="true"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-out-left 0.2s ease-in forwards;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"][data-closing="true"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-out-right 0.2s ease-in forwards;
  }

  :where(.${DR_HEADER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${spacing[12]}px;
    padding: ${spacing[20]}px ${spacing[20]}px ${spacing[16]}px;
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${DR_HEADER_CLASS}[data-empty="true"]) {
    border-bottom: none;
    padding-bottom: 0;
  }

  :where(.${DR_HEADER_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${DR_HEADER_DESC_CLASS}) {
    margin-top: ${spacing[4]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${DR_CLOSE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: -4px -4px -4px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    border-radius: 6px;
  }

  :where(.${DR_CLOSE_CLASS}:hover) {
    background: ${cv.surface.subtle};
    color: ${cv.iconRole.strong};
  }

  :where(.${DR_CLOSE_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${DR_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: ${spacing[20]}px;
    box-sizing: border-box;
  }

  :where(.${DR_FOOTER_CLASS}) {
    display: flex;
    gap: ${spacing[8]}px;
    padding: ${spacing[16]}px ${spacing[20]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  @keyframes nds-drawer-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes nds-drawer-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes nds-drawer-slide-in-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes nds-drawer-slide-out-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
  @keyframes nds-drawer-slide-in-left {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  @keyframes nds-drawer-slide-out-left {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = "right",
  size = "md",
  width,
  title,
  description,
  footer,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  portalContainer,
  className,
  ...rest
}) => {
  const titleId = useId();
  const descId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const resolvedWidth = width ?? sizePx[size];
  const hasHeader = title !== undefined || description !== undefined || showCloseButton;

  return (
    <WebPortal container={portalContainer}>
      <div
        data-slot="root"
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={cx(DR_ROOT_CLASS, className)}
        {...rest}
      >
        <div
          data-slot="overlay"
          className={DR_OVERLAY_CLASS}
          onClick={() => {
            if (closeOnOverlayClick) onClose();
          }}
        />
        <div
          ref={contentRef}
          data-slot="content"
          className={DR_CONTENT_CLASS}
          style={{ "--nds-drawer-width": `${resolvedWidth}px` } as React.CSSProperties}
        >
          {hasHeader && (
            <div
              data-slot="header"
              data-empty={!title && !description ? "true" : "false"}
              className={DR_HEADER_CLASS}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {title !== undefined && (
                  <h2 id={titleId} data-slot="title" className={DR_HEADER_TITLE_CLASS}>
                    {title}
                  </h2>
                )}
                {description !== undefined && (
                  <p id={descId} data-slot="description" className={DR_HEADER_DESC_CLASS}>
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  aria-label="닫기"
                  data-slot="close"
                  className={DR_CLOSE_CLASS}
                  onClick={onClose}
                >
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div data-slot="body" className={DR_BODY_CLASS}>
            {children}
          </div>
          {footer !== undefined && (
            <div data-slot="footer" className={DR_FOOTER_CLASS}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </WebPortal>
  );
};

Drawer.displayName = "Drawer";
