import React from "react";

export interface MockupLinearArrowSquareDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowSquareDownIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowSquareDownIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.47 10.64L12 14.16l3.53-3.52"></path>
    </svg>
  )
);

MockupLinearArrowSquareDownIcon.displayName = "MockupLinearArrowSquareDownIcon";
