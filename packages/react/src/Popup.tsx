import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cv, fontFamily, radius, spacing, typeScale, shadow, zIndex } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const POPUP_CLASS = "nds-popup";
const POPUP_ROOT_CLASS = `${POPUP_CLASS}__root`;
const POPUP_OVERLAY_CLASS = `${POPUP_CLASS}__overlay`;
const POPUP_CONTENT_CLASS = `${POPUP_CLASS}__content`;
const POPUP_TEXT_CLASS = `${POPUP_CLASS}__text`;
const POPUP_TITLE_CLASS = `${POPUP_CLASS}__title`;
const POPUP_DESC_CLASS = `${POPUP_CLASS}__description`;
const POPUP_ACTIONS_CLASS = `${POPUP_CLASS}__actions`;
const POPUP_BTN_CLASS = `${POPUP_CLASS}__btn`;
const POPUP_BTN_CANCEL_CLASS = `${POPUP_CLASS}__btn--cancel`;
const POPUP_BTN_CONFIRM_CLASS = `${POPUP_CLASS}__btn--confirm`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const popupStyles = `
  :where(.${POPUP_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${zIndex.popup};
    padding: ${spacing[30]}px;
  }

  :where(.${POPUP_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: ${cv.surface.overlay};
    animation: nds-popup-fade-in 0.2s ease-out;
  }

  :where(.${POPUP_CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-popup-max-width, 400px);
    display: flex;
    flex-direction: column;
    gap: var(--gap-wide);
    padding: ${spacing[28]}px var(--inset-card) var(--inset-card);
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    animation: nds-popup-scale-in 0.2s ease-out;
  }

  :where(.${POPUP_TEXT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-default);
    text-align: center;
    color: ${cv.textRole.normal};
    font-family: ${fontFamily.web};
  }

  :where(.${POPUP_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${POPUP_DESC_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: 400;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${POPUP_ACTIONS_CLASS}) {
    display: flex;
    gap: var(--gap-default);
    width: 100%;
  }

  :where(.${POPUP_ACTIONS_CLASS}[data-single="true"]) {
    flex-direction: column;
  }

  :where(.${POPUP_BTN_CLASS}) {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: ${spacing[10]}px var(--inset-card);
    border: none;
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body2.lineHeight}px;
    cursor: pointer;
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }

  :where(.${POPUP_BTN_CLASS}:active) {
    opacity: 0.8;
  }

  :where(.${POPUP_BTN_CANCEL_CLASS}) {
    background: ${cv.textRole.muted};
    color: ${cv.surface.default};
  }

  :where(.${POPUP_BTN_CONFIRM_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  @keyframes nds-popup-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-popup-scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonHTMLProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/* ─── Context (compound) ─── */

interface PopupContextValue {
  open: boolean;
  onClose?: () => void;
  titleId: string;
  descId: string;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

const usePopupContext = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("Popup compound components must be used within Popup.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface PopupRootProps extends Omit<DivProps, "children"> {
  /** 팝업 표시 여부 */
  open: boolean;
  /** 팝업 닫힘 시 호출되는 콜백 */
  onClose?: () => void;
  /** 팝업 내부 콘텐츠 (Overlay, Content 등) */
  children: React.ReactNode;
}

export const PopupRoot: React.FC<PopupRootProps> = ({
  open,
  onClose,
  children,
  className,
  style,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();
  const previousOverflowRef = useRef("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <PopupContext.Provider value={{ open, onClose, titleId, descId }}>
      <div data-slot="root" className={cx(POPUP_ROOT_CLASS, className)} style={style} {...rest}>
        {children}
      </div>
    </PopupContext.Provider>,
    document.body,
  );
};

/* ─── Compound: Overlay ─── */

export interface PopupOverlayProps extends DivProps {
  /** 오버레이 클릭 시 팝업 닫힘 여부 @default true */
  isMaskClose?: boolean;
}

export const PopupOverlay: React.FC<PopupOverlayProps> = ({
  isMaskClose = true,
  className,
  onClick,
  ...rest
}) => {
  const { onClose } = usePopupContext();

  return (
    <div
      data-slot="overlay"
      className={cx(POPUP_OVERLAY_CLASS, className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && isMaskClose) onClose?.();
      }}
      {...rest}
    />
  );
};

/* ─── Compound: Content ─── */

export interface PopupContentProps extends Omit<DivProps, "children"> {
  /** 콘텐츠 최대 너비 (px) */
  maxWidth?: number;
  /** 팝업 콘텐츠 (TextInfo, Actions 등) */
  children: React.ReactNode;
}

export const PopupContent: React.FC<PopupContentProps> = ({
  maxWidth,
  children,
  className,
  style,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const { onClose, titleId, descId } = usePopupContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    const el = contentRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>("button:not([disabled])");
    (focusable[0] ?? el).focus();

    return () => {
      previousActiveElementRef.current?.focus();
    };
  }, []);

  return (
    <div
      ref={contentRef}
      data-slot="content"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={-1}
      className={cx(POPUP_CONTENT_CLASS, className)}
      style={
        {
          "--nds-popup-max-width": maxWidth ? `${maxWidth}px` : undefined,
          ...style,
        } as React.CSSProperties
      }
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "Escape") {
          onClose?.();
          return;
        }
        if (e.key === "Tab" && contentRef.current) {
          const btns = Array.from(
            contentRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"),
          );
          if (btns.length === 0) return;
          const first = btns[0];
          const last = btns[btns.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ─── Compound: TextInfo ─── */

export interface PopupTextInfoProps extends Omit<DivProps, "children"> {
  /** 텍스트 정보 영역 콘텐츠 (Title, Description) */
  children: React.ReactNode;
}

export const PopupTextInfo: React.FC<PopupTextInfoProps> = ({ children, className, ...rest }) => (
  <div data-slot="text-info" className={cx(POPUP_TEXT_CLASS, className)} {...rest}>
    {children}
  </div>
);

/* ─── Compound: Title ─── */

export interface PopupTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 팝업 제목 텍스트 (`<h3>`으로 렌더링, aria-labelledby 연결) */
  children: React.ReactNode;
}

export const PopupTitle: React.FC<PopupTitleProps> = ({ children, className, ...rest }) => {
  const { titleId } = usePopupContext();
  return (
    <h3 id={titleId} data-slot="title" className={cx(POPUP_TITLE_CLASS, className)} {...rest}>
      {children}
    </h3>
  );
};

/* ─── Compound: Description ─── */

export interface PopupDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 팝업 설명 텍스트 (aria-describedby 연결) */
  children: React.ReactNode;
}

export const PopupDescription: React.FC<PopupDescriptionProps> = ({
  children,
  className,
  ...rest
}) => {
  const { descId } = usePopupContext();
  return (
    <p id={descId} data-slot="description" className={cx(POPUP_DESC_CLASS, className)} {...rest}>
      {children}
    </p>
  );
};

/* ─── Compound: Actions ─── */

export interface PopupActionsProps extends Omit<DivProps, "children"> {
  /** 액션 버튼 콘텐츠 (CancelButton, ConfirmButton 등) */
  children: React.ReactNode;
}

export const PopupActions: React.FC<PopupActionsProps> = ({ children, className, ...rest }) => {
  const count = React.Children.count(children);
  return (
    <div
      data-slot="actions"
      data-single={count <= 1 ? "true" : "false"}
      className={cx(POPUP_ACTIONS_CLASS, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ─── Compound: CancelButton / ConfirmButton ─── */

export interface PopupCancelButtonProps extends ButtonHTMLProps {
  /** 취소 버튼 텍스트 @default "취소" */
  children?: React.ReactNode;
}

export const PopupCancelButton: React.FC<PopupCancelButtonProps> = React.memo(
  ({ children = "취소", className, onClick, ...rest }) => (
    <button
      type="button"
      data-slot="cancel-button"
      className={cx(POPUP_BTN_CLASS, POPUP_BTN_CANCEL_CLASS, className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  ),
);
PopupCancelButton.displayName = "PopupCancelButton";

export interface PopupConfirmButtonProps extends ButtonHTMLProps {
  /** 확인 버튼 텍스트 @default "확인" */
  children?: React.ReactNode;
}

export const PopupConfirmButton: React.FC<PopupConfirmButtonProps> = React.memo(
  ({ children = "확인", className, onClick, ...rest }) => (
    <button
      type="button"
      data-slot="confirm-button"
      className={cx(POPUP_BTN_CLASS, POPUP_BTN_CONFIRM_CLASS, className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  ),
);
PopupConfirmButton.displayName = "PopupConfirmButton";

/* ─── Flat (convenience) API ─── */

export interface PopupSlotProps {
  /** 루트 포털 컨테이너에 전달할 추가 props */
  root?: Omit<PopupRootProps, "open" | "onClose" | "children">;
  /** 오버레이 `<div>`에 전달할 추가 props */
  overlay?: Omit<PopupOverlayProps, "isMaskClose">;
  /** 콘텐츠 `<div>`에 전달할 추가 props */
  content?: Omit<PopupContentProps, "children" | "maxWidth">;
  /** 텍스트 정보 영역에 전달할 추가 props */
  textInfo?: Omit<PopupTextInfoProps, "children">;
  /** 제목 `<h3>`에 전달할 추가 props */
  title?: Omit<PopupTitleProps, "children">;
  /** 설명 `<p>`에 전달할 추가 props */
  description?: Omit<PopupDescriptionProps, "children">;
  /** 액션 영역 `<div>`에 전달할 추가 props */
  actions?: Omit<PopupActionsProps, "children">;
  /** 취소 `<button>`에 전달할 추가 props */
  cancelButton?: ButtonHTMLProps;
  /** 확인 `<button>`에 전달할 추가 props */
  confirmButton?: ButtonHTMLProps;
}

export interface PopupProps {
  /** 팝업 표시 여부 */
  open: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** 팝업 타이틀 (없으면 Description만 표시) */
  title?: string;
  /** 팝업 설명 (React 노드 가능 — 줄바꿈 등) */
  description?: React.ReactNode;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 확인 콜백 */
  onConfirm?: () => void;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 취소 콜백 (제공하면 Cancel 버튼 표시) */
  onCancel?: () => void;
  /** 오버레이 클릭으로 닫기 */
  isMaskClose?: boolean;
  /** 최대 너비 */
  maxWidth?: number;
  /** 추가 클래스 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: PopupSlotProps;
}

const PopupComponent: React.FC<PopupProps> = ({
  open,
  onClose,
  title,
  description,
  confirmText = "확인",
  onConfirm,
  cancelText = "취소",
  onCancel,
  isMaskClose = true,
  maxWidth,
  className,
  style,
  slotProps,
}) => {
  const showCancel = !!onCancel;

  return (
    <PopupRoot
      open={open}
      onClose={onClose}
      className={cx(slotProps?.root?.className, className)}
      style={{ ...slotProps?.root?.style, ...style }}
    >
      <PopupOverlay
        isMaskClose={isMaskClose}
        className={slotProps?.overlay?.className}
        style={slotProps?.overlay?.style}
      />
      <PopupContent
        maxWidth={maxWidth}
        className={slotProps?.content?.className}
        style={slotProps?.content?.style}
      >
        <PopupTextInfo
          className={slotProps?.textInfo?.className}
          style={slotProps?.textInfo?.style}
        >
          {title && (
            <PopupTitle className={slotProps?.title?.className} style={slotProps?.title?.style}>
              {title}
            </PopupTitle>
          )}
          {description && (
            <PopupDescription
              className={slotProps?.description?.className}
              style={slotProps?.description?.style}
            >
              {description}
            </PopupDescription>
          )}
        </PopupTextInfo>
        <PopupActions className={slotProps?.actions?.className} style={slotProps?.actions?.style}>
          {showCancel && (
            <PopupCancelButton
              className={slotProps?.cancelButton?.className}
              style={slotProps?.cancelButton?.style}
              onClick={(e) => {
                slotProps?.cancelButton?.onClick?.(e);
                if (!e.defaultPrevented) onCancel?.();
              }}
            >
              {cancelText}
            </PopupCancelButton>
          )}
          <PopupConfirmButton
            className={slotProps?.confirmButton?.className}
            style={slotProps?.confirmButton?.style}
            onClick={(e) => {
              slotProps?.confirmButton?.onClick?.(e);
              if (!e.defaultPrevented) onConfirm?.();
            }}
          >
            {confirmText}
          </PopupConfirmButton>
        </PopupActions>
      </PopupContent>
    </PopupRoot>
  );
};

/* ─── Export: Flat + Compound ─── */

export const Popup = Object.assign(PopupComponent, {
  Root: PopupRoot,
  Overlay: PopupOverlay,
  Content: PopupContent,
  TextInfo: PopupTextInfo,
  Title: PopupTitle,
  Description: PopupDescription,
  Actions: PopupActions,
  CancelButton: PopupCancelButton,
  ConfirmButton: PopupConfirmButton,
});
