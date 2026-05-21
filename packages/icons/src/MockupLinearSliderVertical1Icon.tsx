import React from "react";

export interface MockupLinearSliderVertical1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSliderVertical1Icon = React.forwardRef<SVGSVGElement, MockupLinearSliderVertical1IconProps>(
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
      <path d="M7.5 5h9c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v4c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-9c-.62 0-1.17-.02-1.66-.09C3.21 18.62 2.5 17.38 2.5 14v-4c0-3.38.71-4.62 3.34-4.91C6.33 5.02 6.88 5 7.5 5ZM4.5 2h15M5 22h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSliderVertical1Icon.displayName = "MockupLinearSliderVertical1Icon";
