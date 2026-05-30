import React from "react";

export interface TrostSearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostSearchIcon = React.forwardRef<SVGSVGElement, TrostSearchIconProps>(
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
      <g transform="translate(2.64 2.29)">
    <path d="M2.91998 2.91992C5.81366 0.0262501 10.5057 0.0264718 13.3995 2.91992C16.2933 5.81371 16.2933 10.5056 13.3995 13.3994C10.5057 16.2932 5.81377 16.2932 2.91998 13.3994C0.0265265 10.5056 0.0263055 5.8136 2.91998 2.91992Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13.4612 14.16L17.9612 18.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </g>
    </svg>
  )
);

TrostSearchIcon.displayName = "TrostSearchIcon";
