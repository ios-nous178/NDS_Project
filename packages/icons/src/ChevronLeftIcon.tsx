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
      <g transform="translate(7 4)">
    <path id="Vector" d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
    </svg>
  )
);

ChevronLeftIcon.displayName = "ChevronLeftIcon";
