import React from "react";

export interface FilterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const FilterIcon = React.forwardRef<SVGSVGElement, FilterIconProps>(
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
      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

FilterIcon.displayName = "FilterIcon";
