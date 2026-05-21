import React from "react";

export interface MockupLinearArrowLeft3IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowLeft3Icon = React.forwardRef<SVGSVGElement, MockupLinearArrowLeft3IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M18 12v2.67c0 3.31-2.35 4.67-5.22 3.01l-2.31-1.34L8.16 15c-2.87-1.66-2.87-4.37 0-6.03l2.31-1.34 2.31-1.34C15.65 4.66 18 6.01 18 9.33V12z"></path>
    </svg>
  )
);

MockupLinearArrowLeft3Icon.displayName = "MockupLinearArrowLeft3Icon";
