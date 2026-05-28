import React from "react";

export interface WalkIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const WalkIcon = React.forwardRef<SVGSVGElement, WalkIconProps>(
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
      <g transform="translate(-4 -4)">
    <g id="Rectangle">
</g>
  </g>
    </svg>
  )
);

WalkIcon.displayName = "WalkIcon";
