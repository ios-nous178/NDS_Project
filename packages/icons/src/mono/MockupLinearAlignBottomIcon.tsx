import React from "react";

export interface MockupLinearAlignBottomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearAlignBottomIcon = React.forwardRef<SVGSVGElement, MockupLinearAlignBottomIconProps>(
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
      <path d="M19.26 18.9V7.1c0-1.5-.64-2.1-2.23-2.1h-1.04c-1.59 0-2.23.6-2.23 2.1v11.8M5.26 18.9v-6.8c0-1.5.64-2.1 2.23-2.1h1.04c1.59 0 2.23.6 2.23 2.1v6.8M2 19h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearAlignBottomIcon.displayName = "MockupLinearAlignBottomIcon";
