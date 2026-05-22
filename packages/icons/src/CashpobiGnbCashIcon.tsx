import React from "react";

export interface CashpobiGnbCashIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiGnbCashIcon = React.forwardRef<SVGSVGElement, CashpobiGnbCashIconProps>(
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
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M12 6.5v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 1.75 3 1.75 3 .65 3 1.75-1.34 2-3 2-3-.9-3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

CashpobiGnbCashIcon.displayName = "CashpobiGnbCashIcon";
