import React from "react";

export interface MockupLinearEmojiNormalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearEmojiNormalIcon = React.forwardRef<SVGSVGElement, MockupLinearEmojiNormalIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7 8.25c1 1 2.63 1 3.64 0M13.36 8.25c1 1 2.63 1 3.64 0M8.4 13h7.2c.5 0 .9.4.9.9 0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5c0-.5.4-.9.9-.9Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearEmojiNormalIcon.displayName = "MockupLinearEmojiNormalIcon";
