import React from "react";

export interface TrostArrowForwardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostArrowForwardIcon = React.forwardRef<SVGSVGElement, TrostArrowForwardIconProps>(
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
      <g clipPath="url(#clip0_5022_1797)">
<path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5022_1797">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostArrowForwardIcon.displayName = "TrostArrowForwardIcon";
