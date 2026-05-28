import React from "react";

export interface MockupLinearRepeateOneIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRepeateOneIcon = React.forwardRef<SVGSVGElement, MockupLinearRepeateOneIconProps>(
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
      <path d="m14 3 2.44 2.34-7.95-.02c-3.57 0-6.5 2.93-6.5 6.52 0 1.79.73 3.42 1.91 4.6M10 21l-2.44-2.34 7.95.02c3.57 0 6.5-2.93 6.5-6.52 0-1.79-.73-3.42-1.91-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.25 14.67V9.33L10.75 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearRepeateOneIcon.displayName = "MockupLinearRepeateOneIcon";
