import React from "react";

export interface CashwalkBizArrowUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizArrowUpIcon = React.forwardRef<SVGSVGElement, CashwalkBizArrowUpIconProps>(
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
<path id="Path 36" d="M8.2 1L1 8.2L8.2 15.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizArrowUpIcon.displayName = "CashwalkBizArrowUpIcon";
