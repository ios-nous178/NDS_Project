import React from "react";

export interface MockupLinearArrowSquareLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowSquareLeftIcon = React.forwardRef<SVGSVGElement, MockupLinearArrowSquareLeftIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.26 15.53L9.74 12l3.52-3.53"></path>
    </svg>
  )
);

MockupLinearArrowSquareLeftIcon.displayName = "MockupLinearArrowSquareLeftIcon";
