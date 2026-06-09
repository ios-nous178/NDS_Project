import React, { useEffect, useRef, useState } from "react";

/* ─── Constants ─── */

const CT_CLASS = "nds-countdown-timer";
const CT_TIME_CLASS = `${CT_CLASS}__time`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;

/* ─── Types ─── */

export type CountdownFormat = "mm:ss" | "hh:mm:ss" | "remaining";

export interface CountdownTimerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "title"> {
  /** 종료 시각 (ISO string 또는 Date 또는 ms timestamp) */
  endsAt: string | number | Date;
  /** 표시 포맷 */
  format?: CountdownFormat;
  /** 0초 도달 시 콜백 */
  onComplete?: () => void;
  /** 1초마다 발생하는 콜백 (남은 ms) */
  onTick?: (ms: number) => void;
  /** 임박(10초 이하) 시 빨간색 강조 */
  urgentColor?: boolean;
  /**
   * 색 톤 — `"default"`(텍스트 기본색) | `"brand"`(브랜드 액센트 — 캐포비=오렌지 #FD9B02).
   * 진행 중 타이머를 브랜드색으로 강조하는 인증 입력 등에 사용. urgent(≤10s)는 톤과 무관하게 빨강 우선.
   * @default "default"
   */
  tone?: "default" | "brand";
  /** 라벨 (시간 옆) */
  label?: React.ReactNode;
  /** 시간이 0 이하일 때 표시할 노드 */
  expiredText?: React.ReactNode;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const toMs = (input: string | number | Date) => {
  if (input instanceof Date) return input.getTime();
  if (typeof input === "number") return input;
  return new Date(input).getTime();
};

const formatTime = (ms: number, format: CountdownFormat) => {
  if (ms <= 0) return null;
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (format === "hh:mm:ss") {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  if (format === "remaining") {
    if (total >= 3600) return `${Math.ceil(total / 3600)}시간 남음`;
    if (total >= 60) return `${Math.ceil(total / 60)}분 남음`;
    return `${total}초 남음`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ─── Component ─── */

export const CountdownTimer = React.forwardRef<HTMLSpanElement, CountdownTimerProps>(
  (
    {
      endsAt,
      format = "mm:ss",
      onComplete,
      onTick,
      urgentColor = true,
      tone = "default",
      label,
      expiredText = "만료됨",
      className,
      ...rest
    },
    ref,
  ) => {
    const targetMs = toMs(endsAt);
    const [now, setNow] = useState(() => Date.now());
    const completedRef = useRef(false);

    useEffect(() => {
      const tick = () => {
        const current = Date.now();
        const remaining = targetMs - current;
        setNow(current);
        onTick?.(remaining);
        if (remaining <= 0 && !completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, [targetMs, onTick, onComplete]);

    const remainingMs = Math.max(0, targetMs - now);
    const expired = remainingMs <= 0;
    const urgent = !expired && remainingMs <= 10_000 && urgentColor;
    const formatted = formatTime(remainingMs, format);

    return (
      <span
        ref={ref}
        data-slot="root"
        data-urgent={urgent ? "true" : "false"}
        data-expired={expired ? "true" : "false"}
        data-tone={tone}
        className={cx(CT_CLASS, className)}
        aria-live="polite"
        {...rest}
      >
        <span className={CT_TIME_CLASS}>{expired ? expiredText : formatted}</span>
        {label && !expired && <span className={CT_LABEL_CLASS}>{label}</span>}
      </span>
    );
  },
);

CountdownTimer.displayName = "CountdownTimer";
