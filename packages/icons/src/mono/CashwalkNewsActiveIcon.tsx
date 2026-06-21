import React from "react";

export interface CashwalkNewsActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkNewsActiveIcon = React.forwardRef<SVGSVGElement, CashwalkNewsActiveIconProps>(
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
      <g clipPath="url(#clip0_30_216)">
<path fillRule="evenodd" clipRule="evenodd" d="M3 1C1.89543 1 1 1.89543 1 3V18C1 20.7614 3.23858 23 6 23H17C18.1046 23 19 22.1046 19 21V3C19 1.89543 18.1046 1 17 1H3ZM4.90005 6C4.90005 5.50294 5.30299 5.1 5.80005 5.1H14C14.4971 5.1 14.9 5.50294 14.9 6C14.9 6.49706 14.4971 6.9 14 6.9H5.80005C5.30299 6.9 4.90005 6.49706 4.90005 6ZM4.90005 9.5C4.90005 9.00294 5.30299 8.6 5.80005 8.6H13.8C14.2971 8.6 14.7 9.00294 14.7 9.5C14.7 9.99706 14.2971 10.4 13.8 10.4H5.80005C5.30299 10.4 4.90005 9.99706 4.90005 9.5ZM5.1 13C5.1 12.5029 5.50294 12.1 6 12.1H10.2C10.6971 12.1 11.1 12.5029 11.1 13C11.1 13.4971 10.6971 13.9 10.2 13.9H6C5.50294 13.9 5.1 13.4971 5.1 13ZM5.1 16.5C5.1 16.0029 5.50294 15.6 6 15.6H10.2C10.6971 15.6 11.1 16.0029 11.1 16.5C11.1 16.9971 10.6971 17.4 10.2 17.4H6C5.50294 17.4 5.1 16.9971 5.1 16.5Z" fill="currentColor"/>
<path d="M16 22H19.714C20.977 22 22 20.465 22 18.571V11C22 10.4477 21.5523 10 21 10H18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_30_216">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkNewsActiveIcon.displayName = "CashwalkNewsActiveIcon";
