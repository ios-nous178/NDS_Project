import React from "react";

export interface MockupLinearArrowForwardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowForwardIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowForwardIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M16.87 18.31h-8c-2.76 0-5-2.24-5-5s2.24-5 5-5h11"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.57 10.81l2.56-2.56-2.56-2.56"></path>
    </svg>
  )
);

MockupLinearArrowForwardIcon.displayName = "MockupLinearArrowForwardIcon";
