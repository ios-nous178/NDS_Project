import React from "react";

export interface MockupLinearArrowUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowUpIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowUpIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M18.07 9.57L12 3.5 5.93 9.57M12 20.5V3.67"></path>
    </svg>
  )
);

MockupLinearArrowUpIcon.displayName = "MockupLinearArrowUpIcon";
