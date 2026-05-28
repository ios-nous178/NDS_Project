import React from "react";

export interface MockupLinearReceiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearReceiveIcon = React.forwardRef<SVGSVGElement, MockupLinearReceiveIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M5 17.5l14-14M5 7.23V17.5h10.27M3.5 22h17"></path>
    </svg>
  )
);

MockupLinearReceiveIcon.displayName = "MockupLinearReceiveIcon";
