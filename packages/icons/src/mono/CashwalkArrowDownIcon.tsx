import React from "react";

export interface CashwalkArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkArrowDownIcon = React.forwardRef<SVGSVGElement, CashwalkArrowDownIconProps>(
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
      <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M18 14L12 19L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkArrowDownIcon.displayName = "CashwalkArrowDownIcon";
