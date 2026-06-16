import React from "react";

export interface TrostMyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMyIcon = React.forwardRef<SVGSVGElement, TrostMyIconProps>(
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
      <mask id="mask0_5022_1295" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<rect width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_5022_1295)">
<path fillRule="evenodd" clipRule="evenodd" d="M19.5 20.999C20.0523 20.999 20.5069 20.5489 20.4345 20.0014C19.9128 16.0539 16.3354 12.999 12 12.999C7.66455 12.999 4.08721 16.0539 3.56545 20.0014C3.49308 20.5489 3.94772 20.999 4.5 20.999H19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<circle cx="12" cy="6.5" r="3.75" stroke="currentColor" strokeWidth="1.5"/>
</g>
    </svg>
  )
);

TrostMyIcon.displayName = "TrostMyIcon";
