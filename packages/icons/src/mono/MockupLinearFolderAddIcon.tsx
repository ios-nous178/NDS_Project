import React from "react";

export interface MockupLinearFolderAddIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearFolderAddIcon = React.forwardRef<SVGSVGElement, MockupLinearFolderAddIconProps>(
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
      <path d="M12.06 16.5v-5M14.5 14h-5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
    </svg>
  )
);

MockupLinearFolderAddIcon.displayName = "MockupLinearFolderAddIcon";
