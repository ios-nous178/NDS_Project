import React from "react";

export interface MockupLinearFolderConnectionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearFolderConnectionIcon = React.forwardRef<SVGSVGElement, MockupLinearFolderConnectionIconProps>(
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
      <path d="M12 16v3M12 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21h-4M10 21H6" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M19 8.3v4.2c0 2.8-.7 3.5-3.5 3.5h-7C5.7 16 5 15.3 5 12.5v-7C5 2.7 5.7 2 8.5 2h1.05c1.05 0 1.28.31 1.68.84l1.05 1.4c.27.35.42.56 1.12.56h2.1c2.8 0 3.5.7 3.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
    </svg>
  )
);

MockupLinearFolderConnectionIcon.displayName = "MockupLinearFolderConnectionIcon";
