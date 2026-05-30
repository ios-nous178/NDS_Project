import React from "react";

export interface TrostMkHomeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkHomeIcon = React.forwardRef<SVGSVGElement, TrostMkHomeIconProps>(
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
      <g transform="translate(-24 -6.75)">
    <path fillRule="evenodd" clipRule="evenodd" d="M29 27.4958V19.4958H26L34.7083 10.5735C35.2868 9.98051 36.2365 9.96898 36.8294 10.5476L46 19.5L43 19.4958V27.4958H29Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M33 27V19.5H39V27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
    </svg>
  )
);

TrostMkHomeIcon.displayName = "TrostMkHomeIcon";
