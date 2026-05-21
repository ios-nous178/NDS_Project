import React from "react";

export interface MockupLinearProfileRemoveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearProfileRemoveIcon = React.forwardRef<SVGSVGElement, MockupLinearProfileRemoveIconProps>(
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
      <path d="M19.5 19h-4M12.15 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.55 3.99 9.53 2 11.99 2a4.435 4.435 0 0 1 .16 8.87ZM11.99 21.81c-1.82 0-3.63-.46-5.01-1.38-2.42-1.62-2.42-4.26 0-5.87 2.75-1.84 7.26-1.84 10.01 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearProfileRemoveIcon.displayName = "MockupLinearProfileRemoveIcon";
