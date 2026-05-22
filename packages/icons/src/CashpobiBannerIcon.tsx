import React from "react";

export interface CashpobiBannerIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiBannerIcon = React.forwardRef<SVGSVGElement, CashpobiBannerIconProps>(
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
      <rect x="3.25" y="6.5" width="17.5" height="11" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M7.5 14V10h1.4l1.6 2.6V10h1.4v4H10.5L8.9 11.4V14H7.5zm6.6 0V10h3.4v1.1h-2v.5h1.8v1h-1.8v.3h2V14h-3.4z" fill="currentColor"/>
    </svg>
  )
);

CashpobiBannerIcon.displayName = "CashpobiBannerIcon";
