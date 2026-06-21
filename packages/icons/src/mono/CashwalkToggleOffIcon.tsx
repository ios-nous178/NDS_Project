import React from "react";

export interface CashwalkToggleOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkToggleOffIcon = React.forwardRef<SVGSVGElement, CashwalkToggleOffIconProps>(
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
      <g clipPath="url(#clip0_30_484)">
<rect width="54" height="30" rx="15" fill="currentColor"/>
<circle cx="15" cy="15" r="12" fill="white"/>
</g>
<defs>
<clipPath id="clip0_30_484">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkToggleOffIcon.displayName = "CashwalkToggleOffIcon";
