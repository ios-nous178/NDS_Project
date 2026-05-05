import React from "react";

export interface ChevronUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ChevronUpIcon = React.forwardRef<SVGSVGElement, ChevronUpIconProps>(
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
      <g transform="translate(20 16) rotate(180)">
        <path
          id="Vector"
          d="M1 1L8 8L15 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
);

ChevronUpIcon.displayName = "ChevronUpIcon";
