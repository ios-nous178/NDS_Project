import React from "react";

export interface MockupLinearStopIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearStopIcon = React.forwardRef<SVGSVGElement, MockupLinearStopIconProps>(
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
      <path d="M9.3 21h5.4c4.5 0 6.3-1.8 6.3-6.3V9.3C21 4.8 19.2 3 14.7 3H9.3C4.8 3 3 4.8 3 9.3v5.4C3 19.2 4.8 21 9.3 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearStopIcon.displayName = "MockupLinearStopIcon";
