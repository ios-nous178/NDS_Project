import React from "react";

export interface MockupBoldGrid6IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldGrid6Icon = React.forwardRef<SVGSVGElement, MockupBoldGrid6IconProps>(
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
      <path d="M22 7.75H9.75v-5.8h6.44c3.64 0 5.81 2.17 5.81 5.8ZM22 16.25c-.05 3.57-2.21 5.7-5.81 5.7H9.75v-5.7H22ZM8.25 1.95v20h-.44C4.17 21.95 2 19.78 2 16.14V7.76c0-3.64 2.17-5.81 5.81-5.81h.44ZM22 9.25H9.75v5.5H22v-5.5Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldGrid6Icon.displayName = "MockupBoldGrid6Icon";
