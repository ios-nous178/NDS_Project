import React from "react";

export interface MockupLinearHappyemojiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHappyemojiIcon = React.forwardRef<SVGSVGElement, MockupLinearHappyemojiIconProps>(
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
      <path d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.21 16A5.831 5.831 0 0 0 12 18.5c1.98 0 3.73-.99 4.79-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHappyemojiIcon.displayName = "MockupLinearHappyemojiIcon";
