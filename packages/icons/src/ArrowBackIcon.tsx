import React from "react";

export interface ArrowBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowBackIcon = React.forwardRef<SVGSVGElement, ArrowBackIconProps>(
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
      <path d="M19.5 12H4.5M4.5 12L10.125 6M4.5 12L10.125 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

ArrowBackIcon.displayName = "ArrowBackIcon";
