import React from "react";

export interface MockupLinearLocationMinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLocationMinusIcon = React.forwardRef<SVGSVGElement, MockupLinearLocationMinusIconProps>(
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
      <path d="M9.25 11h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.194 5.194 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z" stroke="currentColor" strokeWidth="1.5"></path>
    </svg>
  )
);

MockupLinearLocationMinusIcon.displayName = "MockupLinearLocationMinusIcon";
