import React from "react";

export interface CashwalkBellIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBellIcon = React.forwardRef<SVGSVGElement, CashwalkBellIconProps>(
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
      <g clipPath="url(#clip0_30_389)">
<path fillRule="evenodd" clipRule="evenodd" d="M14.975 17H8.97498H14.975ZM14.975 17H18.5655C18.948 17 19.1402 17 19.2951 16.9478C19.591 16.848 19.8225 16.6156 19.9223 16.3198C19.9747 16.1643 19.9747 15.9715 19.9747 15.5859C19.9747 15.4172 19.9745 15.3329 19.9613 15.2524C19.9364 15.1004 19.8774 14.9563 19.7876 14.8312C19.7401 14.7651 19.6798 14.7048 19.5608 14.5858L19.1713 14.1963C19.0456 14.0706 18.975 13.9001 18.975 13.7224V10C18.975 6.134 15.841 2.99999 11.975 3C8.10899 3.00001 4.97498 6.13401 4.97498 10V13.7224C4.97498 13.9002 4.90422 14.0706 4.77855 14.1963L4.38904 14.5858C4.26974 14.7051 4.21002 14.765 4.16248 14.8312C4.07264 14.9564 4.01313 15.1004 3.98818 15.2524C3.97498 15.3329 3.97498 15.4172 3.97498 15.586C3.97498 15.9715 3.97498 16.1642 4.02743 16.3197C4.12723 16.6156 4.35978 16.848 4.65564 16.9478C4.81054 17 5.00199 17 5.38454 17H8.97498H14.975Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.975 18C14.975 19.6569 13.6319 21 11.975 21C10.3181 21 8.97498 19.6569 8.97498 18H14.975Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_30_389">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkBellIcon.displayName = "CashwalkBellIcon";
