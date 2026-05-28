import React from "react";

export interface CashwalkBizCautionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizCautionIcon = React.forwardRef<SVGSVGElement, CashwalkBizCautionIconProps>(
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
      <g transform="scale(1 1.052632)">
<path id="Vector" d="M0 0H24V22.8H0V0Z" fill="currentColor"/>
</g>
    </svg>
  )
);

CashwalkBizCautionIcon.displayName = "CashwalkBizCautionIcon";
