import React from "react";

export interface TrostMkBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkBackIcon = React.forwardRef<SVGSVGElement, TrostMkBackIconProps>(
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
      <path d="M11 5L4 12L11 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

TrostMkBackIcon.displayName = "TrostMkBackIcon";
