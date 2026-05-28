import React from "react";

export interface MockupBoldTextalignJustifycenterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldTextalignJustifycenterIcon = React.forwardRef<SVGSVGElement, MockupBoldTextalignJustifycenterIconProps>(
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
      <path d="M21 5.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 10.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 15.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75ZM21 20.25H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldTextalignJustifycenterIcon.displayName = "MockupBoldTextalignJustifycenterIcon";
