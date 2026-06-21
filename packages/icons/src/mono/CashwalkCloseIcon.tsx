import React from "react";

export interface CashwalkCloseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkCloseIcon = React.forwardRef<SVGSVGElement, CashwalkCloseIconProps>(
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
      <path d="M18.5 5.5L5.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.5 5.5L18.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkCloseIcon.displayName = "CashwalkCloseIcon";
