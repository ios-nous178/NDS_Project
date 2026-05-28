import React from "react";

export interface CashwalkBizArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizArrowDownIcon = React.forwardRef<SVGSVGElement, CashwalkBizArrowDownIconProps>(
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
      <g transform="scale(2.608696 1.463415)">
<g id="Path 37">
<path id="Path 36" d="M1 1L8.2 8.2L1 15.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizArrowDownIcon.displayName = "CashwalkBizArrowDownIcon";
