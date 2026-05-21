import React from "react";

export interface MockupBoldUserIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldUserIcon = React.forwardRef<SVGSVGElement, MockupBoldUserIconProps>(
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
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldUserIcon.displayName = "MockupBoldUserIcon";
