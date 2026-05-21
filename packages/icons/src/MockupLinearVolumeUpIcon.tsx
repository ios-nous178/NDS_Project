import React from "react";

export interface MockupLinearVolumeUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearVolumeUpIcon = React.forwardRef<SVGSVGElement, MockupLinearVolumeUpIconProps>(
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
      <path d="M2 9.96v4.08c0 2.04 1.02 3.06 3.06 3.06h1.46c.38 0 .76.11 1.08.31l2.98 1.86c2.58 1.61 4.68.44 4.68-2.6V7.32c0-3.04-2.11-4.21-4.68-2.6L7.6 6.59c-.33.2-.7.31-1.08.31H5.06C3.02 6.9 2 7.92 2 9.96Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M18 12h4M20 14v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearVolumeUpIcon.displayName = "MockupLinearVolumeUpIcon";
