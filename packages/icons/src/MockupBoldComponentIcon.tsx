import React from "react";

export interface MockupBoldComponentIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldComponentIcon = React.forwardRef<SVGSVGElement, MockupBoldComponentIconProps>(
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
      <path d="m20.95 14.55-6.39 6.39c-1.4 1.4-3.7 1.4-5.11 0l-6.39-6.39c-1.4-1.4-1.4-3.7 0-5.11l6.39-6.39c1.4-1.4 3.7-1.4 5.11 0l6.39 6.39c1.4 1.41 1.4 3.71 0 5.11Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldComponentIcon.displayName = "MockupBoldComponentIcon";
