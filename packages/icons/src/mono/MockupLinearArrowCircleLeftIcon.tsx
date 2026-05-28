import React from "react";

export interface MockupLinearArrowCircleLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowCircleLeftIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowCircleLeftIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.26 15.53L9.74 12l3.52-3.53"></path>
    </svg>
  )
);

MockupLinearArrowCircleLeftIcon.displayName = "MockupLinearArrowCircleLeftIcon";
