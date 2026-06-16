import React from "react";

export interface TrostLocationIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostLocationIcon = React.forwardRef<SVGSVGElement, TrostLocationIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M17.5432 4.91313C20.6141 8.11284 20.6392 13.2925 17.5995 16.5243L13.4135 20.886C12.6325 21.6995 11.3665 21.6995 10.5855 20.886L6.39951 16.5243C3.30694 13.3017 3.30694 8.07712 6.39951 4.85448C9.50125 1.68725 14.4723 1.71341 17.5432 4.91313Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
<circle cx="12" cy="10.3594" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

TrostLocationIcon.displayName = "TrostLocationIcon";
