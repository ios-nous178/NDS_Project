import React from "react";

export interface MockupLinearNoteAddIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearNoteAddIcon = React.forwardRef<SVGSVGElement, MockupLinearNoteAddIconProps>(
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
      <path d="M9.56 18v-5M12 15.5H7M8 2v3M16 2v3M15.81 3.42c3.34.12 5.03 1.35 5.13 6.05l.13 6.17c.08 4.12-.87 6.19-5.87 6.3l-6 .12c-5 .1-6.04-1.94-6.12-6.05l-.14-6.18c-.1-4.7 1.55-6 4.87-6.25l8-.16Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearNoteAddIcon.displayName = "MockupLinearNoteAddIcon";
