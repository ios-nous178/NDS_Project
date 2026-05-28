import React from "react";

export interface MockupLinearScissorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearScissorIcon = React.forwardRef<SVGSVGElement, MockupLinearScissorIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5.5 21a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM22 6L8.65 15.98M22 17.97L8.65 7.98"></path>
    </svg>
  )
);

MockupLinearScissorIcon.displayName = "MockupLinearScissorIcon";
