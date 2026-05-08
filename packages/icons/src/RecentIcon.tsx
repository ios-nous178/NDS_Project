import React from "react";

export interface RecentIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RecentIcon = React.forwardRef<SVGSVGElement, RecentIconProps>(
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
      <g id="ic_recent_gray">
<g id="Rectangle">
</g>
<path id="Path" d="M3.91943 14.896C5.10381 18.1646 8.23585 20.5 11.9133 20.5C16.6078 20.5 20.4133 16.6944 20.4133 12C20.4133 7.30558 16.6078 3.5 11.9133 3.5C8.39285 3.5 5.37224 5.64024 4.08167 8.69057" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<g id="Group 3803">
<path id="Path 18" d="M11.9131 11.9999V8.22217" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path 18 Copy" d="M15.1849 13.8889L11.9133 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<path id="Path 19" d="M2.787 6.17739L3.65123 9.40272L6.87657 8.5385" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
    </svg>
  )
);

RecentIcon.displayName = "RecentIcon";
