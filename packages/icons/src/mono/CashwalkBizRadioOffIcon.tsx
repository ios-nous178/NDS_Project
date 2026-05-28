import React from "react";

export interface CashwalkBizRadioOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizRadioOffIcon = React.forwardRef<SVGSVGElement, CashwalkBizRadioOffIconProps>(
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

CashwalkBizRadioOffIcon.displayName = "CashwalkBizRadioOffIcon";
