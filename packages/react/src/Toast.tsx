import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, transition, typeScale, zIndex } from "@nudge-eap/tokens";
import { WebPortal } from "./internal/web";

/* ─── Class names ─── */

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;
const TOAST_ACTION_CLASS = `${TOAST_CLASS}__action`;

/* ─── Types ─── */

export type ToastVariant = "default" | "success" | "error" | "info";
export type ToastPosition = "top" | "bottom";

export interface ToastData {
  /** 토스트 고유 식별자 */
  id: string;
  /** 표시할 메시지 텍스트 */
  message: string;
  /** 토스트 색상 변형 @default "default" */
  variant?: ToastVariant;
  /** 자동 닫힘 시간 (ms). 0이면 자동 닫힘 없음 */
  duration?: number;
  /** 액션 버튼 (라벨 + 클릭 콜백) */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const toastStyles = `
  :where(.${TOAST_VIEWPORT_CLASS}) {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-default);
    padding: var(--inset-card);
    z-index: ${zIndex.toast};
    pointer-events: none;
    box-sizing: border-box;
  }

  :where(.${TOAST_VIEWPORT_CLASS}[data-position="top"]) {
    top: 0;
  }

  :where(.${TOAST_VIEWPORT_CLASS}[data-position="bottom"]) {
    bottom: 0;
  }

  :where(.${TOAST_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-comfortable);
    max-width: var(--nds-toast-max-width, 400px);
    padding: var(--nds-toast-padding, var(--inset-input) var(--inset-card-large));
    border-radius: var(--nds-toast-radius, 22px);
    font-family: ${fontFamily.web};
    font-size: var(--nds-toast-font-size, ${typeScale.body3.fontSize}px);
    font-weight: var(--nds-toast-font-weight, ${fontWeight.regular});
    line-height: ${typeScale.body3.lineHeight}px;
    box-shadow: var(--nds-toast-shadow, none);
    pointer-events: auto;
    box-sizing: border-box;
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="default"]) {
    background: var(--nds-toast-background, rgba(17, 17, 17, 0.8));
    color: ${cv.textRole.inverse};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="success"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.iconRole.statusSuccess};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="error"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="info"]) {
    background: ${cv.surface.statusInfo};
    color: ${cv.textRole.brand};
  }

  :where(.${TOAST_ITEM_CLASS}[data-entering="true"]) {
    animation: nds-toast-enter ${transition.default};
  }

  :where(.${TOAST_ITEM_CLASS}[data-exiting="true"]) {
    animation: nds-toast-exit 0.4s ease forwards;
  }

  :where(.${TOAST_MESSAGE_CLASS}) {
    flex: 1;
    min-width: 0;
    text-align: center;
    white-space: pre-line;
  }

  :where(.${TOAST_ACTION_CLASS}) {
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: inherit;
    padding: 0;
    text-decoration: underline;
  }

  @keyframes nds-toast-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes nds-toast-exit {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
  }
`;

/* ─── Utils ─── */

let toastCounter = 0;
const generateId = () => `nds-toast-${++toastCounter}`;

/* ─── Context ─── */

interface ToastContextValue {
  toast: (message: string, options?: Partial<Omit<ToastData, "id" | "message">>) => void;
  toasts: ToastData[];
  dismiss: (id: string) => void;
  position: ToastPosition;
  portalContainer?: HTMLElement | null;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

/* ─── Provider ─── */

export interface ToastProviderProps {
  /** 기본 위치 */
  position?: ToastPosition;
  /** 기본 지속 시간 (ms) */
  duration?: number;
  /** 최대 동시 표시 개수 */
  maxCount?: number;
  /** 토스트가 렌더링될 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 앱 콘텐츠 (하위에서 useToast 사용 가능) */
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = "bottom",
  duration = 3000,
  maxCount = 3,
  portalContainer,
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, options?: Partial<Omit<ToastData, "id" | "message">>) => {
      const id = generateId();
      const newToast: ToastData = {
        id,
        message,
        variant: options?.variant ?? "default",
        duration: options?.duration ?? duration,
        action: options?.action,
      };

      setToasts((prev) => {
        const next = [...prev, newToast];
        return next.length > maxCount ? next.slice(-maxCount) : next;
      });
    },
    [duration, maxCount],
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss, position, portalContainer }}>
      {children}
      {mounted && <ToastViewport />}
    </ToastContext.Provider>
  );
};

/* ─── Viewport (internal) ─── */

const ToastViewport: React.FC = () => {
  const { toasts, dismiss, position, portalContainer } = useToast();

  return (
    <WebPortal container={portalContainer}>
      <>
        <div
          data-slot="viewport"
          data-position={position}
          className={TOAST_VIEWPORT_CLASS}
          aria-live="polite"
          aria-relevant="additions"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} data={t} onDismiss={dismiss} />
          ))}
        </div>
      </>
    </WebPortal>
  );
};

/* ─── Toast Item (internal) ─── */

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ data, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (data.duration && data.duration > 0) {
      timerRef.current = setTimeout(() => {
        setExiting(true);
      }, data.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.duration]);

  const handleAnimationEnd = () => {
    if (exiting) {
      onDismiss(data.id);
    }
  };

  return (
    <div
      data-slot="item"
      data-variant={data.variant ?? "default"}
      data-entering={!exiting ? "true" : "false"}
      data-exiting={exiting ? "true" : "false"}
      className={TOAST_ITEM_CLASS}
      role={data.variant === "error" ? "alert" : "status"}
      aria-live={data.variant === "error" ? "assertive" : undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={TOAST_MESSAGE_CLASS}>{data.message}</span>
      {data.action && (
        <button
          type="button"
          className={TOAST_ACTION_CLASS}
          onClick={() => {
            data.action!.onClick();
            setExiting(true);
          }}
        >
          {data.action.label}
        </button>
      )}
    </div>
  );
};

/* ─── Imperative API (standalone) ─── */

let globalToast: ToastContextValue["toast"] | null = null;

export function setGlobalToast(fn: ToastContextValue["toast"]) {
  globalToast = fn;
}

/**
 * 명령형 토스트 호출 (ToastProvider 외부에서 사용).
 * ToastProvider 내부에서 `setGlobalToast(toast)`를 호출해야 동작합니다.
 *
 * @example
 * // Provider 안에서 연결
 * const { toast } = useToast();
 * useEffect(() => { setGlobalToast(toast); }, [toast]);
 *
 * // 어디서든 호출
 * showToast("저장되었습니다");
 */
export function showToast(message: string, options?: Partial<Omit<ToastData, "id" | "message">>) {
  if (!globalToast) {
    console.warn("[NDS] ToastProvider가 마운트되지 않았습니다.");
    return;
  }
  globalToast(message, options);
}

/* ─── Export ─── */

export const Toast = {
  Provider: ToastProvider,
  useToast,
  setGlobalToast,
  show: showToast,
};
