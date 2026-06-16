import React from "react";

export interface TrostCalendarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostCalendarIcon = React.forwardRef<SVGSVGElement, TrostCalendarIconProps>(
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
      <rect x="2.75" y="4.75" width="18.5" height="16.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
<rect x="6" y="2" width="1.5" height="5" rx="0.75" fill="currentColor"/>
<rect x="2" y="9" width="20" height="1.5" fill="currentColor"/>
<rect x="16.5" y="2" width="1.5" height="5" rx="0.75" fill="currentColor"/>
    </svg>
  )
);

TrostCalendarIcon.displayName = "TrostCalendarIcon";
