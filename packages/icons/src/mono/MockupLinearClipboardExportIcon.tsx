import React from "react";

export interface MockupLinearClipboardExportIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearClipboardExportIcon = React.forwardRef<SVGSVGElement, MockupLinearClipboardExportIconProps>(
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
      <path d="M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14 22H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98M16 4.02c3.33.18 5 1.41 5 5.98v5M15 19v-3h3M21 22l-5.96-5.96" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearClipboardExportIcon.displayName = "MockupLinearClipboardExportIcon";
