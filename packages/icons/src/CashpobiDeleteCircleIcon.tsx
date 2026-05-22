import React from "react";

export interface CashpobiDeleteCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiDeleteCircleIcon = React.forwardRef<SVGSVGElement, CashpobiDeleteCircleIconProps>(
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
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

CashpobiDeleteCircleIcon.displayName = "CashpobiDeleteCircleIcon";
