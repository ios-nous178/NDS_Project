import React from "react";

export interface MockupLinearScrollIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearScrollIcon = React.forwardRef<SVGSVGElement, MockupLinearScrollIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m9.6 8.97-2.49 2.49c-.29.29-.29.78 0 1.07l2.49 2.49M14.4 8.97l2.49 2.49c.29.29.29.78 0 1.07l-2.49 2.49" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearScrollIcon.displayName = "MockupLinearScrollIcon";
