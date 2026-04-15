import React from "react";

export interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ChevronDownIcon = React.forwardRef<SVGSVGElement, ChevronDownIconProps>(
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
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

ChevronDownIcon.displayName = "ChevronDownIcon";
