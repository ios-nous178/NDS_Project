import React from "react";

export interface MockupLinearBackSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBackSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearBackSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M9 15.38h4.92c1.7 0 3.08-1.38 3.08-3.08 0-1.7-1.38-3.08-3.08-3.08H7.15"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.57 10.77L7 9.19l1.57-1.57"></path>
    </svg>
  )
);

MockupLinearBackSquareIcon.displayName = "MockupLinearBackSquareIcon";
