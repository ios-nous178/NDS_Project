import React from "react";

export interface TrostMkMymusicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkMymusicIcon = React.forwardRef<SVGSVGElement, TrostMkMymusicIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M21 18.2C21 19.1941 20.1941 20 19.2 20H4.8C3.80589 20 3 19.1941 3 18.2V5.6C3 4.60589 3.80589 3.8 4.8 3.8H9.3L11.1 6.5H19.2C20.1941 6.5 21 7.30589 21 8.3V18.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

TrostMkMymusicIcon.displayName = "TrostMkMymusicIcon";
