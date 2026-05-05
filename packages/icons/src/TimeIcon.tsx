import React from "react";

export interface TimeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TimeIcon = React.forwardRef<SVGSVGElement, TimeIconProps>(
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
      <g transform="translate(2 2)">
        <g id="Group">
          <path
            id="Vector"
            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            id="Vector_2"
            d="M14.5 9.99998H10.25C10.1837 9.99998 10.1201 9.97364 10.0732 9.92675C10.0263 9.87987 10 9.81628 10 9.74998V6.49998"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  ),
);

TimeIcon.displayName = "TimeIcon";
