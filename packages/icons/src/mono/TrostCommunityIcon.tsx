import React from "react";

export interface TrostCommunityIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostCommunityIcon = React.forwardRef<SVGSVGElement, TrostCommunityIconProps>(
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
      <rect x="3" y="2" width="18" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M8 8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

TrostCommunityIcon.displayName = "TrostCommunityIcon";
