import React from "react";

export interface MockupLinearArrowLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowLeftIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowLeftIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"></path>
    </svg>
  )
);

MockupLinearArrowLeftIcon.displayName = "MockupLinearArrowLeftIcon";
