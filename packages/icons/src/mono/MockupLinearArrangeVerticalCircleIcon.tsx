import React from "react";

export interface MockupLinearArrangeVerticalCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeVerticalCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeVerticalCircleIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M13.82 6.85l3.04 3.04M13.82 17.15V6.85M10.18 17.15l-3.04-3.04M10.18 6.85v10.3"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    </svg>
  )
);

MockupLinearArrangeVerticalCircleIcon.displayName = "MockupLinearArrangeVerticalCircleIcon";
