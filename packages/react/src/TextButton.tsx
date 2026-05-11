import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

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
    gap: var(--nds-text-button-gap, ${spacing[2]}px);
    padding: ${spacing[4]}px;
    border: none;
    background: transparent;
    /* Figma node 171:8538/171:8550 — geniet/gray/700 = #777 (neutral/600) */
    color: var(--nds-text-button-color, ${cv.text.subtle});
    font-family: ${fontFamily.web};
    font-size: var(--nds-text-button-font-size, ${typeScale.body2.fontSize}px);
    line-height: var(--nds-text-button-line-height, ${typeScale.body2.lineHeight}px);
    font-weight: ${fontWeight.regular};
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
