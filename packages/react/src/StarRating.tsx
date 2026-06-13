import React, { useCallback, useId, useState } from "react";

/* ─── Class names ─── */

const SR_CLASS = "nds-star-rating";
const SR_STAR_CLASS = `${SR_CLASS}__star`;
const SR_VALUE_CLASS = `${SR_CLASS}__value`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const STAR_PATH = "M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z";
const FILLED_COLOR = "var(--nds-rating-star, #FFD54F)"; // 슬롯 토큰 — style.fill 로 적용(attr 는 var() 미보장)
const EMPTY_COLOR = "var(--nds-rating-star-empty, #D8D8D8)"; // 빈 별 슬롯 — 기본 neutral[300]

type StarFill = "full" | "half" | "empty";

/** 별 i(1-based)의 채움 상태 판정. full=정수 반올림(인터랙티브 포함), half=0.5 단위 반쪽 허용. */
const starFill = (starValue: number, value: number, precision: "full" | "half"): StarFill => {
  if (precision === "half") {
    if (value >= starValue) return "full";
    if (value >= starValue - 0.5) return "half";
    return "empty";
  }
  return Math.round(value) >= starValue ? "full" : "empty";
};

/* ─── Component ─── */

export interface StarRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 별점 값 (0~5) */
  value: number;
  /** 값 변경 콜백 (설정 시 인터랙티브 모드) */
  onValueChange?: (value: number) => void;
  /** 별 크기 (px) */
  size?: number;
  /** 최대 별 수 */
  max?: number;
  /** 숫자 값 표시 여부 */
  showValue?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /**
   * 채움 정밀도. `"half"` 면 0.5 단위 반쪽 별을 렌더(별점 표시용).
   * 기본 `"full"`(정수 반올림). 인터랙티브 모드(onValueChange)에서는 항상 `"full"`.
   */
  precision?: "full" | "half";
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value,
      onValueChange,
      size = 16,
      max = 5,
      showValue = false,
      disabled = false,
      precision = "full",
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const interactive = !!onValueChange && !disabled;
    const gradientPrefix = useId();

    // 인터랙티브는 반쪽 별 없음(클릭=정수 선택). hover 시엔 hover 값으로 미리보기.
    const effectivePrecision = interactive ? "full" : precision;
    const displayValue = hovered !== null ? hovered : value;

    const handleClick = useCallback(
      (starIndex: number) => {
        if (!interactive) return;
        onValueChange?.(starIndex);
      },
      [interactive, onValueChange],
    );

    return (
      <div
        ref={ref}
        data-slot="root"
        data-interactive={interactive ? "true" : "false"}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`${value} out of ${max} stars`}
        className={cx(SR_CLASS, className)}
        style={style}
        onMouseLeave={() => interactive && setHovered(null)}
        {...rest}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const fill = starFill(starValue, displayValue, effectivePrecision);
          const gradientId = `${gradientPrefix}-star-${starValue}`;

          return (
            <span
              key={starValue}
              data-slot="star"
              data-filled={fill === "full" ? "true" : "false"}
              data-fill={fill}
              className={SR_STAR_CLASS}
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? starValue === Math.round(value) : undefined}
              aria-label={interactive ? `${starValue} star${starValue > 1 ? "s" : ""}` : undefined}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
            >
              <svg width={size} height={size} viewBox="0 0 16 16">
                {fill === "half" ? (
                  <>
                    <defs>
                      <linearGradient id={gradientId}>
                        <stop offset="50%" style={{ stopColor: FILLED_COLOR }} />
                        <stop offset="50%" style={{ stopColor: EMPTY_COLOR }} />
                      </linearGradient>
                    </defs>
                    <path d={STAR_PATH} fill={`url(#${gradientId})`} />
                  </>
                ) : (
                  <path d={STAR_PATH} style={{ fill: fill === "full" ? FILLED_COLOR : EMPTY_COLOR }} />
                )}
              </svg>
            </span>
          );
        })}
        {showValue && (
          <span data-slot="value" className={SR_VALUE_CLASS}>
            {value.toFixed(1)}
          </span>
        )}
      </div>
    );
  },
);

StarRating.displayName = "StarRating";
