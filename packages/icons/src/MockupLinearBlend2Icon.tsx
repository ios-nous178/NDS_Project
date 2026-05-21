import React from "react";

export interface MockupLinearBlend2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBlend2Icon = React.forwardRef<SVGSVGElement, MockupLinearBlend2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.97 8c0 3.87-3.13 7-7 7-.32 0-.63-.02-.93-.07A6.986 6.986 0 01.97 8c0-3.87 3.13-7 7-7 3.55 0 6.48 2.64 6.93 6.07.05.3.07.61.07.93z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.97 14c0 3.87-3.13 7-7 7-3.55 0-6.48-2.64-6.93-6.07.3.05.61.07.93.07 3.87 0 7-3.13 7-7 0-.32-.02-.63-.07-.93 3.43.45 6.07 3.38 6.07 6.93zM13.12 13.12l1.31 1.29M15.97 11l-1-1M10.97 16l-1-1"></path>
    </svg>
  )
);

MockupLinearBlend2Icon.displayName = "MockupLinearBlend2Icon";
