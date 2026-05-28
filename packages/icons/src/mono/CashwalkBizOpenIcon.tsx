import React from "react";

export interface CashwalkBizOpenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizOpenIcon = React.forwardRef<SVGSVGElement, CashwalkBizOpenIconProps>(
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
      <path d="M10 4H5a1.5 1.5 0 00-1.5 1.5v13.5A1.5 1.5 0 005 20.5h13.5A1.5 1.5 0 0020 19v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M14 4h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20 4l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

CashwalkBizOpenIcon.displayName = "CashwalkBizOpenIcon";
