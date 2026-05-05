import React from "react";

export interface ShareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ShareIcon = React.forwardRef<SVGSVGElement, ShareIconProps>(
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
      <g transform="translate(3 2)">
        <g id="Group">
          <circle
            id="Oval"
            cx="14.5"
            cy="3.5"
            r="2.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            id="Oval_2"
            cx="3.5"
            cy="10"
            r="2.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            id="Oval_3"
            cx="14.5"
            cy="16.5"
            r="2.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Path"
            d="M6 11L12 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Path_2"
            d="M12 5L6 9"
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

ShareIcon.displayName = "ShareIcon";
