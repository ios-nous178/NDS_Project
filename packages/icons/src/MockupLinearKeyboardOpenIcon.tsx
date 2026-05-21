import React from "react";

export interface MockupLinearKeyboardOpenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearKeyboardOpenIcon = React.forwardRef<SVGSVGElement, MockupLinearKeyboardOpenIconProps>(
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
      <path d="M7.26 2h9.47c.65 0 1.23.02 1.75.09C21.25 2.4 22 3.7 22 7.26v6.32c0 3.56-.75 4.86-3.52 5.17-.52.07-1.09.09-1.75.09H7.26c-.65 0-1.23-.02-1.75-.09-2.77-.31-3.52-1.61-3.52-5.17V7.26c0-3.56.75-4.86 3.52-5.17.52-.07 1.1-.09 1.75-.09ZM13.58 8.32h3.68M6.74 14.11h10.53M7 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.195 8.3h.009M10.495 8.3h.009" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearKeyboardOpenIcon.displayName = "MockupLinearKeyboardOpenIcon";
