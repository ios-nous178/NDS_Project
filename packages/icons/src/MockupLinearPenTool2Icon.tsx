import React from "react";

export interface MockupLinearPenTool2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPenTool2Icon = React.forwardRef<SVGSVGElement, MockupLinearPenTool2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.75 22.5h2.52c.96 0 1.58-.68 1.4-1.51l-.41-1.81h-4.5l-.41 1.81c-.18.78.5 1.51 1.4 1.51zM14.26 19.17l1.73-1.54c.97-.86 1.01-1.46.24-2.43l-3.05-3.87c-.64-.81-1.69-.81-2.33 0L7.8 15.2c-.77.97-.77 1.6.24 2.43l1.73 1.54M12.01 11.12v2.53"></path><g><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.52 5h-1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM3.27 14.17h1c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1zM20.73 14.17h-1c-.55 0-1-.45-1-1v-1c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM10.52 3.56c-3.81.45-6.77 3.68-6.77 7.61M20.25 11.17c0-3.92-2.94-7.14-6.73-7.61"></path></g>
    </svg>
  )
);

MockupLinearPenTool2Icon.displayName = "MockupLinearPenTool2Icon";
