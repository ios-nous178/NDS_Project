import React from "react";

export interface MockupBoldRecordCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldRecordCircleIcon = React.forwardRef<SVGSVGElement, MockupBoldRecordCircleIconProps>(
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
      <path d="M11.969 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.47-10-10-10Zm.03 14.23c-2.34 0-4.23-1.89-4.23-4.23 0-2.34 1.89-4.23 4.23-4.23 2.34 0 4.23 1.89 4.23 4.23 0 2.34-1.89 4.23-4.23 4.23Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldRecordCircleIcon.displayName = "MockupBoldRecordCircleIcon";
