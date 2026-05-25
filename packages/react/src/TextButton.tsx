import React from "react";
import { sizing, typeScale } from "@nudge-eap/tokens";

export type TextButtonSize = "large" | "medium";

const TEXT_BUTTON_CLASS = "nds-text-button";
const TEXT_BUTTON_LABEL_CLASS = `${TEXT_BUTTON_CLASS}__label`;
const TEXT_BUTTON_ICON_CLASS = `${TEXT_BUTTON_CLASS}__icon`;
/* Figma 실측 (171:8550 large / 171:8538 medium)
 *   large : 16·24 / icon 16 / gap 2 / regular
 *   medium: 14·20 / icon 16 / gap 2 / regular
 */
const sizeConfig = {
  large: {
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.xs,
  },
  medium: {
    fontSize: typeScale.body3.fontSize,
    lineHeight: typeScale.body3.lineHeight,
    iconSize: sizing.icon.xs,
  },
} as const;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 크기 @default "medium" */
  size?: TextButtonSize;
  /** 라벨 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 라벨 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
}

export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    { size = "medium", leftIcon, rightIcon, className, style, children, type = "button", ...rest },
    ref,
  ) => {
    const s = sizeConfig[size];

    return (
      <button
        ref={ref}
        type={type}
        data-slot="root"
        data-size={size}
        className={cx(TEXT_BUTTON_CLASS, className)}
        style={
          {
            "--nds-text-button-font-size": `${s.fontSize}px`,
            "--nds-text-button-line-height": `${s.lineHeight}px`,
            "--nds-text-button-icon-size": `${s.iconSize}px`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {leftIcon && (
          <span data-slot="left-icon" className={TEXT_BUTTON_ICON_CLASS}>
            {leftIcon}
          </span>
        )}
        <span data-slot="label" className={TEXT_BUTTON_LABEL_CLASS}>
          {children}
        </span>
        {rightIcon && (
          <span data-slot="right-icon" className={TEXT_BUTTON_ICON_CLASS}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

TextButton.displayName = "TextButton";
