import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const BS_CLASS = "nds-bottom-sheet";
const BS_ROOT_CLASS = `${BS_CLASS}__root`;
const BS_OVERLAY_CLASS = `${BS_CLASS}__overlay`;
const BS_CONTENT_CLASS = `${BS_CLASS}__content`;
const BS_HANDLE_CLASS = `${BS_CLASS}__handle`;
const BS_HEADER_CLASS = `${BS_CLASS}__header`;
const BS_HEADER_TITLE_CLASS = `${BS_CLASS}__header-title`;
const BS_CLOSE_CLASS = `${BS_CLASS}__close`;
const BS_BODY_CLASS = `${BS_CLASS}__body`;
const BS_FOOTER_CLASS = `${BS_CLASS}__footer`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const bottomSheetStyles = `
  :where(.${BS_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
  }

  :where(.${BS_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    animation: nds-bs-fade-in 0.2s ease-out;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_OVERLAY_CLASS}) {
    animation: nds-bs-fade-out 0.2s ease-out forwards;
  }

  :where(.${BS_CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-bottom-sheet-max-width, 664px);
    max-height: var(--nds-bottom-sheet-max-height, 85vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--nds-bottom-sheet-radius, ${radius.lg}px) var(--nds-bottom-sheet-radius, ${radius.lg}px) 0 0;
    background-color: ${cv.surface.default};
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    animation: nds-bs-slide-up 0.2s ease-out;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_CONTENT_CLASS}) {
    animation: nds-bs-slide-down 0.2s ease-out forwards;
  }

  :where(.${BS_HANDLE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing[12]}px 0 ${spacing[4]}px;
    cursor: grab;
  }

  :where(.${BS_HANDLE_CLASS}::after) {
    content: "";
    width: var(--nds-bottom-sheet-handle-width, 36px);
    height: var(--nds-bottom-sheet-handle-height, 4px);
    border-radius: ${radius.pill}px;
    background: var(--nds-bottom-sheet-handle-color, ${cv.borderRole.normal});
  }

  :where(.${BS_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[12]}px;
    padding: ${spacing[16]}px ${spacing[20]}px;
  }

  :where(.${BS_HEADER_CLASS}[data-has-title="true"]) {
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BS_HEADER_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${BS_CLOSE_CLASS}) {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    font-size: 20px;
    line-height: 1;
    color: ${cv.textRole.muted};
  }

  :where(.${BS_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: ${spacing[20]}px;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.5;
    color: ${cv.textRole.subtle};
  }

  :where(.${BS_FOOTER_CLASS}) {
    display: flex;
    gap: ${spacing[8]}px;
    padding: ${spacing[12]}px ${spacing[20]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BS_FOOTER_CLASS} > *) {
    flex: 1;
    min-width: 0;
  }

  @keyframes nds-bs-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-bs-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes nds-bs-slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes nds-bs-slide-down {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context ─── */

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface BottomSheetContextValue {
  onClose?: () => void;
  titleId: string;
  descriptionId: string;
  startClose: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(undefined);

const useBottomSheetContext = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error("BottomSheet compound components must be used within BottomSheet.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface BottomSheetRootProps extends Omit<DivProps, "children"> {
  /** 바텀시트 표시 여부 */
  open: boolean;
  /** 바텀시트 닫힘 시 호출되는 콜백 */
  onClose?: () => void;
  /** 바텀시트 내부 콘텐츠 (Overlay, Content 등) */
  children: React.ReactNode;
}

export const BottomSheetRoot: React.FC<BottomSheetRootProps> = ({
  open,
  onClose,
  children,
  className,
  style,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const previousOverflowRef = useRef<string>("");

  const startClose = React.useCallback(() => {
    setClosing(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (open) {
      setClosing(false);
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [open]);

  const handleAnimationEnd = React.useCallback(() => {
    if (closing) {
      setClosing(false);
      onClose?.();
    }
  }, [closing, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <BottomSheetContext.Provider value={{ onClose, titleId, descriptionId, startClose }}>
      <div
        data-slot="root"
        data-closing={closing ? "true" : "false"}
        className={cx(BS_ROOT_CLASS, className)}
        style={style}
        onAnimationEnd={handleAnimationEnd}
        {...rest}
      >
        {children}
      </div>
    </BottomSheetContext.Provider>,
    document.body,
  );
};

/* ─── Compound: Overlay ─── */

export interface BottomSheetOverlayProps extends DivProps {
  /** 오버레이 클릭 시 바텀시트 닫힘 여부 @default true */
  isMaskClose?: boolean;
}

export const BottomSheetOverlay: React.FC<BottomSheetOverlayProps> = ({
  isMaskClose = true,
  className,
  onClick,
  ...rest
}) => {
  const { startClose } = useBottomSheetContext();

  return (
    <div
      data-slot="overlay"
      className={cx(BS_OVERLAY_CLASS, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && isMaskClose) {
          startClose();
        }
      }}
      {...rest}
    />
  );
};

/* ─── Compound: Content ─── */

export interface BottomSheetContentProps extends Omit<DivProps, "children"> {
  /** 콘텐츠 최대 너비 (px) @default 664 */
  maxWidth?: number;
  /** 콘텐츠 최대 높이 (CSS 값) @default "85vh" */
  maxHeight?: string;
  /** 바텀시트 콘텐츠 (Handle, Header, Body, Footer 등) */
  children: React.ReactNode;
  /** 접근성 라벨 (title이 없을 때 사용) */
  "aria-label"?: string;
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  maxWidth = 664,
  maxHeight = "85vh",
  children,
  className,
  style,
  "aria-label": ariaLabel,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const { startClose, titleId, descriptionId } = useBottomSheetContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const focusable = getFocusableElements(el);
    const target = focusable[0] ?? el;
    target.focus();
  }, []);

  return (
    <div
      ref={contentRef}
      data-slot="content"
      className={cx(BS_CONTENT_CLASS, className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabel ? undefined : titleId}
      aria-label={ariaLabel}
      aria-describedby={descriptionId}
      tabIndex={-1}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) {
          if (event.key === "Escape") {
            startClose();
            return;
          }
          handleFocusTrap(event, contentRef.current);
        }
      }}
      style={
        {
          "--nds-bottom-sheet-max-width": `${maxWidth}px`,
          "--nds-bottom-sheet-max-height": maxHeight,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
};

/* ─── Compound: Handle ─── */

export type BottomSheetHandleProps = DivProps;

export const BottomSheetHandle: React.FC<BottomSheetHandleProps> = React.memo(
  ({ className, ...rest }) => (
    <div
      data-slot="handle"
      className={cx(BS_HANDLE_CLASS, className)}
      aria-hidden="true"
      {...rest}
    />
  ),
);
BottomSheetHandle.displayName = "BottomSheetHandle";

/* ─── Compound: Header ─── */

export interface BottomSheetHeaderProps extends Omit<DivProps, "title" | "children"> {
  /** 바텀시트 제목 텍스트 */
  title?: string;
  /** 닫기(✕) 버튼 표시 여부 */
  closable?: boolean;
  /** 커스텀 헤더 콘텐츠 (title 대신 사용) */
  children?: React.ReactNode;
  /** 닫기 버튼에 전달할 추가 props */
  closeButtonProps?: ButtonProps;
}

export const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
  title,
  closable,
  children,
  className,
  closeButtonProps,
  ...rest
}) => {
  const { startClose, titleId } = useBottomSheetContext();

  return (
    <div
      data-slot="header"
      data-has-title={title || children ? "true" : "false"}
      className={cx(BS_HEADER_CLASS, className)}
      {...rest}
    >
      {children ? (
        <div id={titleId} className={BS_HEADER_TITLE_CLASS}>
          {children}
        </div>
      ) : (
        title && (
          <h3 id={titleId} className={BS_HEADER_TITLE_CLASS}>
            {title}
          </h3>
        )
      )}
      {closable && (
        <button
          type="button"
          aria-label="닫기"
          data-slot="close"
          className={cx(BS_CLOSE_CLASS, closeButtonProps?.className)}
          onClick={(event) => {
            closeButtonProps?.onClick?.(event);
            if (!event.defaultPrevented) {
              startClose();
            }
          }}
          style={closeButtonProps?.style}
        >
          ✕
        </button>
      )}
    </div>
  );
};

/* ─── Compound: Body ─── */

export interface BottomSheetBodyProps extends Omit<DivProps, "children"> {
  /** 바텀시트 본문 콘텐츠 */
  children: React.ReactNode;
}

export const BottomSheetBody: React.FC<BottomSheetBodyProps> = ({
  children,
  className,
  ...rest
}) => {
  const { descriptionId } = useBottomSheetContext();

  return (
    <div id={descriptionId} data-slot="body" className={cx(BS_BODY_CLASS, className)} {...rest}>
      {children}
    </div>
  );
};

/* ─── Compound: Footer ─── */

export interface BottomSheetFooterProps extends Omit<DivProps, "children"> {
  /** 바텀시트 푸터 콘텐츠 (액션 버튼 등) */
  children: React.ReactNode;
}

export const BottomSheetFooter: React.FC<BottomSheetFooterProps> = ({
  children,
  className,
  ...rest
}) => (
  <div data-slot="footer" className={cx(BS_FOOTER_CLASS, className)} {...rest}>
    {children}
  </div>
);

/* ─── Flat API ─── */

export interface BottomSheetSlotProps {
  /** 루트 포털 컨테이너에 전달할 추가 props */
  root?: Omit<BottomSheetRootProps, "open" | "onClose" | "children">;
  /** 오버레이 `<div>`에 전달할 추가 props */
  overlay?: Omit<BottomSheetOverlayProps, "isMaskClose">;
  /** 콘텐츠 `<div>`에 전달할 추가 props */
  content?: Omit<BottomSheetContentProps, "children" | "maxWidth" | "maxHeight">;
  /** 드래그 핸들 `<div>`에 전달할 추가 props */
  handle?: BottomSheetHandleProps;
  /** 헤더 `<div>`에 전달할 추가 props */
  header?: Omit<BottomSheetHeaderProps, "title" | "closable" | "children">;
  /** 본문 `<div>`에 전달할 추가 props */
  body?: Omit<BottomSheetBodyProps, "children">;
  /** 푸터 `<div>`에 전달할 추가 props */
  footer?: Omit<BottomSheetFooterProps, "children">;
}

export interface BottomSheetProps {
  /** 열림 상태 */
  open: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** 닫기 버튼 표시 */
  closable?: boolean;
  /** 오버레이 표시 */
  mask?: boolean;
  /** 오버레이 클릭 시 닫기 */
  isMaskClose?: boolean;
  /** 드래그 핸들 표시 */
  showHandle?: boolean;
  /** 타이틀 텍스트 */
  title?: string;
  /** 본문 콘텐츠 */
  children: React.ReactNode;
  /** 푸터 콘텐츠 */
  footer?: React.ReactNode;
  /** 최대 너비 */
  maxWidth?: number;
  /** 최대 높이 */
  maxHeight?: string;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: BottomSheetSlotProps;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  closable = false,
  mask = true,
  isMaskClose = true,
  showHandle = true,
  title,
  children,
  footer,
  maxWidth,
  maxHeight,
  className,
  style,
  slotProps,
}) => (
  <BottomSheetRoot
    open={open}
    onClose={onClose}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    {mask && (
      <BottomSheetOverlay
        isMaskClose={isMaskClose}
        className={slotProps?.overlay?.className}
        style={slotProps?.overlay?.style}
      />
    )}
    <BottomSheetContent
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      className={slotProps?.content?.className}
      style={slotProps?.content?.style}
    >
      {showHandle && (
        <BottomSheetHandle
          className={slotProps?.handle?.className}
          style={slotProps?.handle?.style}
        />
      )}
      {(title || closable) && (
        <BottomSheetHeader
          title={title}
          closable={closable}
          className={slotProps?.header?.className}
          style={slotProps?.header?.style}
          closeButtonProps={slotProps?.header?.closeButtonProps}
        />
      )}
      <BottomSheetBody className={slotProps?.body?.className} style={slotProps?.body?.style}>
        {children}
      </BottomSheetBody>
      {footer && (
        <BottomSheetFooter
          className={slotProps?.footer?.className}
          style={slotProps?.footer?.style}
        >
          {footer}
        </BottomSheetFooter>
      )}
    </BottomSheetContent>
  </BottomSheetRoot>
);

BottomSheetComponent.displayName = "BottomSheet";

/* ─── Export: Flat + Compound ─── */

export const BottomSheet = Object.assign(BottomSheetComponent, {
  Root: BottomSheetRoot,
  Overlay: BottomSheetOverlay,
  Content: BottomSheetContent,
  Handle: BottomSheetHandle,
  Header: BottomSheetHeader,
  Body: BottomSheetBody,
  Footer: BottomSheetFooter,
});

/* ─── Helpers ─── */

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("aria-hidden"));
}

function handleFocusTrap(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: HTMLDivElement | null,
) {
  if (event.key !== "Tab" || !container) return;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
