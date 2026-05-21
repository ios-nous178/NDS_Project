import React from "react";

export interface MockupLinearArrowCircleUp2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowCircleUp2Icon = React.forwardRef<SVGSVGElement, MockupLinearArrowCircleUp2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 15.5v-6"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 11.5l3-3 3 3"></path>
    </svg>
  )
);

MockupLinearArrowCircleUp2Icon.displayName = "MockupLinearArrowCircleUp2Icon";
