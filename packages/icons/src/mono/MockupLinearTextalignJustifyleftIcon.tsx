import React from "react";

export interface MockupLinearTextalignJustifyleftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTextalignJustifyleftIcon = React.forwardRef<SVGSVGElement, MockupLinearTextalignJustifyleftIconProps>(
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
      <path d="M12 4.5H3M12 9.5H3M21 14.5H3M21 19.5H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearTextalignJustifyleftIcon.displayName = "MockupLinearTextalignJustifyleftIcon";
