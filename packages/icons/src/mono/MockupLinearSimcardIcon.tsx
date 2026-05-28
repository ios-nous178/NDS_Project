import React from "react";

export interface MockupLinearSimcardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSimcardIcon = React.forwardRef<SVGSVGElement, MockupLinearSimcardIconProps>(
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
      <path d="m19.54 6.54-3.07-3.07a4.994 4.994 0 0 0-3.54-1.46H8c-3 0-5 2-5 5v10c0 3 2 5 5 5h8c3 0 5-2 5-5v-6.93a5 5 0 0 0-1.46-3.54Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m9.5 14-2 2 2 2M14.5 14l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSimcardIcon.displayName = "MockupLinearSimcardIcon";
