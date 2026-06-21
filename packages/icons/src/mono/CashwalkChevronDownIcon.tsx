import React from "react";

export interface CashwalkChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkChevronDownIcon = React.forwardRef<SVGSVGElement, CashwalkChevronDownIconProps>(
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
      <path d="M18 10L12 16L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkChevronDownIcon.displayName = "CashwalkChevronDownIcon";
