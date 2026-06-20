import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { WebPortal } from "./internal/web.js";

/* ─── Constants ─── */

const SB_CLASS = "nds-snackbar";
const SB_VIEWPORT_CLASS = `${SB_CLASS}__viewport`;
const SB_ICON_CLASS = `${SB_CLASS}__icon`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_DESC_CLASS = `${SB_CLASS}__desc`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_CLOSE_CLASS = `${SB_CLASS}__close`;

/* ─── Types ─── */

export type SnackbarVariant = "info" | "success" | "warning" | "error";

export interface SnackbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 종류 */
  variant?: SnackbarVariant;
  /** 좌측 아이콘 (variant 기본 아이콘 대신 커스텀) */
  icon?: React.ReactNode;
  /** 제목/본문 */
  title?: React.ReactNode;
  /** 설명 (제목 아래 작은 글씨) */
  description?: React.ReactNode;
  /** 우측 액션 버튼 라벨 */
  actionLabel?: string;
  /** 액션 버튼 클릭 콜백 */
  onAction?: () => void;
  /** 닫기 버튼 표시 */
  closable?: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
}

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Icons ─── */

/**
 * 기본(인라인) 아이콘 — 옅은 틴트 카드 위의 가는 라인 글리프(20×20).
 * 프로젝트 카드(캐포비 흰 카드)는 `SnackbarChipIcon`(둥근 사각형 칩)을 `icon` prop 으로 주입한다.
 */
const DefaultIcon: React.FC<{ variant: SnackbarVariant }> = ({ variant }) => {
  if (variant === "success") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
        <path
          d="M6 10l3 3 5-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M10 2l9 16H1L10 2z"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 8v4M10 14.5v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/**
 * 프로젝트 카드용 status 칩 아이콘(24×24) — 둥근 사각형 칩(currentColor) + 흰 글리프.
 * 색은 `--nds-snackbar-icon`(variant 별 status 색)을 따른다. 캐포비 admin Snackbar SSOT(Figma 3001:51644).
 */
export const SnackbarChipIcon: React.FC<{ variant: SnackbarVariant }> = ({ variant }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
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
);

/* ─── Component (inline / declarative) ─── */

/**
 * 인라인 Snackbar — 부모가 mount/unmount 로 표시 여부를 통제하는 선언형 알림 카드.
 * variant 배경/아이콘 색은 CSS(`data-variant`)가 결정한다 — 프로젝트 카드(캐포비 흰 카드)가
 * `data-project` cascade 로 배경을 덮어쓸 수 있도록 인라인 style 로 박지 않는다.
 *
 * 자동 사라짐·포지셔닝·단일교체가 필요하면 `Snackbar.Provider` + `useSnackbar()` 를 사용한다.
 */
const SnackbarBase = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      variant,
      icon,
      title,
      description,
      actionLabel,
      onAction,
      closable = false,
      onClose,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="root"
        data-variant={variant ?? "default"}
        data-has-desc={description ? "true" : "false"}
        className={cx(SB_CLASS, className)}
        style={style}
        {...rest}
      >
        {(icon || variant) && (
          <span className={SB_ICON_CLASS} aria-hidden>
            {icon ?? <DefaultIcon variant={variant ?? "info"} />}
          </span>
        )}
        <div className={SB_BODY_CLASS}>
          {title && <p className={SB_TITLE_CLASS}>{title}</p>}
          {description && <p className={SB_DESC_CLASS}>{description}</p>}
        </div>
        {actionLabel && (
          <button type="button" className={SB_ACTION_CLASS} onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {closable && (
          <button type="button" className={SB_CLOSE_CLASS} aria-label="닫기" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

SnackbarBase.displayName = "Snackbar";

/* ─── Provider infra (imperative / managed) ─── */

export type SnackbarPosition = "top" | "bottom" | "top-right";
/** 프로젝트 프리셋 — 카드 외형(흰 카드 + status 칩 아이콘)이 다른 프로젝트만 명시한다. */
export type SnackbarProject = "default" | "cashwalk-biz";

export interface SnackbarData {
  /** 고유 식별자 */
  id: string;
  /** 제목/본문 */
  title: React.ReactNode;
  /** 설명 (제목 아래 작은 글씨) */
  description?: React.ReactNode;
  /** 종류 @default 없음(중립) */
  variant?: SnackbarVariant;
  /** 자동 닫힘 시간 (ms). 0이면 자동 닫힘 없음 */
  duration?: number;
  /** 우측 액션 버튼 (라벨 + 클릭 콜백) */
  action?: { label: string; onClick: () => void };
  /** 닫기 버튼 표시 @default true */
  closable?: boolean;
}

export type SnackbarOptions = Partial<Omit<SnackbarData, "id" | "title">>;

interface SnackbarContextValue {
  snackbar: (title: React.ReactNode, options?: SnackbarOptions) => string;
  snackbars: SnackbarData[];
  dismiss: (id: string) => void;
  position: SnackbarPosition;
  project: SnackbarProject;
  portalContainer?: HTMLElement | null;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within Snackbar.Provider");
  return ctx;
};

export interface SnackbarProviderProps {
  /** 기본 위치 @default "bottom" */
  position?: SnackbarPosition;
  /** 기본 지속 시간 (ms) @default 4000 */
  duration?: number;
  /** 최대 동시 표시 개수 (1이면 단일 교체) @default 3 */
  maxCount?: number;
  /** 프로젝트 카드 외형 @default "default" */
  project?: SnackbarProject;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 앱 콘텐츠 (하위에서 useSnackbar 사용 가능) */
  children: React.ReactNode;
}

let snackbarCounter = 0;
const generateId = () => `nds-snackbar-${++snackbarCounter}`;

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  position = "bottom",
  duration = 4000,
  maxCount = 3,
  project = "default",
  portalContainer,
  children,
}) => {
  const [snackbars, setSnackbars] = useState<SnackbarData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const snackbar = useCallback(
    (title: React.ReactNode, options?: SnackbarOptions) => {
      const id = generateId();
      const next: SnackbarData = {
        id,
        title,
        description: options?.description,
        variant: options?.variant,
        duration: options?.duration ?? duration,
        action: options?.action,
        closable: options?.closable ?? true,
      };
      setSnackbars((prev) => {
        const merged = [...prev, next];
        return merged.length > maxCount ? merged.slice(-maxCount) : merged;
      });
      return id;
    },
    [duration, maxCount],
  );

  return (
    <SnackbarContext.Provider
      value={{ snackbar, snackbars, dismiss, position, project, portalContainer }}
    >
      {children}
      {mounted && <SnackbarViewport />}
    </SnackbarContext.Provider>
  );
};

/* ─── Viewport + managed item (internal) ─── */

const SnackbarViewport: React.FC = () => {
  const { snackbars, dismiss, position, project, portalContainer } = useSnackbar();

  return (
    <WebPortal container={portalContainer}>
      <div
        data-slot="viewport"
        data-position={position}
        className={SB_VIEWPORT_CLASS}
        aria-live="polite"
        aria-relevant="additions"
      >
        {snackbars.map((s) => (
          <ManagedSnackbar key={s.id} data={s} project={project} onDismiss={dismiss} />
        ))}
      </div>
    </WebPortal>
  );
};

const ManagedSnackbar: React.FC<{
  data: SnackbarData;
  project: SnackbarProject;
  onDismiss: (id: string) => void;
}> = ({ data, project, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (data.duration && data.duration > 0) {
      timerRef.current = setTimeout(() => setExiting(true), data.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.duration]);

  const handleAnimationEnd = () => {
    if (exiting) onDismiss(data.id);
  };

  // 프로젝트 카드(캐포비)는 status 칩 아이콘을 쓴다. variant 가 없으면 아이콘 없음(중립 메시지).
  const icon =
    project === "cashwalk-biz" && data.variant ? (
      <SnackbarChipIcon variant={data.variant} />
    ) : undefined;

  return (
    <SnackbarBase
      variant={data.variant}
      icon={icon}
      title={data.title}
      description={data.description}
      actionLabel={data.action?.label}
      onAction={() => {
        data.action?.onClick();
        setExiting(true);
      }}
      closable={data.closable ?? true}
      onClose={() => setExiting(true)}
      data-entering={!exiting ? "true" : "false"}
      data-exiting={exiting ? "true" : "false"}
      onAnimationEnd={handleAnimationEnd}
    />
  );
};

/* ─── Imperative API (standalone) ─── */

let globalSnackbar: SnackbarContextValue["snackbar"] | null = null;

export function setGlobalSnackbar(fn: SnackbarContextValue["snackbar"]) {
  globalSnackbar = fn;
}

/**
 * 명령형 Snackbar 호출 (Provider 외부에서 사용). Provider 내부에서 `setGlobalSnackbar(snackbar)`
 * 를 연결해야 동작한다.
 */
export function showSnackbar(title: React.ReactNode, options?: SnackbarOptions) {
  if (!globalSnackbar) {
    console.warn("[NDS] Snackbar.Provider 가 마운트되지 않았습니다.");
    return;
  }
  globalSnackbar(title, options);
}

/* ─── Attach managed API onto the component ─── */

interface SnackbarComponent extends React.ForwardRefExoticComponent<
  SnackbarProps & React.RefAttributes<HTMLDivElement>
> {
  Provider: typeof SnackbarProvider;
  useSnackbar: typeof useSnackbar;
  setGlobalSnackbar: typeof setGlobalSnackbar;
  show: typeof showSnackbar;
}

export const Snackbar = SnackbarBase as SnackbarComponent;
Snackbar.Provider = SnackbarProvider;
Snackbar.useSnackbar = useSnackbar;
Snackbar.setGlobalSnackbar = setGlobalSnackbar;
Snackbar.show = showSnackbar;
