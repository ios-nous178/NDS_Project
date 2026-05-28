import React from "react";

export interface CashwalkBizArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizArrowRightIcon = React.forwardRef<SVGSVGElement, CashwalkBizArrowRightIconProps>(
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
      <g transform="scale(2.399976 1.142852)">
<g id="Path 37">
<path id="Path 36" d="M8.5 1.50007L1.5 10.5001L8.5 19.5001" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizArrowRightIcon.displayName = "CashwalkBizArrowRightIcon";
