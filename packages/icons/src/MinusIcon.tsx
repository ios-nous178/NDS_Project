import React from "react";

export interface MinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MinusIcon = React.forwardRef<SVGSVGElement, MinusIconProps>(
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
      <g transform="translate(4 11)">
        <g id="Group 3541">
          <line
            id="Line 11"
            x1="1"
            y1="1"
            x2="15"
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  ),
);

MinusIcon.displayName = "MinusIcon";
