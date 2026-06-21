import React from "react";

export interface CashwalkArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkArrowRightIcon = React.forwardRef<SVGSVGElement, CashwalkArrowRightIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14 6L19 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkArrowRightIcon.displayName = "CashwalkArrowRightIcon";
