import React from "react";

export interface MockupBoldGrid4IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldGrid4Icon = React.forwardRef<SVGSVGElement, MockupBoldGrid4IconProps>(
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
      <path d="M22 7.81v8.38c0 3.64-2.17 5.81-5.81 5.81H9.75V2h6.44C19.83 2 22 4.17 22 7.81ZM8.25 2v20h-.44C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2h.44Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldGrid4Icon.displayName = "MockupBoldGrid4Icon";
