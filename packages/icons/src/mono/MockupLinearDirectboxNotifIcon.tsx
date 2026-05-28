import React from "react";

export interface MockupLinearDirectboxNotifIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDirectboxNotifIcon = React.forwardRef<SVGSVGElement, MockupLinearDirectboxNotifIconProps>(
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
      <path d="M7 12c-4 0-4 1.79-4 4v1c0 2.76 0 5 5 5h8c4 0 5-2.24 5-5v-1c0-2.21 0-4-4-4-1 0-1.28.21-1.8.6l-1.02 1.08a2.999 2.999 0 0 1-4.37 0L8.8 12.6C8.28 12.21 8 12 7 12ZM19 12V6c0-2.21 0-4-4-4H9C5 2 5 3.79 5 6v6" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.55 9.23h3.33M9.72 6.23h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDirectboxNotifIcon.displayName = "MockupLinearDirectboxNotifIcon";
