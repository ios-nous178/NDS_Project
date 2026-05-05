import React from "react";

export interface MoreIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MoreIcon = React.forwardRef<SVGSVGElement, MoreIconProps>(
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
      <g transform="translate(4.5 13.5) rotate(-90)">
        <g id="Group">
          <path
            id="Path"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 3C2.325 3 3 2.325 3 1.5C3 0.675 2.325 0 1.5 0C0.675 0 0 0.675 0 1.5C0 2.325 0.675 3 1.5 3V3Z"
            fill="currentColor"
          />
          <path
            id="Path_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 6C0.675 6 0 6.675 0 7.5C0 8.325 0.675 9 1.5 9C2.325 9 3 8.325 3 7.5C3 6.675 2.325 6 1.5 6V6Z"
            fill="currentColor"
          />
          <path
            id="Path_3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 12C0.675 12 0 12.675 0 13.5C0 14.325 0.675 15 1.5 15C2.325 15 3 14.325 3 13.5C3 12.675 2.325 12 1.5 12V12Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

MoreIcon.displayName = "MoreIcon";
