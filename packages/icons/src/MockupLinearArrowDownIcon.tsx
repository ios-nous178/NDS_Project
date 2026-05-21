import React from "react";

export interface MockupLinearArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowDownIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowDownIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M18.07 14.43L12 20.5l-6.07-6.07M12 3.5v16.83"></path>
    </svg>
  )
);

MockupLinearArrowDownIcon.displayName = "MockupLinearArrowDownIcon";
