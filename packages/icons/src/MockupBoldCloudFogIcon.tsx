import React from "react";

export interface MockupBoldCloudFogIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldCloudFogIcon = React.forwardRef<SVGSVGElement, MockupBoldCloudFogIconProps>(
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
      <path d="M19.801 12.001h-15.6c-.22 0-.42-.15-.49-.36-2.75-9.09 11.13-12.58 12.74-2.82 1.66.21 2.97 1.15 3.78 2.41.21.33-.04.77-.43.77ZM20 15.781H4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h16c.41 0 .75.34.75.75s-.34.75-.75.75ZM18 18.781H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h12c.41 0 .75.34.75.75s-.34.75-.75.75ZM15 21.781H9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldCloudFogIcon.displayName = "MockupBoldCloudFogIcon";
