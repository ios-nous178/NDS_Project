import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cv, radius, spacing, typeScale, shadow, zIndex } from "@nudge-eap/tokens";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface ModalContextValue {
  open: boolean;
  onClose?: () => void;
  titleId: string;
  descriptionId: string;
}

const MODAL_CLASS = "nds-modal";
const ROOT_CLASS = `${MODAL_CLASS}__root`;
const OVERLAY_CLASS = `${MODAL_CLASS}__overlay`;
const CONTENT_CLASS = `${MODAL_CLASS}__content`;
const HEADER_CLASS = `${MODAL_CLASS}__header`;
const HEADER_SPACER_CLASS = `${MODAL_CLASS}__header-spacer`;
const HEADER_TITLE_CLASS = `${MODAL_CLASS}__header-title`;
const CLOSE_CLASS = `${MODAL_CLASS}__close`;
const BODY_CLASS = `${MODAL_CLASS}__body`;
const IMAGE_CLASS = `${MODAL_CLASS}__image`;
const FOOTER_CLASS = `${MODAL_CLASS}__footer`;
const FOOTER_ACTION_CLASS = `${MODAL_CLASS}__footer-action`;
const FOOTER_CANCEL_CLASS = `${MODAL_CLASS}__footer-cancel`;
const FOOTER_CONFIRM_CLASS = `${MODAL_CLASS}__footer-confirm`;

export type ModalDevice = "pc" | "mobile";

const DEVICE_WIDTH: Record<ModalDevice, number> = {
  pc: 332,
  mobile: 294,
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be used within Modal.Root");
  }
  return context;
};

// eslint-disable-next-line unused-imports/no-unused-vars
const modalStyles = `
  :where(.${ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${zIndex.modal};
    padding: var(--inset-card-large);
  }

  :where(.${OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: ${cv.surface.overlay};
    animation: nds-modal-fade-in 0.2s ease-out;
  }

  /* Figma · Modal · Mobile 294 / PC 332 카드 패딩(비대칭):
     top 28 / x 16 / bottom 16, 본문 그룹과 버튼 그룹 사이 gap 24px.
     image-title-description 그룹 내부는 gap 8px. */
  :where(.${CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-modal-max-width, 332px);
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    padding: ${spacing[28]}px var(--inset-card) var(--inset-card);
    overflow: hidden;
    border-radius: var(--nds-modal-radius, ${radius.md}px);
    background-color: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    animation: nds-modal-slide-up 0.2s ease-out;
    box-sizing: border-box;
  }

  /* Header: 좌측 28px 고스트 스페이서 + flex:1 타이틀 + 우측 28px 닫기 버튼.
     스페이서가 X 버튼 폭을 좌측에 미러링해서 타이틀이 모달 박스 기준 정중앙에 정렬됨. */
  :where(.${HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-comfortable);
    padding: 0;
  }

  :where(.${HEADER_SPACER_CLASS}) {
    flex: 0 0 28px;
    height: 28px;
    visibility: hidden;
  }

  :where(.${HEADER_TITLE_CLASS}) {
    margin: 0;
    flex: 1;
    text-align: center;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${CLOSE_CLASS}) {
    flex: 0 0 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    font-size: 20px;
    line-height: 1;
    color: ${cv.textRole.muted};
  }

  :where(.${BODY_CLASS}) {
    padding: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    text-align: center;
  }

  /* 본문 그룹(image/header/body)과 푸터 사이 24px gap:
     ModalContent 의 gap 8px + 추가 16px margin */
  :where(.${BODY_CLASS}:has(+ .${FOOTER_CLASS})) {
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${IMAGE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin: 0 auto;
  }

  :where(.${IMAGE_CLASS} > *) {
    width: 100%;
    height: 100%;
  }

  /* Figma · Modal · Footer (171:9947 등): Primary 솔리드 + Outlined Cancel 가로 분할.
     버튼 padding 11/24, radius 8, gap 8, font 15/22. */
  :where(.${FOOTER_CLASS}) {
    display: flex;
    width: 100%;
    gap: var(--gap-default);
    box-sizing: border-box;
  }

  :where(.${FOOTER_CLASS}[data-layout="custom"]) {
    padding: 0;
    gap: var(--gap-default);
    justify-content: center;
  }

  :where(.${FOOTER_CLASS}[data-layout="custom"] > *) {
    min-width: 0;
  }

  :where(.${FOOTER_ACTION_CLASS}) {
    flex: 1;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing[11]}px var(--inset-modal);
    border-radius: ${radius.md}px;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    box-sizing: border-box;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  :where(.${FOOTER_CANCEL_CLASS}) {
    background-color: ${cv.surface.default};
    border-color: ${cv.borderRole.normal};
    color: ${cv.textRole.normal};
    font-weight: 500;
  }

  :where(.${FOOTER_CANCEL_CLASS}:hover) {
    background-color: ${cv.surface.subtle};
  }

  :where(.${FOOTER_CONFIRM_CLASS}) {
    background-color: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.inverse};
    font-weight: 700;
  }

  :where(.${FOOTER_CONFIRM_CLASS}:hover) {
    background-color: ${cv.fill.brandHover};
    border-color: ${cv.fill.brandHover};
  }

  :where(.${FOOTER_CONFIRM_CLASS}:active) {
    background-color: ${cv.textRole.brandStrong};
    border-color: ${cv.textRole.brandStrong};
  }

  @keyframes nds-modal-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-modal-slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export interface ModalRootProps extends Omit<DivProps, "children"> {
  /** 모달 표시 여부 */
  open: boolean;
  /** 모달 닫힘 시 호출되는 콜백 */
  onClose?: () => void;
  /** 모달 내부 콘텐츠 (Overlay, Content 등) */
  children: React.ReactNode;
}

export const ModalRoot: React.FC<ModalRootProps> = ({
  open,
  onClose,
  children,
  className,
  style,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const previousOverflowRef = useRef<string>("");
  const previousPaddingRightRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
    if (open) {
      previousOverflowRef.current = document.body.style.overflow;
      previousPaddingRightRef.current = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
      document.body.style.paddingRight = previousPaddingRightRef.current;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <ModalContext.Provider value={{ open, onClose, titleId, descriptionId }}>
      <div data-slot="root" className={cx(ROOT_CLASS, className)} style={style} {...rest}>
        {children}
      </div>
    </ModalContext.Provider>,
    document.body,
  );
};

export interface ModalOverlayProps extends DivProps {
  /** 오버레이 클릭 시 모달 닫힘 여부 @default true */
  isMaskClose?: boolean;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isMaskClose = true,
  className,
  onClick,
  ...rest
}) => {
  const { onClose } = useModalContext();

  return (
    <div
      data-slot="overlay"
      className={cx(OVERLAY_CLASS, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && isMaskClose) {
          onClose?.();
        }
      }}
      {...rest}
    />
  );
};

export interface ModalContentProps extends Omit<DivProps, "children"> {
  /** 콘텐츠 최대 너비 (px) @default 332 (Figma PC 기준) */
  maxWidth?: number;
  /** 모달 콘텐츠 (Header, Body, Footer 등) */
  children: React.ReactNode;
  /** 접근성 라벨 (title이 없을 때 사용) */
  "aria-label"?: string;
  /** 본문을 설명하는 요소의 ID */
  "aria-describedby"?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  maxWidth = 332,
  children,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const { onClose, titleId, descriptionId } = useModalContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    const preferredFocusTarget = contentElement.querySelector<HTMLElement>(
      '[data-modal-initial-focus="true"]',
    );
    const focusableElements = getFocusableElements(contentElement);
    const initialFocusTarget = preferredFocusTarget ?? focusableElements[0] ?? contentElement;
    initialFocusTarget.focus();

    return () => {
      previousActiveElementRef.current?.focus();
    };
  }, []);

  return (
    <div
      ref={contentRef}
      data-slot="content"
      className={cx(CONTENT_CLASS, className)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) {
          handleContentKeyDown(event, contentRef.current, onClose);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabel ? undefined : titleId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy ?? descriptionId}
      tabIndex={-1}
      style={
        {
          "--nds-modal-max-width": `${maxWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
};

export interface ModalHeaderProps extends Omit<DivProps, "title" | "children"> {
  /** 모달 제목 텍스트 */
  title?: string;
  /** 닫기(✕) 버튼 표시 여부 */
  closable?: boolean;
  /** 커스텀 헤더 콘텐츠 (title 대신 사용) */
  children?: React.ReactNode;
  /** 제목 엘리먼트에 추가할 className */
  titleClassName?: string;
  /** 제목 엘리먼트에 전달할 추가 props */
  titleProps?: DivProps;
  /** 닫기 버튼에 전달할 추가 props */
  closeButtonProps?: ButtonProps;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  closable,
  children,
  className,
  titleClassName,
  titleProps,
  closeButtonProps,
  ...rest
}) => {
  const { onClose, titleId } = useModalContext();

  const hasTitle = Boolean(title || children);

  return (
    <div
      data-slot="header"
      data-has-title={hasTitle ? "true" : "false"}
      className={cx(HEADER_CLASS, className)}
      {...rest}
    >
      {closable && hasTitle && (
        <span aria-hidden="true" data-slot="header-spacer" className={HEADER_SPACER_CLASS} />
      )}
      {children ? (
        <div
          id={titleId}
          data-slot="header-content"
          className={cx(titleClassName, titleProps?.className)}
          style={{ display: "contents", ...titleProps?.style }}
          {...omitDomProps(titleProps)}
        >
          {children}
        </div>
      ) : (
        title && (
          <h3
            id={titleId}
            className={cx(HEADER_TITLE_CLASS, titleClassName)}
            style={titleProps?.style}
          >
            {title}
          </h3>
        )
      )}
      {closable && (
        <button
          type="button"
          aria-label="모달 닫기"
          data-slot="close"
          className={cx(CLOSE_CLASS, closeButtonProps?.className)}
          onClick={(event) => {
            closeButtonProps?.onClick?.(event);
            if (!event.defaultPrevented) {
              onClose?.();
            }
          }}
          style={closeButtonProps?.style}
          {...omitButtonProps(closeButtonProps)}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export interface ModalImageProps extends Omit<DivProps, "children"> {
  /** 64px 영역 안에 들어갈 이미지/아이콘 노드 */
  children: React.ReactNode;
}

export const ModalImage: React.FC<ModalImageProps> = ({ children, className, ...rest }) => (
  <div data-slot="image" className={cx(IMAGE_CLASS, className)} {...rest}>
    {children}
  </div>
);

export interface ModalBodyProps extends Omit<DivProps, "children"> {
  /** 모달 본문 콘텐츠 */
  children: React.ReactNode;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className, ...rest }) => {
  const { descriptionId } = useModalContext();

  return (
    <div id={descriptionId} data-slot="body" className={cx(BODY_CLASS, className)} {...rest}>
      {children}
    </div>
  );
};

export interface ModalFooterProps extends Omit<DivProps, "children"> {
  /** 확인 버튼 클릭 콜백. `onClose`를 인자로 받아 호출하면 모달이 닫힘 */
  onConfirm?: (onClose: () => void) => void;
  /** 확인 버튼 텍스트 @default "확인" */
  confirmText?: string;
  /** 취소 버튼 클릭 시 호출되는 닫기 콜백 */
  onClose?: () => void;
  /** 취소 버튼 텍스트 @default "취소" */
  closeText?: string;
  /** 커스텀 푸터 콘텐츠 (기본 버튼 그룹 대신 사용) */
  children?: React.ReactNode;
  /** 취소 버튼에 전달할 추가 props */
  cancelButtonProps?: ButtonProps;
  /** 확인 버튼에 전달할 추가 props */
  confirmButtonProps?: ButtonProps;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onConfirm,
  confirmText = "확인",
  onClose: customOnClose,
  closeText = "취소",
  children,
  className,
  cancelButtonProps,
  confirmButtonProps,
  ...rest
}) => {
  const { onClose: contextOnClose } = useModalContext();
  const handleClose = customOnClose || contextOnClose || (() => {});

  if (children) {
    return (
      <div
        data-slot="footer"
        data-layout="custom"
        className={cx(FOOTER_CLASS, className)}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-slot="footer"
      data-has-both-actions={customOnClose && onConfirm ? "true" : "false"}
      className={cx(FOOTER_CLASS, className)}
      {...rest}
    >
      {customOnClose && (
        <button
          type="button"
          data-modal-initial-focus={!onConfirm ? "true" : undefined}
          className={cx(FOOTER_ACTION_CLASS, FOOTER_CANCEL_CLASS, cancelButtonProps?.className)}
          onClick={(event) => {
            cancelButtonProps?.onClick?.(event);
            if (!event.defaultPrevented) {
              handleClose();
            }
          }}
          style={cancelButtonProps?.style}
          {...omitButtonProps(cancelButtonProps)}
        >
          {closeText}
        </button>
      )}
      {onConfirm && (
        <button
          type="button"
          data-modal-initial-focus="true"
          className={cx(FOOTER_ACTION_CLASS, FOOTER_CONFIRM_CLASS, confirmButtonProps?.className)}
          onClick={(event) => {
            confirmButtonProps?.onClick?.(event);
            if (!event.defaultPrevented) {
              onConfirm(handleClose);
            }
          }}
          style={confirmButtonProps?.style}
          {...omitButtonProps(confirmButtonProps)}
        >
          {confirmText}
        </button>
      )}
    </div>
  );
};

export interface ModalSlotProps {
  /** 루트 포털 컨테이너에 전달할 추가 props */
  root?: Omit<ModalRootProps, "open" | "onClose" | "children">;
  /** 오버레이 `<div>`에 전달할 추가 props */
  overlay?: Omit<ModalOverlayProps, "isMaskClose">;
  /** 콘텐츠 `<div>`에 전달할 추가 props */
  content?: Omit<ModalContentProps, "children" | "maxWidth">;
  /** 헤더 `<div>`에 전달할 추가 props */
  header?: Omit<ModalHeaderProps, "title" | "closable" | "children">;
  /** 본문 `<div>`에 전달할 추가 props */
  body?: Omit<ModalBodyProps, "children">;
  /** 푸터 `<div>`에 전달할 추가 props */
  footer?: Omit<
    ModalFooterProps,
    "children" | "onConfirm" | "onClose" | "confirmText" | "closeText"
  >;
}

export interface ModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 닫힘 콜백 */
  onClose?: () => void;
  /** 닫기(✕) 버튼 표시 여부 */
  closable?: boolean;
  /** 오버레이 표시 여부 */
  mask?: boolean;
  /** 오버레이 클릭 시 닫힘 여부 */
  isMaskClose?: boolean;
  /** 모달 제목 */
  title?: string;
  /** 타이틀 위에 표시할 이미지/아이콘 (64x64) */
  image?: React.ReactNode;
  /** 디바이스별 기본 너비 (`pc`=332, `mobile`=294). `maxWidth`가 지정되면 무시됨. */
  device?: ModalDevice;
  /** 모달 본문 콘텐츠 */
  children: React.ReactNode;
  /** 확인 버튼 클릭 콜백. `onClose`를 인자로 받아 호출하면 모달이 닫힘 */
  onConfirm?: (onClose: () => void) => void;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소/닫기 버튼 텍스트 */
  closeText?: string;
  /** 하단 버튼 그룹 표시 여부 */
  showModalButtonGroup?: boolean;
  /** 콘텐츠 최대 너비 (px) */
  maxWidth?: number;
  /** 루트 className */
  className?: string;
  /** 루트 인라인 스타일 */
  style?: React.CSSProperties;
  /** 오버레이 className */
  overlayClassName?: string;
  /** 오버레이 인라인 스타일 */
  overlayStyle?: React.CSSProperties;
  /** 콘텐츠 래퍼 className */
  contentClassName?: string;
  /** 콘텐츠 래퍼 인라인 스타일 */
  contentStyle?: React.CSSProperties;
  /** 헤더 className */
  headerClassName?: string;
  /** 헤더 인라인 스타일 */
  headerStyle?: React.CSSProperties;
  /** 본문 className */
  bodyClassName?: string;
  /** 본문 인라인 스타일 */
  modalBodyStyle?: React.CSSProperties;
  /** 푸터 className */
  footerClassName?: string;
  /** 푸터 인라인 스타일 */
  footerStyle?: React.CSSProperties;
  /** 내부 슬롯별 props 전달 */
  slotProps?: ModalSlotProps;
}

export const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  closable = false,
  mask = true,
  isMaskClose = true,
  title,
  image,
  device,
  children,
  onConfirm,
  confirmText,
  closeText,
  showModalButtonGroup = true,
  maxWidth,
  className,
  style,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle,
  headerClassName,
  headerStyle,
  bodyClassName,
  modalBodyStyle,
  footerClassName,
  footerStyle,
  slotProps,
}) => {
  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      className={cx(slotProps?.root?.className, className)}
      style={{ ...slotProps?.root?.style, ...style }}
      {...omitDomProps(slotProps?.root)}
    >
      {mask && (
        <ModalOverlay
          isMaskClose={isMaskClose}
          className={cx(slotProps?.overlay?.className, overlayClassName)}
          style={{ ...slotProps?.overlay?.style, ...overlayStyle }}
          {...omitDomProps(slotProps?.overlay)}
        />
      )}
      <ModalContent
        maxWidth={maxWidth ?? (device ? DEVICE_WIDTH[device] : undefined)}
        className={cx(slotProps?.content?.className, contentClassName)}
        style={{ ...slotProps?.content?.style, ...contentStyle }}
        {...omitDomProps(slotProps?.content)}
      >
        {image && <ModalImage>{image}</ModalImage>}
        {(title || closable) && (
          <ModalHeader
            title={title}
            closable={closable}
            className={cx(slotProps?.header?.className, headerClassName)}
            style={{ ...slotProps?.header?.style, ...headerStyle }}
            titleClassName={slotProps?.header?.titleClassName}
            titleProps={slotProps?.header?.titleProps}
            closeButtonProps={slotProps?.header?.closeButtonProps}
            {...omitHeaderProps(slotProps?.header)}
          />
        )}
        <ModalBody
          className={cx(slotProps?.body?.className, bodyClassName)}
          style={{ ...slotProps?.body?.style, ...modalBodyStyle }}
          {...omitDomProps(slotProps?.body)}
        >
          {children}
        </ModalBody>
        {showModalButtonGroup && (onConfirm || onClose) && (
          <ModalFooter
            onConfirm={onConfirm}
            confirmText={confirmText}
            onClose={onClose}
            closeText={closeText}
            className={cx(slotProps?.footer?.className, footerClassName)}
            style={{ ...slotProps?.footer?.style, ...footerStyle }}
            cancelButtonProps={slotProps?.footer?.cancelButtonProps}
            confirmButtonProps={slotProps?.footer?.confirmButtonProps}
            {...omitFooterProps(slotProps?.footer)}
          />
        )}
      </ModalContent>
    </ModalRoot>
  );
};

export const Modal = Object.assign(ModalComponent, {
  Root: ModalRoot,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Image: ModalImage,
  Body: ModalBody,
  Footer: ModalFooter,
});

function handleContentKeyDown(
  event: React.KeyboardEvent<HTMLDivElement>,
  contentElement: HTMLDivElement | null,
  onClose?: () => void,
) {
  if (event.key === "Escape") {
    onClose?.();
    return;
  }

  if (event.key !== "Tab" || !contentElement) return;

  const focusableElements = getFocusableElements(contentElement);
  if (focusableElements.length === 0) {
    event.preventDefault();
    contentElement.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("aria-hidden"));
}

function omitDomProps<T extends DivProps | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, ...rest } = props;
  return rest;
}

function omitButtonProps<T extends ButtonProps | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, onClick, ...rest } = props;
  return rest;
}

function omitHeaderProps(props: ModalSlotProps["header"]) {
  if (!props) return {};
  const { className, style, titleClassName, titleProps, closeButtonProps, ...rest } = props;
  return rest;
}

function omitFooterProps(props: ModalSlotProps["footer"]) {
  if (!props) return {};
  const { className, style, cancelButtonProps, confirmButtonProps, ...rest } = props;
  return rest;
}
