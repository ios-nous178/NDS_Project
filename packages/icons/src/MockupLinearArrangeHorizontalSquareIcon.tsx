import React from "react";

export interface MockupLinearArrangeHorizontalSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeHorizontalSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeHorizontalSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M17.15 13.82l-3.04 3.04M6.85 13.82h10.3"></path><g><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M6.85 10.18l3.04-3.04M17.15 10.18H6.85"></path></g>
    </svg>
  )
);

MockupLinearArrangeHorizontalSquareIcon.displayName = "MockupLinearArrangeHorizontalSquareIcon";
