import React from "react";

export interface GenietArrowUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowUpIcon = React.forwardRef<SVGSVGElement, GenietArrowUpIconProps>(
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
      <g fill="none" fillRule="evenodd">
<path d="m6.603 13.653 4.89-4.95a.598.598 0 0 1 .846-.008l5.09 4.95a.6.6 0 1 1-.836.86l-4.665-4.534-4.471 4.526a.6.6 0 1 1-.854-.844z" fill="currentColor" fillRule="nonzero"/>
    </g>
    </svg>
  )
);

GenietArrowUpIcon.displayName = "GenietArrowUpIcon";
