import React from "react";

export type BadgeVariant = "fill" | "ghost" | "line";
export type BadgeColor = "brand" | "neutral" | "success" | "error" | "caution" | "info";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeShape = "default" | "pill";

const BADGE_CLASS = "nds-badge";
const BADGE_LABEL_CLASS = `${BADGE_CLASS}__label`;

// 색(variant×color)·치수(size)·shape 라운드는 @nudge-design/styles 의 .nds-badge
// CSS 룰이 data-variant/data-color/data-size/data-shape 로 합성한다. 여기선 data-attr 만 set.

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface BadgeSlotProps {
  /** 라벨 텍스트를 감싸는 `<span>` 엘리먼트에 전달할 props */
  label?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 시각적 스타일 (Figma "Style") */
  variant?: BadgeVariant;
  /** 의미 컬러 (Figma "Color") */
  color?: BadgeColor;
  /** 크기 */
  size?: BadgeSize;
  /** 모서리 모양 (Figma "Shape"): default=size별 라운드 사각(동적 상태값) · pill=완전 둥근(정적 식별 태그) */
  shape?: BadgeShape;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
  /** 내부 슬롯별 props 전달 */
  slotProps?: BadgeSlotProps;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "fill",
      color = "neutral",
      size = "md",
      shape = "default",
      className,
      style,
      labelClassName,
      children,
      slotProps,
      ...rest
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-shape={shape}
        className={cx(BADGE_CLASS, className)}
        style={style}
        {...rest}
      >
        <span
          data-slot="label"
          className={cx(BADGE_LABEL_CLASS, labelClassName, slotProps?.label?.className)}
          style={slotProps?.label?.style}
          {...omitDomProps(slotProps?.label)}
        >
          {children}
        </span>
      </span>
    );
  },
);

Badge.displayName = "Badge";

function omitDomProps<T extends React.HTMLAttributes<HTMLElement> | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, ...rest } = props;
  return rest;
}
