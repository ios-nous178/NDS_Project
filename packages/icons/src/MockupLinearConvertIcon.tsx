import React from "react";

export interface MockupLinearConvertIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearConvertIcon = React.forwardRef<SVGSVGElement, MockupLinearConvertIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.005 21.984c5.511 0 9.98-4.468 9.98-9.979 0-5.511-4.468-9.98-9.98-9.98-5.511 0-9.98 4.469-9.98 9.98s4.469 9.98 9.98 9.98z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.137 4.022l8.163 8.183.02-4.54M17.863 19.978L9.7 11.805l-.02 4.531"></path>
    </svg>
  )
);

MockupLinearConvertIcon.displayName = "MockupLinearConvertIcon";
