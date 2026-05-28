import React from "react";

export interface MockupBoldMessageMinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldMessageMinusIcon = React.forwardRef<SVGSVGElement, MockupBoldMessageMinusIconProps>(
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
      <path d="M16 2H8C4 2 2 4 2 8v13c0 .55.45 1 1 1h13c4 0 6-2 6-6V8c0-4-2-6-6-6Zm-.5 10.75h-7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h7c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldMessageMinusIcon.displayName = "MockupBoldMessageMinusIcon";
