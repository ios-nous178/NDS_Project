import React from "react";

export interface TrostListIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostListIcon = React.forwardRef<SVGSVGElement, TrostListIconProps>(
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
      <g clipPath="url(#clip0_5022_1500)">
<path fillRule="evenodd" clipRule="evenodd" d="M7.58333 6.25H20.4167C20.7388 6.25 21 5.91421 21 5.5C21 5.08579 20.7388 4.75 20.4167 4.75H7.58333C7.26117 4.75 7 5.08579 7 5.5C7 5.91421 7.26117 6.25 7.58333 6.25Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M7.58333 12.751H20.4167C20.7388 12.751 21 12.4152 21 12.001C21 11.5868 20.7388 11.251 20.4167 11.251H7.58333C7.26117 11.251 7 11.5868 7 12.001C7 12.4152 7.26117 12.751 7.58333 12.751Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M7.58333 19.251H20.4167C20.7388 19.251 21 18.9152 21 18.501C21 18.0868 20.7388 17.751 20.4167 17.751H7.58333C7.26117 17.751 7 18.0868 7 18.501C7 18.9152 7.26117 19.251 7.58333 19.251Z" fill="currentColor"/>
<circle cx="4" cy="5.5" r="1" fill="currentColor"/>
<circle cx="4" cy="18.5" r="1" fill="currentColor"/>
<circle cx="4" cy="12" r="1" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_5022_1500">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostListIcon.displayName = "TrostListIcon";
