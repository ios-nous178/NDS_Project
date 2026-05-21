import React from "react";

export interface MockupLinearArrowSwapHorizontalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowSwapHorizontalIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowSwapHorizontalIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M20.5 14.99l-5.01 5.02M3.5 14.99h17M3.5 9.01l5.01-5.02M20.5 9.01h-17"></path>
    </svg>
  )
);

MockupLinearArrowSwapHorizontalIcon.displayName = "MockupLinearArrowSwapHorizontalIcon";
