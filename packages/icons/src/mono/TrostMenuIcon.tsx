import React from "react";

export interface TrostMenuIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMenuIcon = React.forwardRef<SVGSVGElement, TrostMenuIconProps>(
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
      <rect x="3" y="5" width="18" height="1.5" rx="0.75" fill="currentColor"/>
<rect x="3" y="18" width="18" height="1.5" rx="0.75" fill="currentColor"/>
<rect x="3" y="11.5" width="18" height="1.5" rx="0.75" fill="currentColor"/>
    </svg>
  )
);

TrostMenuIcon.displayName = "TrostMenuIcon";
