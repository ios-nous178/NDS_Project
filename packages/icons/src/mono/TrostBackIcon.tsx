import React from "react";

export interface TrostBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostBackIcon = React.forwardRef<SVGSVGElement, TrostBackIconProps>(
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
      <path d="M15 5.25L7.5 12L15 18.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

TrostBackIcon.displayName = "TrostBackIcon";
