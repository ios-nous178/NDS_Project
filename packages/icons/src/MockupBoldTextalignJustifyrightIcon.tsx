import React from "react";

export interface MockupBoldTextalignJustifyrightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldTextalignJustifyrightIcon = React.forwardRef<SVGSVGElement, MockupBoldTextalignJustifyrightIconProps>(
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
      <path d="M21 5.25h-9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h9c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 10.25h-9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h9c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 15.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 20.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldTextalignJustifyrightIcon.displayName = "MockupBoldTextalignJustifyrightIcon";
