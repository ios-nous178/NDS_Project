import React from "react";

export interface MockupLinearSliderHorizontal1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSliderHorizontal1Icon = React.forwardRef<SVGSVGElement, MockupLinearSliderHorizontal1IconProps>(
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
      <path d="M5 16.5v-9c0-.62.02-1.17.09-1.66C5.38 3.21 6.62 2.5 10 2.5h4c3.38 0 4.62.71 4.91 3.34.07.49.09 1.04.09 1.66v9c0 .62-.02 1.17-.09 1.66-.29 2.63-1.53 3.34-4.91 3.34h-4c-3.38 0-4.62-.71-4.91-3.34-.07-.49-.09-1.04-.09-1.66ZM2 19.5v-15M22 19V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSliderHorizontal1Icon.displayName = "MockupLinearSliderHorizontal1Icon";
