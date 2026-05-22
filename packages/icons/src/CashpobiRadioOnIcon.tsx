import React from "react";

export interface CashpobiRadioOnIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiRadioOnIcon = React.forwardRef<SVGSVGElement, CashpobiRadioOnIconProps>(
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
  <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
    </svg>
  )
);

CashpobiRadioOnIcon.displayName = "CashpobiRadioOnIcon";
