import React from "react";

export interface MockupBoldTimer1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldTimer1Icon = React.forwardRef<SVGSVGElement, MockupBoldTimer1IconProps>(
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
      <path d="M12 4.648c-4.78 0-8.67 3.89-8.67 8.67 0 4.78 3.89 8.68 8.67 8.68 4.78 0 8.67-3.89 8.67-8.67 0-4.78-3.89-8.68-8.67-8.68Zm.75 8.35c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-5c0-.41.34-.75.75-.75s.75.34.75.75v5ZM14.89 3.45H9.11c-.4 0-.72-.32-.72-.72 0-.4.32-.73.72-.73h5.78c.4 0 .72.32.72.72 0 .4-.32.73-.72.73Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldTimer1Icon.displayName = "MockupBoldTimer1Icon";
