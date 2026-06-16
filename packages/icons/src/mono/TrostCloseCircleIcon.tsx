import React from "react";

export interface TrostCloseCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostCloseCircleIcon = React.forwardRef<SVGSVGElement, TrostCloseCircleIconProps>(
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
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
<path d="M9 9L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

TrostCloseCircleIcon.displayName = "TrostCloseCircleIcon";
