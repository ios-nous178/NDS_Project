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
      viewBox="-2.19 -1.69 27.38 27.38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M8.79912 19H15.6991L16.7242 21.0055C17.3072 22.1462 16.4787 23.5 15.1977 23.5H9.30053C8.01953 23.5 7.19108 22.1462 7.77408 21.0055L8.79912 19Z" fill="#21B879"/>
<circle cx="12.25" cy="10.25" r="9.75" fill="#D0F2E6"/>
<circle cx="4" cy="7.5" r="3" fill="#FFB700"/>
<circle cx="12.5" cy="10.5" r="3" fill="#1FA3F9"/>
<circle cx="19" cy="4.5" r="3" fill="#FF708A"/>
<circle cx="18" cy="15" r="3" fill="#333333"/>
<circle cx="9" cy="14.5" r="3" fill="#49CA89"/>
    </svg>
  )
);

GenietLottomachineIcon.displayName = "GenietLottomachineIcon";
