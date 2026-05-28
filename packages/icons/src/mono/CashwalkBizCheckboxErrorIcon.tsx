import React from "react";

export interface CashwalkBizCheckboxErrorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizCheckboxErrorIcon = React.forwardRef<SVGSVGElement, CashwalkBizCheckboxErrorIconProps>(
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
      <g transform="scale(2.553191 2.553191)">
<g id="Group">
<path id="Line" d="M0.346447 0.346447C0.523958 0.168936 0.801733 0.152798 0.997474 0.298035L1.05355 0.346447L9.05355 8.34645C9.24882 8.54171 9.24882 8.85829 9.05355 9.05355C8.87604 9.23106 8.59827 9.2472 8.40253 9.10197L8.34645 9.05355L0.346447 1.05355C0.151184 0.858291 0.151184 0.541709 0.346447 0.346447Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4"/>
<path id="Line_2" d="M9.05355 0.346447C9.23106 0.523958 9.2472 0.801733 9.10197 0.997474L9.05355 1.05355L1.05355 9.05355C0.858292 9.24882 0.541708 9.24882 0.346446 9.05355C0.168935 8.87604 0.152799 8.59827 0.298035 8.40253L0.346446 8.34645L8.34645 0.346447C8.54171 0.151184 8.85829 0.151184 9.05355 0.346447Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizCheckboxErrorIcon.displayName = "CashwalkBizCheckboxErrorIcon";
