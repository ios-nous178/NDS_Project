import React from "react";

export interface TrostMkTalkIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkTalkIcon = React.forwardRef<SVGSVGElement, TrostMkTalkIconProps>(
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
      <g transform="translate(2.04 2.04)">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.2218 13.7333C16.7028 16.7726 13.5974 18.6931 10.1996 18.6944C8.80644 18.6981 7.4321 18.3725 6.18853 17.7444L2.06925 19.1175C1.2875 19.3781 0.543757 18.6344 0.804343 17.8526L2.17744 13.7333C1.54931 12.4898 1.22381 11.1154 1.22744 9.72222C1.22875 6.3245 3.14925 3.21901 6.18853 1.70003C7.4321 1.0719 8.80644 0.746398 10.1996 0.75003H10.7274C15.283 1.00136 18.9205 4.63889 19.1718 9.19445V9.72222C19.1755 11.1154 18.85 12.4898 18.2218 13.7333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6.17189" cy="9.74997" r="1" fill="currentColor"/>
    <circle cx="10.1719" cy="9.74997" r="1" fill="currentColor"/>
    <circle cx="14.1719" cy="9.74997" r="1" fill="currentColor"/>
  </g>
    </svg>
  )
);

TrostMkTalkIcon.displayName = "TrostMkTalkIcon";
