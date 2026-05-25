import React from "react";

export type IconButtonSize = "x-large" | "large" | "medium" | "small";

const ICON_BUTTON_CLASS = "nds-icon-button";
/* Figma 실측 (171:8576 large / 171:8580 medium / 171:8584 small / 171:8588 X-large)
 * box 안에 4px padding으로 icon이 들어감 (small만 4px → icon 16).
 */
const sizeConfig = {
  "x-large": { box: 36, icon: 28 },
  large: { box: 32, icon: 24 },
  medium: { box: 28, icon: 20 },
  small: { box: 24, icon: 16 },
} as const;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 크기 @default "large" */
  size?: IconButtonSize;
  /** 표시할 아이콘 */
  icon: React.ReactNode;
  /** 접근성 라벨 (필수) */
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "large", icon, className, style, type = "button", ...rest }, ref) => {
    const s = sizeConfig[size];

    return (
      <button
        ref={ref}
        type={type}
        data-slot="root"
        data-size={size}
        className={cx(ICON_BUTTON_CLASS, className)}
        style={
          {
            "--nds-icon-button-size": `${s.box}px`,
            "--nds-icon-button-icon-size": `${s.icon}px`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
