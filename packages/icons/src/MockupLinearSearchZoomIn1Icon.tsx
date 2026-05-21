import React from "react";

export interface MockupLinearSearchZoomIn1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSearchZoomIn1Icon = React.forwardRef<SVGSVGElement, MockupLinearSearchZoomIn1IconProps>(
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
      <path d="M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 11h5M11 13.5v-5M18.93 20.69c.53 1.6 1.74 1.76 2.67.36.85-1.28.29-2.33-1.25-2.33-1.14-.01-1.78.88-1.42 1.97Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSearchZoomIn1Icon.displayName = "MockupLinearSearchZoomIn1Icon";
