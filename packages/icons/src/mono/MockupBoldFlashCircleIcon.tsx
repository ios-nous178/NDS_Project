import React from "react";

export interface MockupBoldFlashCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldFlashCircleIcon = React.forwardRef<SVGSVGElement, MockupBoldFlashCircleIconProps>(
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
      <path d="M11.97 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.47-10-10-10Zm3.75 10.35L12 16.58l-.44.5c-.61.69-1.11.51-1.11-.42V12.7h-1.7c-.77 0-.98-.47-.47-1.05L12 7.42l.44-.5c.61-.69 1.11-.51 1.11.42v3.96h1.7c.77 0 .98.47.47 1.05Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldFlashCircleIcon.displayName = "MockupBoldFlashCircleIcon";
