import React from "react";

/* ─── Class names ─── */

const NA_CLASS = "nds-notice-alert";
const NA_ICON_CLASS = `${NA_CLASS}__icon`;
const NA_MESSAGE_CLASS = `${NA_CLASS}__message`;

/* ─── Types ─── */

export type NoticeAlertVariant = "info" | "notice" | "caution" | "success" | "error";

export interface NoticeAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 메시지 의미·톤 결정 @default "info" */
  variant?: NoticeAlertVariant;
  /** 본문 텍스트. 여러 줄 허용. (children 으로도 전달 가능) */
  message?: React.ReactNode;
  /**
   * 좌측 상태 아이콘 override.
   * - 미지정: variant 별 기본 아이콘 (info 는 아이콘 없음)
   * - `false`: 아이콘 강제 숨김
   * - ReactNode: 커스텀 아이콘 (20×20 권장)
   */
  icon?: React.ReactNode | false;
  /** message 대신 children 으로 본문 전달 가능 */
  children?: React.ReactNode;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Status glyphs (20×20, currentColor — 색은 CSS 의 variant 별 토큰) ─── */

const CautionGlyph = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5L18.5 17.5H1.5L10 2.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <path d="M10 8v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="10" cy="14.4" r="1" fill="currentColor" />
  </svg>
);

const ErrorGlyph = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SuccessGlyph = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <path
      d="M6.5 10.2l2.4 2.4 4.6-4.9"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NoticeGlyph = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <circle cx="10" cy="6.6" r="1" fill="#fff" />
    <path d="M10 9v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const DEFAULT_GLYPH: Record<NoticeAlertVariant, React.ReactNode> = {
  info: null, // 중립 안내 — 좌측 아이콘 없이 텍스트만 (Figma 3902:1212)
  notice: <NoticeGlyph />,
  caution: <CautionGlyph />,
  success: <SuccessGlyph />,
  error: <ErrorGlyph />,
};

/* ─── Component ─── */

/**
 * NoticeAlert — 폼·페이지 내부에 인라인으로 영구 노출되는 안내/주의/에러 메시지.
 *
 * Toast(자동 사라짐)·Banner(전역 띠)·Modal(즉각 판단)과 달리, 입력 컨텍스트 옆에
 * 머무르며 명시적으로 닫기 전까지 유지됩니다. (DS notice 패턴의 구현체)
 *
 * @example
 * <NoticeAlert variant="caution" message="목표 참여자 수는 1,000명 단위로 입력해 주세요." />
 * <NoticeAlert variant="error" message="필수 정보가 누락되어 저장할 수 없어요." />
 */
export const NoticeAlert: React.FC<NoticeAlertProps> = ({
  variant = "info",
  message,
  icon,
  children,
  className,
  ...rest
}) => {
  const glyph = icon === false ? null : (icon ?? DEFAULT_GLYPH[variant]);
  const body = message ?? children;

  return (
    <div
      className={cx(NA_CLASS, className)}
      data-variant={variant}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      {...rest}
    >
      {glyph != null && (
        <span className={NA_ICON_CLASS} aria-hidden="true">
          {glyph}
        </span>
      )}
      <span className={NA_MESSAGE_CLASS}>{body}</span>
    </div>
  );
};

NoticeAlert.displayName = "NoticeAlert";
