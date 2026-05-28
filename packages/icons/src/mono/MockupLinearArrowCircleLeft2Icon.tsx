import React from "react";

export interface MockupLinearArrowCircleLeft2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowCircleLeft2Icon = React.forwardRef<SVGSVGElement, MockupLinearArrowCircleLeft2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15.5 12h-6"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.5 9l-3 3 3 3"></path>
    </svg>
  )
);

MockupLinearArrowCircleLeft2Icon.displayName = "MockupLinearArrowCircleLeft2Icon";
