import React from "react";

export interface CashwalkNewsIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkNewsIcon = React.forwardRef<SVGSVGElement, CashwalkNewsIconProps>(
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
      <g clipPath="url(#clip0_30_266)">
<path d="M5.80005 6H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
<path d="M5.80005 9.5H13.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
<path d="M6 13H10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
<path d="M6 16.5H10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
<path fillRule="evenodd" clipRule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V21C18 21.5523 17.5523 22 17 22H6C3.79086 22 2 20.2091 2 18V3Z" stroke="currentColor" strokeWidth="2"/>
<path d="M16 22H19.714C20.977 22 22 20.465 22 18.571V11C22 10.4477 21.5523 10 21 10H18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_30_266">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkNewsIcon.displayName = "CashwalkNewsIcon";
