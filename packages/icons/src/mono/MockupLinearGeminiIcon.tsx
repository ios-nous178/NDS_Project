import React from "react";

export interface MockupLinearGeminiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGeminiIcon = React.forwardRef<SVGSVGElement, MockupLinearGeminiIconProps>(
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
      <path d="M2 2a19.45 19.45 0 0 0 20 0M2 22a19.45 19.45 0 0 1 20 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m5.3 3.58.13.24a17.627 17.627 0 0 1-.1 16.59M18.67 20.41a17.683 17.683 0 0 1-.1-16.59l.13-.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGeminiIcon.displayName = "MockupLinearGeminiIcon";
