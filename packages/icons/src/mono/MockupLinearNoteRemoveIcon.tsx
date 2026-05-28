import React from "react";

export interface MockupLinearNoteRemoveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearNoteRemoveIcon = React.forwardRef<SVGSVGElement, MockupLinearNoteRemoveIconProps>(
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
      <path d="M7 14h5M7 5.96 3.25 2.21M6.96 2.25 3.21 6M7 10h8M10 2h6c3.33.18 5 1.41 5 5.99V16M3 9.01v6.97C3 19.99 4 22 9 22h6" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="m21 16-6 6v-3c0-2 1-3 3-3h3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearNoteRemoveIcon.displayName = "MockupLinearNoteRemoveIcon";
