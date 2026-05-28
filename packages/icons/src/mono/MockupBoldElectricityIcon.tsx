import React from "react";

export interface MockupBoldElectricityIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldElectricityIcon = React.forwardRef<SVGSVGElement, MockupBoldElectricityIconProps>(
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
      <path d="M15.59 5h-.34V2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v3h-3.5V2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v3h-.34C7.36 5 6.5 5.86 6.5 6.91V12c0 2.2 1.5 4 4 4h.75v6c0 .41.34.75.75.75s.75-.34.75-.75v-6h.75c2.5 0 4-1.8 4-4V6.91c0-1.05-.86-1.91-1.91-1.91Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldElectricityIcon.displayName = "MockupBoldElectricityIcon";
