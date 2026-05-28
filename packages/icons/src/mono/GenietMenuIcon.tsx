import React from "react";

export interface GenietMenuIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietMenuIcon = React.forwardRef<SVGSVGElement, GenietMenuIconProps>(
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
      <g fill="currentColor" fillRule="evenodd">
        <path d="M3 19h9v-2H3zM3 13h18v-2H3zM3 5v2h18V5z"/>
    </g>
    </svg>
  )
);

GenietMenuIcon.displayName = "GenietMenuIcon";
