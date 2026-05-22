import React from "react";

export interface CashpobiGnbBannerIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiGnbBannerIcon = React.forwardRef<SVGSVGElement, CashpobiGnbBannerIconProps>(
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
      <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M3.75 9h16.5" stroke="currentColor" strokeWidth="1.5"/>
  <circle cx="7" cy="7" r="0.85" fill="currentColor"/>
    </svg>
  )
);

CashpobiGnbBannerIcon.displayName = "CashpobiGnbBannerIcon";
