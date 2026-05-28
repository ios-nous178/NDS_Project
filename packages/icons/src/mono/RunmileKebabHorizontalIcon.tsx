import React from "react";

export interface RunmileKebabHorizontalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileKebabHorizontalIcon = React.forwardRef<SVGSVGElement, RunmileKebabHorizontalIconProps>(
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
      <g transform="translate(3 10)">
    <circle id="Ellipse 33" cx="2" cy="2" r="2" fill="currentColor"/>
  </g>
  <g transform="translate(10 10)">
    <circle id="Ellipse 33" cx="2" cy="2" r="2" fill="currentColor"/>
  </g>
  <g transform="translate(17 10)">
    <circle id="Ellipse 33" cx="2" cy="2" r="2" fill="currentColor"/>
  </g>
    </svg>
  )
);

RunmileKebabHorizontalIcon.displayName = "RunmileKebabHorizontalIcon";
