import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

export type TextButtonSize = "large" | "medium";

const TEXT_BUTTON_CLASS = "nds-text-button";
const TEXT_BUTTON_LABEL_CLASS = `${TEXT_BUTTON_CLASS}__label`;
const TEXT_BUTTON_ICON_CLASS = `${TEXT_BUTTON_CLASS}__icon`;

// eslint-disable-next-line unused-imports/no-unused-vars
const textButtonStyles = `
  :where(.${TEXT_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nds-text-button-gap, ${spacing[4]}px);
    padding: 0;
    border: none;
    background: transparent;
    color: var(--nds-text-button-color, ${cv.text.default});
    font-family: ${fontFamily.web};
    font-size: var(--nds-text-button-font-size, ${typeScale.body2.fontSize}px);
    line-height: var(--nds-text-button-line-height, ${typeScale.body2.lineHeight}px);
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    transition: color ${transition.default};
  }

  :where(.${TEXT_BUTTON_CLASS}:disabled) {
    cursor: default;
    color: ${cv.text.disabled};
  }

  :where(.${TEXT_BUTTON_CLASS}:not(:disabled):hover) {
    color: var(--nds-text-button-hover-color, ${cv.primary.main});
  }

  :where(.${TEXT_BUTTON_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
  }

  :where(.${TEXT_BUTTON_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--nds-text-button-icon-size, 16px);
    line-height: 1;
  }

  :where(.${TEXT_BUTTON_ICON_CLASS} svg) {
    width: var(--nds-text-button-icon-size, 16px);
    height: var(--nds-text-button-icon-size, 16px);
  }
`;

const sizeConfig = {
  large: {
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: 18,
  },
  medium: {
    fontSize: typeScale.body3.fontSize,
    lineHeight: typeScale.body3.lineHeight,
    iconSize: 16,
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
