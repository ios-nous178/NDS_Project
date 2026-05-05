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
      <g transform="translate(3 3)">
        <g id="Group 2">
          <ellipse
            id="Oval"
            cx="8"
            cy="8"
            rx="7"
            ry="7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Path"
            d="M17 17L13 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  ),
);

SearchIcon.displayName = "SearchIcon";
