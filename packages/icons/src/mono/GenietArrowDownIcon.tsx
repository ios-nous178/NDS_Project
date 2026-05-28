import React from "react";

export interface GenietArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowDownIcon = React.forwardRef<SVGSVGElement, GenietArrowDownIconProps>(
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
<path d="m17.43 9.547-4.891 4.95a.598.598 0 0 1-.845.008l-5.09-4.95a.6.6 0 1 1 .836-.86l4.665 4.534 4.471-4.526a.6.6 0 1 1 .854.844z" fill="currentColor" fillRule="nonzero"/>
    </g>
    </svg>
  )
);

GenietArrowDownIcon.displayName = "GenietArrowDownIcon";
