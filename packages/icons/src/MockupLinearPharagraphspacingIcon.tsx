import React from "react";

export interface MockupLinearPharagraphspacingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPharagraphspacingIcon = React.forwardRef<SVGSVGElement, MockupLinearPharagraphspacingIconProps>(
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
      <path d="M3 22h18M3 2h18M12 6v12M14.83 7.72 12 4.89 9.17 7.72M14.83 15.89 12 18.72l-2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearPharagraphspacingIcon.displayName = "MockupLinearPharagraphspacingIcon";
