import React from "react";

export interface InfoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const InfoIcon = React.forwardRef<SVGSVGElement, InfoIconProps>(
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
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  )
);

InfoIcon.displayName = "InfoIcon";
