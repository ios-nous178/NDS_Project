import React from "react";

export interface MockupLinearMouseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMouseIcon = React.forwardRef<SVGSVGElement, MockupLinearMouseIconProps>(
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
      <path d="M12 22c4.13 0 7.5-3.37 7.5-7.5v-5C19.5 5.37 16.13 2 12 2S4.5 5.37 4.5 9.5v5c0 4.13 3.37 7.5 7.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 11c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5.82 0 1.5.67 1.5 1.5v2c0 .83-.68 1.5-1.5 1.5ZM12 6V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMouseIcon.displayName = "MockupLinearMouseIcon";
