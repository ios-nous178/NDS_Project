import React from "react";

export interface MockupLinearNoteSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearNoteSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearNoteSquareIconProps>(
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
      <path d="M22 10V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.51 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.51 20v-6.99M18.82 12.07l2.21.74c.53.18.97.78.97 1.35v.59c0 .76-.59 1.19-1.31.95l-2.21-.74c-.53-.18-.97-.78-.97-1.35v-.59c0-.77.59-1.19 1.31-.95Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearNoteSquareIcon.displayName = "MockupLinearNoteSquareIcon";
