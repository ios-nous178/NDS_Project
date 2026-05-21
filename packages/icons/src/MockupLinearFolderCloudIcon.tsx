import React from "react";

export interface MockupLinearFolderCloudIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearFolderCloudIcon = React.forwardRef<SVGSVGElement, MockupLinearFolderCloudIconProps>(
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
      <path d="M9 22H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5v2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.76 18.32c-2.35.17-2.35 3.57 0 3.74h5.56c.67 0 1.33-.25 1.82-.7 1.65-1.44.77-4.32-1.4-4.59-.78-4.69-7.56-2.91-5.96 1.56" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearFolderCloudIcon.displayName = "MockupLinearFolderCloudIcon";
