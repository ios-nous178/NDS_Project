import React from "react";

export interface TrostCheckIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostCheckIcon = React.forwardRef<SVGSVGElement, TrostCheckIconProps>(
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
      <g clipPath="url(#clip0_5022_1565)">
<path d="M6 11.858L10.094 16L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5022_1565">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostCheckIcon.displayName = "TrostCheckIcon";
