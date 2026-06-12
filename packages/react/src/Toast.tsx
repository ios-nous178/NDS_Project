import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { WebPortal } from "./internal/web.js";

/* ─── Class names ─── */

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;

/* ─── Types ─── */

/**
 * 노출 위치 — `top`(PC·상단 중앙·pill) / `bottom`(모바일·하단·rounded 24).
 * 위치가 곧 형태다(Figma 1330:2): top 은 pill + 큰 패딩, bottom 은 둥근 사각.
 */
export type ToastPosition = "top" | "bottom";

/**
 * Toast 는 **인터랙션 없는 단일 다크 일시 메시지** 전용 — 자동으로 사라지므로 액션(되돌리기/다시시도)이나
 * 닫기 버튼을 두지 않는다. 색 변형(success/error…)도 없다 — 심각한 오류·결정 요청은 Modal/Alert,
 * 액션·닫기·브랜드 카드(캐포비 흰 카드)가 필요하면 Snackbar 를 사용한다. 동시에 1개만 노출이 기본이다.
 */
export interface ToastData {
  /** 토스트 고유 식별자 */
  id: string;
  /** 표시할 메시지 텍스트 */
  message: string;
  /** 자동 닫힘 시간 (ms). 0이면 자동 닫힘 없음 */
  duration?: number;
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
  /** 최대 동시 표시 개수 @default 1 (가이드: 동시에 1개만 노출 — 새 토스트가 기존을 대체) */
  maxCount?: number;
  /** 토스트가 렌더링될 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 앱 콘텐츠 (하위에서 useToast 사용 가능) */
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = "bottom",
  duration = 3000,
  maxCount = 1,
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
        duration: options?.duration ?? duration,
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
      data-entering={!exiting ? "true" : "false"}
      data-exiting={exiting ? "true" : "false"}
      className={TOAST_ITEM_CLASS}
      role="status"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={TOAST_MESSAGE_CLASS}>{data.message}</span>
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
