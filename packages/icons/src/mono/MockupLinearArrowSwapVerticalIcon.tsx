import React from "react";

export interface MockupLinearArrowSwapVerticalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowSwapVerticalIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowSwapVerticalIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M9.01 20.5l-5.02-5.01M9.01 3.5v17M14.99 3.5l5.02 5.01M14.99 20.5v-17"></path>
    </svg>
  )
);

MockupLinearArrowSwapVerticalIcon.displayName = "MockupLinearArrowSwapVerticalIcon";
