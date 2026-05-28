import React from "react";

export interface RunmilePenActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmilePenActiveIcon = React.forwardRef<SVGSVGElement, RunmilePenActiveIconProps>(
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
      <g transform="translate(0.72 1.5192)">
    <g id="ic/pen/fill">
    <path id="Rectangle 6014" d="M18.6372 2.83879C19.5412 3.74284 19.5406 5.20858 18.6366 6.11261L7.34425 17.4049C7.16902 17.5801 6.94176 17.6952 6.69653 17.7308L3.44205 18.2039C3.34287 18.2182 3.25787 18.1332 3.27218 18.034L3.74519 14.7795C3.78087 14.5343 3.8952 14.3063 4.07043 14.1311L15.3627 2.83879C16.2668 1.93474 17.7332 1.93474 18.6372 2.83879Z" fill="currentColor" stroke="currentColor" strokeWidth="1.7"/>
    </g>
  </g>
    </svg>
  )
);

RunmilePenActiveIcon.displayName = "RunmilePenActiveIcon";
