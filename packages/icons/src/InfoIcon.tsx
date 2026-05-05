import React from "react";

export interface InfoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const InfoIcon = React.forwardRef<SVGSVGElement, InfoIconProps>(
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
        <g id="Group 13">
          <circle id="Oval" cx="10" cy="10" r="9.25" stroke="currentColor" strokeWidth="1.5" />
          <g id="!">
            <circle
              id="Oval_2"
              cx="1"
              cy="1"
              r="1"
              transform="matrix(1 0 0 -1 9 7.5)"
              fill="currentColor"
            />
            <rect
              id="Rectangle"
              width="2"
              height="6"
              rx="1"
              transform="matrix(1 0 0 -1 9 14.7)"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
    </svg>
  ),
);

InfoIcon.displayName = "InfoIcon";
