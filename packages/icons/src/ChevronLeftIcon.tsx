import React from "react";

export interface ChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ChevronLeftIcon = React.forwardRef<SVGSVGElement, ChevronLeftIconProps>(
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
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

ChevronLeftIcon.displayName = "ChevronLeftIcon";
