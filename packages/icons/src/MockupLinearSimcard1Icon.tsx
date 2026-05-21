import React from "react";

export interface MockupLinearSimcard1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSimcard1Icon = React.forwardRef<SVGSVGElement, MockupLinearSimcard1IconProps>(
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
      <path d="m19.54 6.54-3.07-3.07A5.003 5.003 0 0 0 12.93 2H8C5 2 3 4 3 7v10c0 3 2 5 5 5h8c3 0 5-2 5-5v-6.93c0-1.33-.53-2.6-1.46-3.53Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10 18.5h4c1.65 0 3-1.35 3-3v-3c0-1.65-1.35-3-3-3h-4c-1.65 0-3 1.35-3 3v3c0 1.65 1.35 3 3 3ZM12 9.5v9M7.5 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSimcard1Icon.displayName = "MockupLinearSimcard1Icon";
