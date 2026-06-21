import React from "react";

export interface CashwalkChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkChevronRightIcon = React.forwardRef<SVGSVGElement, CashwalkChevronRightIconProps>(
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
      <path d="M10 18L16 12L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkChevronRightIcon.displayName = "CashwalkChevronRightIcon";
