import React from "react";

export interface MockupBoldChart1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldChart1Icon = React.forwardRef<SVGSVGElement, MockupBoldChart1IconProps>(
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
      <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.38C2 19.83 4.17 22 7.81 22h8.38c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM7.75 13.6c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.2c0-.41.34-.75.75-.75s.75.34.75.75v3.2Zm5 1.74c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8.66c0-.41.34-.75.75-.75s.75.34.75.75v6.68Zm5-1.74c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.2c0-.41.34-.75.75-.75s.75.34.75.75v3.2Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldChart1Icon.displayName = "MockupBoldChart1Icon";
