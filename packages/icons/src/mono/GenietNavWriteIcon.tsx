import React from "react";

export interface GenietNavWriteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietNavWriteIcon = React.forwardRef<SVGSVGElement, GenietNavWriteIconProps>(
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
      <path fill="currentColor" fillRule="evenodd" d="m8.12 19.806-2.99.65a.994.994 0 0 1-1.177-1.21l.718-2.9a2.14 2.14 0 0 1 .56-.995l10.66-10.72a2.138 2.138 0 0 1 3.024-.009l.89.886c.84.833.842 2.187.01 3.024L9.182 19.224a2.13 2.13 0 0 1-1.062.582Z" clipRule="evenodd"/>
  <path fill="currentColor" d="M19.62 18.738a.92.92 0 1 1 0 1.842h-8.015a.921.921 0 0 1 0-1.842h8.015Z"/>
    </svg>
  )
);

GenietNavWriteIcon.displayName = "GenietNavWriteIcon";
