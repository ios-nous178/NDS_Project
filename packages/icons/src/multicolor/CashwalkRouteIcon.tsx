import React from "react";

export interface CashwalkRouteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkRouteIcon = React.forwardRef<SVGSVGElement, CashwalkRouteIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M4.90002 21.9334C4.90002 23.0932 5.84023 24.0334 7.00002 24.0334C8.15982 24.0334 9.10002 23.0932 9.10002 21.9334C9.10002 20.7736 8.15982 19.8334 7.00002 19.8334C5.84023 19.8334 4.90002 20.7736 4.90002 21.9334Z" fill="#FFA400"/>
<path d="M4.90002 21.9334C4.90002 23.0932 5.84023 24.0334 7.00002 24.0334C8.15982 24.0334 9.10002 23.0932 9.10002 21.9334C9.10002 20.7736 8.15982 19.8334 7.00002 19.8334C5.84023 19.8334 4.90002 20.7736 4.90002 21.9334" stroke="#FFA400" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
<path fillRule="evenodd" clipRule="evenodd" d="M21 8.63335C22.1598 8.63335 23.1 7.69315 23.1 6.53335C23.1 5.37355 22.1598 4.43335 21 4.43335C19.8402 4.43335 18.9 5.37355 18.9 6.53335C18.9 7.69315 19.8402 8.63335 21 8.63335Z" fill="#FF6363"/>
<path d="M21 8.63335C22.1598 8.63335 23.1 7.69315 23.1 6.53335C23.1 5.37355 22.1598 4.43335 21 4.43335C19.8402 4.43335 18.9 5.37355 18.9 6.53335C18.9 7.69315 19.8402 8.63335 21 8.63335" stroke="#FF6363" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkRouteIcon.displayName = "CashwalkRouteIcon";
