import React from "react";

export interface MoreIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MoreIcon = React.forwardRef<SVGSVGElement, MoreIconProps>(
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
      <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  )
);

MoreIcon.displayName = "MoreIcon";
