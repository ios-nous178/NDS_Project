import React from "react";

export interface MockupLinearArrowForwardSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowForwardSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowForwardSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15 15.38h-4.92C8.38 15.38 7 14 7 12.3c0-1.7 1.38-3.08 3.08-3.08h6.77"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.43 10.77L17 9.19l-1.57-1.57"></path>
    </svg>
  )
);

MockupLinearArrowForwardSquareIcon.displayName = "MockupLinearArrowForwardSquareIcon";
