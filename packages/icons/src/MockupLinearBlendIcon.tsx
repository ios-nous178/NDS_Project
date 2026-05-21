import React from "react";

export interface MockupLinearBlendIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBlendIcon = React.forwardRef<SVGSVGElement, MockupLinearBlendIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.97 12c0 3.31-2.69 6-6 6a5.93 5.93 0 01-4-1.54c1.23-1.09 2-2.69 2-4.46s-.77-3.37-2-4.46a5.93 5.93 0 014-1.54c3.31 0 6 2.69 6 6z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.97 12c0 1.77-.77 3.37-2 4.46a5.93 5.93 0 01-4 1.54c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.54 0 2.94.58 4 1.54 1.23 1.09 2 2.69 2 4.46z"></path>
    </svg>
  )
);

MockupLinearBlendIcon.displayName = "MockupLinearBlendIcon";
