import React from "react";

export interface MockupLinearAlignLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearAlignLeftIcon = React.forwardRef<SVGSVGElement, MockupLinearAlignLeftIconProps>(
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
      <path d="M5.1 19.25h11.8c1.5 0 2.1-.64 2.1-2.23v-1.04c0-1.59-.6-2.23-2.1-2.23H5.1M5.1 5.25h6.8c1.5 0 2.1.64 2.1 2.23v1.04c0 1.59-.6 2.23-2.1 2.23H5.1M5 1.99v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearAlignLeftIcon.displayName = "MockupLinearAlignLeftIcon";
