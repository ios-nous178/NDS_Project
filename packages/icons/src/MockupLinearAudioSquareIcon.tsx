import React from "react";

export interface MockupLinearAudioSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearAudioSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearAudioSquareIconProps>(
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
      <path d="M22 15V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.62 17.3a2.12 2.12 0 1 0 0-4.24 2.12 2.12 0 0 0 0 4.24ZM11.74 15.18V7.77M13.13 6.77l2.34.78c.57.19 1.03.83 1.03 1.43v.62c0 .81-.63 1.26-1.39 1l-2.34-.78c-.57-.19-1.03-.83-1.03-1.43v-.62c0-.8.62-1.26 1.39-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearAudioSquareIcon.displayName = "MockupLinearAudioSquareIcon";
