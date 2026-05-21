import React from "react";

export interface MockupBoldSliderHorizontal1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldSliderHorizontal1Icon = React.forwardRef<SVGSVGElement, MockupBoldSliderHorizontal1IconProps>(
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
      <path d="M3.5 5.059v13.88c0 .41-.34.75-.75.75s-.75-.34-.75-.75V5.059c0-.41.34-.75.75-.75s.75.34.75.75ZM22 5.059v13.88c0 .41-.34.75-.75.75s-.75-.34-.75-.75V5.059c0-.41.34-.75.75-.75s.75.34.75.75ZM8 21.25h8c1.66 0 3-1.34 3-3V5.75c0-1.66-1.34-3-3-3H8c-1.66 0-3 1.34-3 3v12.5c0 1.66 1.34 3 3 3Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldSliderHorizontal1Icon.displayName = "MockupBoldSliderHorizontal1Icon";
