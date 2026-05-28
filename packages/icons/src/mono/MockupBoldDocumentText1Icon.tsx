import React from "react";

export interface MockupBoldDocumentText1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldDocumentText1Icon = React.forwardRef<SVGSVGElement, MockupBoldDocumentText1IconProps>(
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
      <path d="M16 2H8C4.5 2 3 4 3 7v10c0 3 1.5 5 5 5h8c3.5 0 5-2 5-5V7c0-3-1.5-5-5-5ZM8 12.25h4c.41 0 .75.34.75.75s-.34.75-.75.75H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75Zm8 5.5H8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75Zm2.5-8.5h-2c-1.52 0-2.75-1.23-2.75-2.75v-2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .69.56 1.25 1.25 1.25h2c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldDocumentText1Icon.displayName = "MockupBoldDocumentText1Icon";
