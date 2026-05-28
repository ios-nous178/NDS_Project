import React from "react";

export interface CashpobiCheckboxOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiCheckboxOffIcon = React.forwardRef<SVGSVGElement, CashpobiCheckboxOffIconProps>(
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
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
);

CashpobiCheckboxOffIcon.displayName = "CashpobiCheckboxOffIcon";
