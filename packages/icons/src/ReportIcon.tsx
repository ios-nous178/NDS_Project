import React from "react";

export interface ReportIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ReportIcon = React.forwardRef<SVGSVGElement, ReportIconProps>(
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
      <g transform="translate(2,2)">
    <circle cx="10" cy="10" r="9.25" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="13.7" r="1" fill="currentColor"/>
    <rect x="9" y="5.5" width="2" height="6" rx="1" fill="currentColor"/>
  </g>
    </svg>
  )
);

ReportIcon.displayName = "ReportIcon";
