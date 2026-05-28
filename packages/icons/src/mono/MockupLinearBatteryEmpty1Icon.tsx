import React from "react";

export interface MockupLinearBatteryEmpty1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBatteryEmpty1Icon = React.forwardRef<SVGSVGElement, MockupLinearBatteryEmpty1IconProps>(
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
      <path d="M13 19H7c-4 0-5-1-5-5v-4c0-4 1-5 5-5h6c4 0 5 1 5 5v4c0 4-1 5-5 5ZM20.5 9.5C22 9.5 22 10 22 11v2c0 1 0 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6.38 10c.33 1.31.33 2.69 0 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearBatteryEmpty1Icon.displayName = "MockupLinearBatteryEmpty1Icon";
