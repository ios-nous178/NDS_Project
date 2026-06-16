import React from "react";

export interface TrostMemoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMemoIcon = React.forwardRef<SVGSVGElement, TrostMemoIconProps>(
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
      <rect x="3.75" y="2.75" width="16.5" height="18.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
<path d="M8 8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

TrostMemoIcon.displayName = "TrostMemoIcon";
