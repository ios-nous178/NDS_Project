import React from "react";

export interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SearchIcon = React.forwardRef<SVGSVGElement, SearchIconProps>(
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
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2"/>
  <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

SearchIcon.displayName = "SearchIcon";
