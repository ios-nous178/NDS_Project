import React from "react";

export interface TrostArrowBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostArrowBackIcon = React.forwardRef<SVGSVGElement, TrostArrowBackIconProps>(
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
      <g clipPath="url(#clip0_5022_1791)">
<path d="M11 5L4 12L11 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5022_1791">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostArrowBackIcon.displayName = "TrostArrowBackIcon";
