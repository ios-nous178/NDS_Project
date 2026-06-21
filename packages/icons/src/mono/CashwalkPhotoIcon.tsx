import React from "react";

export interface CashwalkPhotoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkPhotoIcon = React.forwardRef<SVGSVGElement, CashwalkPhotoIconProps>(
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
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
<path fillRule="evenodd" clipRule="evenodd" d="M3.90002 19.8263L8.0133 13.3989C8.32384 12.9136 8.9791 12.7904 9.44465 13.1298L12.0453 15.0256L15.6915 10.6219C16.0992 10.1295 16.8579 10.1409 17.2507 10.6453L20.0814 14.2805V19.8263H3.90002Z" fill="currentColor"/>
<circle cx="8.39998" cy="8.39998" r="1.8" fill="currentColor"/>
    </svg>
  )
);

CashwalkPhotoIcon.displayName = "CashwalkPhotoIcon";
