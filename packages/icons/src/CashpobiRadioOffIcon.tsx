import React from "react";

export interface CashpobiRadioOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiRadioOffIcon = React.forwardRef<SVGSVGElement, CashpobiRadioOffIconProps>(
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
      <circle id="Oval" cx="12" cy="12" r="10.8" stroke="currentColor" strokeWidth="2.4"/>
    </svg>
  )
);

CashpobiRadioOffIcon.displayName = "CashpobiRadioOffIcon";
