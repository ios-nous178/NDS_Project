import React from "react";

export interface MockupLinearGemini2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGemini2Icon = React.forwardRef<SVGSVGElement, MockupLinearGemini2IconProps>(
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
      <path d="M12 22V3M15.3 5.3 12 2 8.7 5.3M5 7 3 5 1 7M23 7l-2-2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 6.04V11c0 4 2 6 6 6h6c4 0 6-2 6-6V6.04M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGemini2Icon.displayName = "MockupLinearGemini2Icon";
