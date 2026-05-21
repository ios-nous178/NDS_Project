import React from "react";

export interface MockupBoldGrid9IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldGrid9Icon = React.forwardRef<SVGSVGElement, MockupBoldGrid9IconProps>(
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
      <path d="M22 7.81v8.38c0 3.64-2.17 5.81-5.81 5.81h-3.44V2h3.44C19.83 2 22 4.17 22 7.81ZM11.25 2v20H7.81C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2h3.44Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldGrid9Icon.displayName = "MockupBoldGrid9Icon";
