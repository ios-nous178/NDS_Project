import React from "react";

export interface MockupLinearArrangeHorizontalCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeHorizontalCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeHorizontalCircleIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M17.15 13.82l-3.04 3.04M6.85 13.82h10.3M6.85 10.18l3.04-3.04M17.15 10.18H6.85"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    </svg>
  )
);

MockupLinearArrangeHorizontalCircleIcon.displayName = "MockupLinearArrangeHorizontalCircleIcon";
