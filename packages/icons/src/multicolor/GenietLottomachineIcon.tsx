import React from "react";

export interface GenietLottomachineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietLottomachineIcon = React.forwardRef<SVGSVGElement, GenietLottomachineIconProps>(
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
      <path fill="#21B879" d="M8.8 19h6.9l1.024 2.006a1.714 1.714 0 0 1-1.526 2.494H9.3a1.714 1.714 0 0 1-1.527-2.494L8.8 19Z"/>
  <circle cx="12.25" cy="10.25" r="9.75" fill="#D0F2E6"/>
  <circle cx="4" cy="7.5" r="3" fill="#FFB700"/>
  <circle cx="12.5" cy="10.5" r="3" fill="#1FA3F9"/>
  <circle cx="19" cy="4.5" r="3" fill="#FF708A"/>
  <circle cx="18" cy="15" r="3" fill="#333"/>
  <circle cx="9" cy="14.5" r="3" fill="#49CA89"/>
    </svg>
  )
);

GenietLottomachineIcon.displayName = "GenietLottomachineIcon";
