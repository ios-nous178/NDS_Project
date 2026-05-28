import React from "react";

export interface MockupLinearSubtitleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSubtitleIcon = React.forwardRef<SVGSVGElement, MockupLinearSubtitleIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM17.5 17.08h-1.85M12.97 17.08H6.5M17.5 13.32h-5.53M9.27 13.32H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSubtitleIcon.displayName = "MockupLinearSubtitleIcon";
