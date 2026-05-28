import React from "react";

export interface MockupLinearMaskIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMaskIcon = React.forwardRef<SVGSVGElement, MockupLinearMaskIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.07 4.93L4.93 19.07A9.969 9.969 0 012 12C2 6.48 6.48 2 12 2c2.76 0 5.26 1.12 7.07 2.93z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 12c0 5.52-4.48 10-10 10-2.76 0-5.26-1.12-7.07-2.93L19.07 4.93A9.969 9.969 0 0122 12zM7.76 16.24l5.65 5.66M11.29 12.71l6.58 6.57M14.83 9.17l6.29 6.3"></path>
    </svg>
  )
);

MockupLinearMaskIcon.displayName = "MockupLinearMaskIcon";
