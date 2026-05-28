import React from "react";

export interface MockupBoldGrid2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldGrid2Icon = React.forwardRef<SVGSVGElement, MockupBoldGrid2IconProps>(
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
      <path d="M11.25 12.75V22H7.81C4.17 22 2 19.83 2 16.19v-3.44h9.25ZM22 7.81v3.44h-9.25V2h3.44C19.83 2 22 4.17 22 7.81ZM11.25 2v9.25H2V7.81C2 4.17 4.17 2 7.81 2h3.44ZM22 12.75v3.44c0 3.64-2.17 5.81-5.81 5.81h-3.44v-9.25H22Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldGrid2Icon.displayName = "MockupBoldGrid2Icon";
