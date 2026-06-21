import React from "react";

export interface CashwalkQrcodeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkQrcodeIcon = React.forwardRef<SVGSVGElement, CashwalkQrcodeIconProps>(
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
      <rect x="18.9999" y="19" width="2" height="2" fill="currentColor"/>
<rect x="12.9999" y="13" width="2" height="2" fill="currentColor"/>
<rect x="15" y="15" width="2" height="2" fill="currentColor"/>
<rect x="12.9999" y="17" width="2" height="2" fill="currentColor"/>
<rect x="15" y="19" width="2" height="2" fill="currentColor"/>
<rect x="17.0001" y="17" width="2" height="2" fill="currentColor"/>
<rect x="17.0001" y="13" width="2" height="2" fill="currentColor"/>
<rect x="18.9999" y="15" width="2" height="2" fill="currentColor"/>
<path d="M9.5 9.5V11H4.5V9.5H9.5ZM9.5 4.5H4.5V11L4.34668 10.9922C3.59028 10.9154 3 10.2767 3 9.5V4.5C3 3.67157 3.67157 3 4.5 3H9.5C10.3284 3 11 3.67157 11 4.5V9.5C11 10.3284 10.3284 11 9.5 11V4.5Z" fill="currentColor"/>
<path d="M9.5 19.5V21H4.5V19.5H9.5ZM9.5 14.5H4.5V21L4.34668 20.9922C3.59028 20.9154 3 20.2767 3 19.5V14.5C3 13.6716 3.67157 13 4.5 13H9.5C10.3284 13 11 13.6716 11 14.5V19.5C11 20.3284 10.3284 21 9.5 21V14.5Z" fill="currentColor"/>
<path d="M19.5 9.5V11H14.5V9.5H19.5ZM19.5 4.5H14.5V11L14.3467 10.9922C13.5903 10.9154 13 10.2767 13 9.5V4.5C13 3.67157 13.6716 3 14.5 3H19.5C20.3284 3 21 3.67157 21 4.5V9.5C21 10.3284 20.3284 11 19.5 11V4.5Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkQrcodeIcon.displayName = "CashwalkQrcodeIcon";
