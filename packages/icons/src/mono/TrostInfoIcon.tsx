import React from "react";

export interface TrostInfoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostInfoIcon = React.forwardRef<SVGSVGElement, TrostInfoIconProps>(
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
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5"/>
<circle cx="12" cy="8.39941" r="1" transform="rotate(-180 12 8.39941)" fill="currentColor"/>
<rect x="13" y="16.5996" width="2" height="6" rx="1" transform="rotate(-180 13 16.5996)" fill="currentColor"/>
    </svg>
  )
);

TrostInfoIcon.displayName = "TrostInfoIcon";
