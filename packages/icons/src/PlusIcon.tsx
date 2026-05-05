import React from "react";

export interface PlusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PlusIcon = React.forwardRef<SVGSVGElement, PlusIconProps>(
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
      <g transform="translate(4 4)">
        <g id="Group 3541">
          <line
            id="Line 11"
            x1="1"
            y1="8"
            x2="15"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            id="Line 12"
            d="M8 15V9V1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  ),
);

PlusIcon.displayName = "PlusIcon";
