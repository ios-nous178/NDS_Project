import React from "react";

export interface RunmilePlusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmilePlusIcon = React.forwardRef<SVGSVGElement, RunmilePlusIconProps>(
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
      <g transform="translate(3.15 3.15)">
    <g id="ic_plus">
    <path id="Union" d="M8.84961 0C9.31905 0 9.69922 0.380167 9.69922 0.849609V8H16.8496C17.3191 8 17.6992 8.38017 17.6992 8.84961C17.6992 9.31905 17.3191 9.69922 16.8496 9.69922H9.69922V16.8496C9.69922 17.3191 9.31905 17.6992 8.84961 17.6992C8.38017 17.6992 8 17.3191 8 16.8496V9.69922H0.849609C0.380168 9.69922 3.9717e-07 9.31905 0 8.84961C2.052e-08 8.38017 0.380167 8 0.849609 8H8V0.849609C8 0.380167 8.38017 0 8.84961 0Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmilePlusIcon.displayName = "RunmilePlusIcon";
