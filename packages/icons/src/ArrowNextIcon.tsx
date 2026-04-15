import React from "react";

export interface ArrowNextIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowNextIcon = React.forwardRef<SVGSVGElement, ArrowNextIconProps>(
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
      <path d="M4.5 12H19.5M19.5 12L13.875 6M19.5 12L13.875 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

ArrowNextIcon.displayName = "ArrowNextIcon";
