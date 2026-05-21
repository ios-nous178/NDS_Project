import React from "react";

export interface MockupLinearBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBackIcon = React.forwardRef<SVGSVGElement, MockupLinearBackIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M7.13 18.31h8c2.76 0 5-2.24 5-5s-2.24-5-5-5h-11"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.43 10.81L3.87 8.25l2.56-2.56"></path>
    </svg>
  )
);

MockupLinearBackIcon.displayName = "MockupLinearBackIcon";
