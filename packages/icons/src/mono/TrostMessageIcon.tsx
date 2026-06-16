import React from "react";

export interface TrostMessageIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMessageIcon = React.forwardRef<SVGSVGElement, TrostMessageIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M20.0499 15.9834C18.531 19.0226 15.4255 20.9431 12.0277 20.9444C10.6346 20.9481 9.26021 20.6226 8.01665 19.9945L3.89737 21.3675C3.11561 21.6281 2.37187 20.8844 2.63246 20.1026L4.00555 15.9834C3.37742 14.7398 3.05192 13.3654 3.05555 11.9723C3.05687 8.57453 4.97737 5.46904 8.01665 3.95006C9.26021 3.32193 10.6346 2.99643 12.0277 3.00006H12.5555C17.1111 3.25139 20.7486 6.88892 20.9999 11.4445V11.9723C21.0036 13.3654 20.6781 14.7398 20.0499 15.9834Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<circle cx="8" cy="12" r="1" fill="currentColor"/>
<circle cx="12" cy="12" r="1" fill="currentColor"/>
<circle cx="16" cy="12" r="1" fill="currentColor"/>
    </svg>
  )
);

TrostMessageIcon.displayName = "TrostMessageIcon";
