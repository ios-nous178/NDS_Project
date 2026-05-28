import React from "react";

export interface MockupLinearPathTool2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPathTool2Icon = React.forwardRef<SVGSVGElement, MockupLinearPathTool2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.87 22h4.29c1.62 0 2.69-1.16 2.37-2.57l-.69-3.08H8.2l-.69 3.08C7.2 20.76 8.34 22 9.87 22zM15.83 16.35l2.94-2.61c1.64-1.46 1.71-2.48.41-4.13l-5.19-6.58c-1.09-1.38-2.87-1.38-3.97 0L4.84 9.61c-1.3 1.65-1.3 2.72.41 4.13l2.94 2.61M12.01 2.67v4.3"></path>
    </svg>
  )
);

MockupLinearPathTool2Icon.displayName = "MockupLinearPathTool2Icon";
