import React from "react";

export type BadgeVariant = "fill" | "ghost" | "line";
export type BadgeColor = "brand" | "neutral" | "success" | "error" | "caution" | "info";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeShape = "default" | "pill";
/**
 * Badge 유형 (Figma "type", 가이드 5107:130):
 * - `label` (기본) : 텍스트 배지 — NEW·상태 라벨 등 (size/variant/color/shape 적용)
 * - `dot`          : 8×8 상태 점 — 텍스트 없음, 활성·미확인 표시 (색은 variant=fill 룰)
 * - `count`        : min 18 원형 숫자 카운터 — 알림·메시지 개수 (색은 variant=fill 룰)
 */
export type BadgeType = "label" | "dot" | "count";

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
  /** 유형 (Figma "type"): label=텍스트 배지(기본) · dot=8×8 점 · count=원형 숫자 카운터 */
  type?: BadgeType;
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
      type = "label",
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
        data-type={type}
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
