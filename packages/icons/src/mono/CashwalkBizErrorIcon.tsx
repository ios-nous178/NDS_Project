import React from "react";

export interface CashwalkBizErrorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizErrorIcon = React.forwardRef<SVGSVGElement, CashwalkBizErrorIconProps>(
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
      <g id="Group 13">
<circle id="Oval" cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
<g id="!">
<circle id="Oval_2" cx="12" cy="16.44" r="1.2" fill="currentColor"/>
<rect id="Rectangle" x="10.8" y="6.6" width="2.4" height="7.2" rx="1.2" fill="currentColor"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizErrorIcon.displayName = "CashwalkBizErrorIcon";
