import React from "react";

export interface ArrowNextIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowNextIcon = React.forwardRef<SVGSVGElement, ArrowNextIconProps>(
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
      <g transform="translate(19.5 5) scale(-1 1)">
    <path id="Vector" d="M16 7H1M6.625 13L1 7L6.625 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
    </svg>
  )
);

ArrowNextIcon.displayName = "ArrowNextIcon";
