import React from "react";

export interface MockupBoldConvertCardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldConvertCardIcon = React.forwardRef<SVGSVGElement, MockupBoldConvertCardIconProps>(
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
      <path d="M22 15c0 3.87-3.13 7-7 7l1.05-1.75M2 9c0-3.87 3.13-7 7-7L7.95 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 4.2v.11c0 .28-.22.5-.5.5h-9c-.28 0-.5-.22-.5-.5V4.2c0-1.76.44-2.2 2.22-2.2h5.56C21.56 2 22 2.44 22 4.2ZM12.5 5.809c-.28 0-.5.22-.5.5v1.99c0 1.76.44 2.2 2.22 2.2h5.56c1.78 0 2.22-.44 2.22-2.2v-1.99c0-.28-.22-.5-.5-.5h-9ZM12 15.7v.11c0 .28-.22.5-.5.5h-9c-.28 0-.5-.22-.5-.5v-.11c0-1.76.44-2.2 2.22-2.2h5.56c1.78 0 2.22.44 2.22 2.2ZM2.5 17.309c-.28 0-.5.22-.5.5v1.99c0 1.76.44 2.2 2.22 2.2h5.56c1.78 0 2.22-.44 2.22-2.2v-1.99c0-.28-.22-.5-.5-.5h-9Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldConvertCardIcon.displayName = "MockupBoldConvertCardIcon";
