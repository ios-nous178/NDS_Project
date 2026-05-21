import React from "react";

export interface MockupBoldRadioIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldRadioIcon = React.forwardRef<SVGSVGElement, MockupBoldRadioIconProps>(
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
      <path d="M7.75 2v3H7c-.26 0-.51.01-.75.05V2c0-.41.34-.75.75-.75s.75.34.75.75Z" fill="currentColor"></path><path d="M17 5H7c-.26 0-.51.01-.75.05C3.67 5.35 2 7.26 2 10v7c0 3 2 5 5 5h10c3 0 5-2 5-5v-7c0-3-2-5-5-5ZM7.88 16a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Zm6.5.25h-.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h.5c.41 0 .75.34.75.75s-.34.75-.75.75Zm3.5 0h-.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h.5c.41 0 .75.34.75.75s-.34.75-.75.75Zm0-4h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldRadioIcon.displayName = "MockupBoldRadioIcon";
