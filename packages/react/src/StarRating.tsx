import React, { useCallback, useState } from "react";

/* ─── Class names ─── */

const SR_CLASS = "nds-star-rating";
const SR_STAR_CLASS = `${SR_CLASS}__star`;
const SR_VALUE_CLASS = `${SR_CLASS}__value`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const STAR_PATH = "M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z";
const FILLED_COLOR = "#FFD54F";
const EMPTY_COLOR = "#E0E0E0";

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
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const interactive = !!onValueChange && !disabled;

    const displayValue = hovered !== null ? hovered : Math.round(value);

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
          const filled = starValue <= displayValue;

          return (
            <span
              key={starValue}
              data-slot="star"
              data-filled={filled ? "true" : "false"}
              className={SR_STAR_CLASS}
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? starValue === Math.round(value) : undefined}
              aria-label={interactive ? `${starValue} star${starValue > 1 ? "s" : ""}` : undefined}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
            >
              <svg width={size} height={size} viewBox="0 0 16 16">
                <path d={STAR_PATH} fill={filled ? FILLED_COLOR : EMPTY_COLOR} />
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
