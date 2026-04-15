import React from "react";

export interface MinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MinusIcon = React.forwardRef<SVGSVGElement, MinusIconProps>(
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
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

MinusIcon.displayName = "MinusIcon";
