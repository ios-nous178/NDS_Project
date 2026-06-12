import React, { useEffect, useId, useRef } from "react";
import { WebPortal } from "./internal/web.js";

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
