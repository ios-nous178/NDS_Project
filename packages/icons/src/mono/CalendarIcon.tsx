import React from "react";

export interface CalendarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CalendarIcon = React.forwardRef<SVGSVGElement, CalendarIconProps>(
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
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
);

CalendarIcon.displayName = "CalendarIcon";
