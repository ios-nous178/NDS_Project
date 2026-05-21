import React from "react";

export interface MockupBoldReceiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldReceiveIcon = React.forwardRef<SVGSVGElement, MockupBoldReceiveIconProps>(
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
      <path fill="currentColor" d="M4.71 18.191c.1.04.19.06.29.06h10.27c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H6.81l12.72-12.72c.29-.29.29-.77 0-1.06a.754.754 0 00-1.06 0L5.75 15.691v-8.46c0-.41-.34-.75-.75-.75s-.75.34-.75.75v10.27c0 .1.02.19.06.29.07.18.22.33.4.4zM20.5 21.25h-17c-.41 0-.75.34-.75.75s.34.75.75.75h17c.41 0 .75-.34.75-.75s-.34-.75-.75-.75z"></path>
    </svg>
  )
);

MockupBoldReceiveIcon.displayName = "MockupBoldReceiveIcon";
