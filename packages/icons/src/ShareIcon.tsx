import React from "react";

export interface ShareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ShareIcon = React.forwardRef<SVGSVGElement, ShareIconProps>(
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
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
  <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
  <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2"/>
  <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
);

ShareIcon.displayName = "ShareIcon";
