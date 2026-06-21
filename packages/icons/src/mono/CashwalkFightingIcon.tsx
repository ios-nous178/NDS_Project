import React from "react";

export interface CashwalkFightingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkFightingIcon = React.forwardRef<SVGSVGElement, CashwalkFightingIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9027 17.28C11.5367 14.97 13.7538 13.32 16.3076 13.5928C18.7389 13.8524 20.6718 15.916 20.7942 18.3712C20.8248 19.018 20.7374 19.6384 20.5493 20.2148C20.4356 20.5668 20.0945 20.8 19.7228 20.8H6.69943C4.49198 20.8 2.8364 18.7676 3.26932 16.5896L5.08714 7.44385C5.57748 4.97688 7.74236 3.19995 10.2576 3.19995C10.8266 3.19995 11.3518 3.50564 11.6328 4.00045L12.0547 4.74331C12.5511 5.61738 12.3089 6.72506 11.493 7.31224L10.5916 7.96102C9.80436 8.52761 8.70964 8.36787 8.11713 7.59995" fill="currentColor"/>
<path d="M10.9027 17.28C11.5367 14.97 13.7538 13.32 16.3076 13.5928C18.7389 13.8524 20.6718 15.916 20.7942 18.3712C20.8248 19.018 20.7374 19.6384 20.5493 20.2148C20.4356 20.5668 20.0945 20.8 19.7228 20.8H6.69943C4.49198 20.8 2.8364 18.7676 3.26932 16.5896L5.08714 7.44385C5.57748 4.97688 7.74236 3.19995 10.2576 3.19995C10.8266 3.19995 11.3518 3.50564 11.6328 4.00045L12.0547 4.74331C12.5511 5.61738 12.3089 6.72506 11.493 7.31224L10.5916 7.96102C9.80436 8.52761 8.70964 8.36787 8.11713 7.59995" stroke="currentColor" strokeWidth="1.74917" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

CashwalkFightingIcon.displayName = "CashwalkFightingIcon";
