import React from "react";

export interface RunmileHomeActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileHomeActiveIcon = React.forwardRef<SVGSVGElement, RunmileHomeActiveIconProps>(
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
      <g transform="translate(2 2.1504)">
    <g id="ic_home_fill">
    <path id="Rectangle 5" d="M8.1 15.75C8.1 14.7006 8.95066 13.85 10 13.85C11.0493 13.85 11.9 14.7006 11.9 15.75V20.85H8.1V15.75Z" fill="currentColor"/>
    <path id="Exclude" d="M7.92676 0.831915C9.08657 -0.277304 10.9134 -0.277305 12.0732 0.831915L19.0732 7.52723C19.6649 8.09314 19.9999 8.87649 20 9.6952V17.8485C19.9999 19.5053 18.6568 20.8485 17 20.8485H13V15.6962C12.9998 14.0395 11.6567 12.6962 10 12.6962C8.34327 12.6962 7.0002 14.0395 7 15.6962V20.8485H3C1.34322 20.8485 0.000120324 19.5053 0 17.8485V9.6952C5.02428e-05 8.87649 0.335123 8.09314 0.926758 7.52723L7.92676 0.831915Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileHomeActiveIcon.displayName = "RunmileHomeActiveIcon";
