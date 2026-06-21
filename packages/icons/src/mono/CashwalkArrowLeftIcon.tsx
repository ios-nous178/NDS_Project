import React from "react";

export interface CashwalkArrowLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkArrowLeftIcon = React.forwardRef<SVGSVGElement, CashwalkArrowLeftIconProps>(
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
      <path d="M19 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 6L5 12L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkArrowLeftIcon.displayName = "CashwalkArrowLeftIcon";
