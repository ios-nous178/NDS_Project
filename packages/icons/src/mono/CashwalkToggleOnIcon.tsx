import React from "react";

export interface CashwalkToggleOnIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkToggleOnIcon = React.forwardRef<SVGSVGElement, CashwalkToggleOnIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 54 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g clipPath="url(#clip0_30_480)">
<rect width="54" height="30" rx="15" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_30_480">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkToggleOnIcon.displayName = "CashwalkToggleOnIcon";
