import React from "react";

export interface MockupLinearBatteryDisableIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBatteryDisableIcon = React.forwardRef<SVGSVGElement, MockupLinearBatteryDisableIconProps>(
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
      <path d="M20.5 9.5C22 9.5 22 10 22 11v2c0 1 0 1.5-1.5 1.5M4 21.5l12-19M7 5c-4 0-5 1-5 5v4c0 3.4.72 4.63 3.39 4.92M13 19c4 0 5-1 5-5v-4c0-3.39-.72-4.63-3.37-4.92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearBatteryDisableIcon.displayName = "MockupLinearBatteryDisableIcon";
