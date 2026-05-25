import React from "react";

/* ─── Constants ─── */

const SB_CLASS = "nds-snackbar";
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

/* ─── Styles ─── */

/**
 * Variant 디자인 원칙:
 * - 배경은 DS 시맨틱 토큰의 옅은 틴트(`*.bg`)
 * - 텍스트는 일률적으로 `text.default` (중립) — 비비드 컬러풀 텍스트 사용 금지
 * - variant 아이덴티티는 "배경 틴트 + 아이콘 색"으로만 표현
 */
const variantConfig: Record<SnackbarVariant, { bg: string; fg: string; icon: string }> = {
  info: {
    bg: "var(--semantic-bg-status-info)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-brand-default)",
  },
  success: {
    bg: "var(--semantic-bg-status-success)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-status-success)",
  },
  warning: {
    bg: "var(--semantic-bg-status-caution)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-text-status-caution)",
  },
  error: {
    bg: "var(--semantic-bg-status-error)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-status-error)",
  },
};
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

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

/* ─── Component ─── */

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
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
    const v = variantConfig[variant ?? "info"];
    const usingVariant = !!variant;

    const styleVars: React.CSSProperties = usingVariant
      ? ({
          "--nds-snackbar-bg": v.bg,
          "--nds-snackbar-fg": v.fg,
          "--nds-snackbar-icon": v.icon,
          ...style,
        } as React.CSSProperties)
      : { ...style };

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="root"
        data-variant={variant ?? "default"}
        data-has-desc={description ? "true" : "false"}
        className={cx(SB_CLASS, className)}
        style={styleVars}
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

Snackbar.displayName = "Snackbar";
