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
      <path fill="currentColor" d="M4.4 7.9a.849.849 0 0 0 0 1.2l7 7a.849.849 0 0 0 1.2 0l7-7a.849.849 0 1 0-1.2-1.2L12 14.298l-6.4-6.4a.849.849 0 0 0-1.2 0Z"/>
    </svg>
  )
);

GenietArrowDownIcon.displayName = "GenietArrowDownIcon";
