import React from "react";

export interface RunmileMinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileMinusIcon = React.forwardRef<SVGSVGElement, RunmileMinusIconProps>(
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
      <g transform="translate(3.15 11.15)">
    <g id="ic_minus">
    <path id="Union" d="M16.8496 0C17.3191 2.052e-08 17.6992 0.380167 17.6992 0.849609C17.6992 1.31905 17.3191 1.69922 16.8496 1.69922H0.849609C0.380168 1.69922 3.9717e-07 1.31905 0 0.849609C2.052e-08 0.380167 0.380167 -2.052e-08 0.849609 0H16.8496Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileMinusIcon.displayName = "RunmileMinusIcon";
