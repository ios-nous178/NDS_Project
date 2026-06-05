import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { WebPortal } from "./internal/web";

/* ─── Class names ─── */

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_ICON_CLASS = `${TOAST_CLASS}__icon`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;
const TOAST_ACTION_CLASS = `${TOAST_CLASS}__action`;
const TOAST_CLOSE_CLASS = `${TOAST_CLASS}__close`;

/* ─── Types ─── */

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "bottom" | "top-right";

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

/* ─── Status / close icons (캐포비 흰 카드 토스트에서만 CSS 로 노출) ─── */

const StatusIcon: React.FC<{ variant: ToastVariant }> = ({ variant }) => {
  if (variant === "default") return null;
  return (
    <span className={TOAST_ICON_CLASS} aria-hidden="true">
      {/* 캐포비 토스트 아이콘 = 둥근 사각형 칩(currentColor) + 흰 글리프. 색은 CSS 의 state 별 토큰. */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        {variant === "success" && (
          <path
            d="M8 12.3l2.8 2.8 5.4-5.8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {variant === "error" && (
          <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        )}
        {variant === "warning" && (
          <>
            <path d="M12 7.5v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.1" fill="#fff" />
          </>
        )}
        {variant === "info" && (
          <>
            <circle cx="12" cy="8" r="1.1" fill="#fff" />
            <path d="M12 11v5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
};

const CloseIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

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
      <StatusIcon variant={data.variant ?? "default"} />
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
      <button
        type="button"
        className={TOAST_CLOSE_CLASS}
        aria-label="닫기"
        onClick={() => setExiting(true)}
      >
        <CloseIcon />
      </button>
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
