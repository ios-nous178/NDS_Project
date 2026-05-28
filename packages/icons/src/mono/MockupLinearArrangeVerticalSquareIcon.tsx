import React from "react";

export interface MockupLinearArrangeVerticalSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeVerticalSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeVerticalSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M10.18 17.15l-3.04-3.04M10.18 6.85v10.3"></path><g><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M13.82 6.85l3.04 3.04M13.82 17.15V6.85"></path></g>
    </svg>
  )
);

MockupLinearArrangeVerticalSquareIcon.displayName = "MockupLinearArrangeVerticalSquareIcon";
