import React from "react";

export interface MockupLinearFlag2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearFlag2Icon = React.forwardRef<SVGSVGElement, MockupLinearFlag2IconProps>(
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
      <path d="M6.45 2v20M6.95 4l8.1 3.5c3.3 1.4 3.3 3.8.2 5.4L6.95 17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearFlag2Icon.displayName = "MockupLinearFlag2Icon";
