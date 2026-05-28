import React from "react";

export interface CashwalkBizCheckboxOnGreenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizCheckboxOnGreenIcon = React.forwardRef<SVGSVGElement, CashwalkBizCheckboxOnGreenIconProps>(
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
      <g transform="scale(2.086957 2.823529)">
<path id="Path 4" d="M10.2006 0.239442C10.4826 -0.0639769 10.9571 -0.08136 11.2606 0.200615C11.564 0.482591 11.5814 0.957146 11.2994 1.26056L4.79409 8.26056C4.49741 8.57982 3.99201 8.57982 3.69532 8.26056L0.200615 4.5001C-0.08136 4.19668 -0.0639769 3.72213 0.239442 3.44015C0.54286 3.15818 1.01742 3.17556 1.29939 3.47898L4.245 6.648L10.2006 0.239442Z" fill="currentColor"/>
</g>
    </svg>
  )
);

CashwalkBizCheckboxOnGreenIcon.displayName = "CashwalkBizCheckboxOnGreenIcon";
