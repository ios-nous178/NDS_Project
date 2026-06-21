import React from "react";

export interface CashwalkCheckIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkCheckIcon = React.forwardRef<SVGSVGElement, CashwalkCheckIconProps>(
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
      <path d="M5 11.2861L9.66667 17L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkCheckIcon.displayName = "CashwalkCheckIcon";
