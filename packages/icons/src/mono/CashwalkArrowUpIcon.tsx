import React from "react";

export interface CashwalkArrowUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkArrowUpIcon = React.forwardRef<SVGSVGElement, CashwalkArrowUpIconProps>(
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
      <path d="M12 19V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M18 10L12 5L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkArrowUpIcon.displayName = "CashwalkArrowUpIcon";
