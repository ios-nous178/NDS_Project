import React from "react";

export interface TrostPauseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostPauseIcon = React.forwardRef<SVGSVGElement, TrostPauseIconProps>(
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
      <rect x="6" y="3" width="4" height="18" rx="2" fill="currentColor"/>
<rect x="14" y="3" width="4" height="18" rx="2" fill="currentColor"/>
    </svg>
  )
);

TrostPauseIcon.displayName = "TrostPauseIcon";
