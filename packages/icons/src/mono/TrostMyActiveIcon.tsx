import React from "react";

export interface TrostMyActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMyActiveIcon = React.forwardRef<SVGSVGElement, TrostMyActiveIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5 20.9994C20.0523 20.9994 20.5069 20.5492 20.4345 20.0017C19.9128 16.0543 16.3354 12.9994 12 12.9994C7.66455 12.9994 4.08721 16.0543 3.56545 20.0017C3.49308 20.5492 3.94772 20.9994 4.5 20.9994H19.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="12" cy="6.5" r="4.5" fill="currentColor"/>
    </svg>
  )
);

TrostMyActiveIcon.displayName = "TrostMyActiveIcon";
