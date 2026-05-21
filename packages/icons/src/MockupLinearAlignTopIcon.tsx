import React from "react";

export interface MockupLinearAlignTopIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearAlignTopIcon = React.forwardRef<SVGSVGElement, MockupLinearAlignTopIconProps>(
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
      <path d="M19.26 5.1v11.8c0 1.5-.64 2.1-2.23 2.1h-1.04c-1.59 0-2.23-.6-2.23-2.1V5.1M5.26 5.1v6.8c0 1.5.64 2.1 2.23 2.1h1.04c1.59 0 2.23-.6 2.23-2.1V5.1M2 5h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearAlignTopIcon.displayName = "MockupLinearAlignTopIcon";
