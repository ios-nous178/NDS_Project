import React from "react";

export interface MockupBoldArrowDown2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldArrowDown2Icon = React.forwardRef<SVGSVGElement, MockupBoldArrowDown2IconProps>(
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
      <path fill="currentColor" d="M17.919 8.18H6.079c-.96 0-1.44 1.16-.76 1.84l5.18 5.18c.83.83 2.18.83 3.01 0l1.97-1.97 3.21-3.21c.67-.68.19-1.84-.77-1.84z"></path>
    </svg>
  )
);

MockupBoldArrowDown2Icon.displayName = "MockupBoldArrowDown2Icon";
