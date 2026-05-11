import React from "react";
import { cv, neutral, radius, transition } from "@nudge-eap/tokens";

export type IconButtonSize = "x-large" | "large" | "medium" | "small";

const ICON_BUTTON_CLASS = "nds-icon-button";

// eslint-disable-next-line unused-imports/no-unused-vars
const iconButtonStyles = `
  :where(.${ICON_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--nds-icon-button-size, 32px);
    height: var(--nds-icon-button-size, 32px);
    padding: 0;
    border: none;
    border-radius: ${radius.sm}px;
    background: transparent;
    color: var(--nds-icon-button-color, ${cv.icon.default});
    cursor: pointer;
    transition:
      background-color ${transition.default},
      color ${transition.default};
  }

  :where(.${ICON_BUTTON_CLASS}:disabled) {
    cursor: default;
    color: ${cv.text.disabled};
  }

  :where(.${ICON_BUTTON_CLASS}:not(:disabled):hover) {
    /* Figma 171:8590 — hover bg = #F5F5F5 (neutral/100) */
    background: var(--nds-icon-button-hover-bg, ${neutral[100]});
  }

  :where(.${ICON_BUTTON_CLASS}:focus) {
    outline: none;
  }

  :where(.${ICON_BUTTON_CLASS}:focus-visible) {
    outline: 2px solid var(--nds-icon-button-focus-ring-color, ${cv.primary.main});
    outline-offset: var(--nds-icon-button-focus-ring-offset, 2px);
  }

  :where(.${ICON_BUTTON_CLASS} svg) {
    width: var(--nds-icon-button-icon-size, 24px);
    height: var(--nds-icon-button-icon-size, 24px);
  }
`;

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
