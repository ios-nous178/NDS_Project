import React from "react";

export interface MockupBoldSliderVertical1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldSliderVertical1Icon = React.forwardRef<SVGSVGElement, MockupBoldSliderVertical1IconProps>(
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
      <path d="M18.94 3.5H5.06c-.41 0-.75-.34-.75-.75S4.65 2 5.06 2h13.88c.41 0 .75.34.75.75s-.34.75-.75.75ZM18.94 22H5.06c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h13.88c.41 0 .75.34.75.75s-.34.75-.75.75ZM2.75 8v8c0 1.66 1.34 3 3 3h12.5c1.66 0 3-1.34 3-3V8c0-1.66-1.34-3-3-3H5.75c-1.66 0-3 1.34-3 3Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldSliderVertical1Icon.displayName = "MockupBoldSliderVertical1Icon";
