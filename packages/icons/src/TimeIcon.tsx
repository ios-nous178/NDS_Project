import React from "react";

export interface TimeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TimeIcon = React.forwardRef<SVGSVGElement, TimeIconProps>(
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
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

TimeIcon.displayName = "TimeIcon";
