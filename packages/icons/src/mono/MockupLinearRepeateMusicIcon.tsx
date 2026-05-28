import React from "react";

export interface MockupLinearRepeateMusicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRepeateMusicIcon = React.forwardRef<SVGSVGElement, MockupLinearRepeateMusicIconProps>(
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
      <path d="m14 3 2.44 2.34-7.95-.02c-3.57 0-6.5 2.93-6.5 6.52 0 1.79.73 3.42 1.91 4.6M10 21l-2.44-2.34 7.95.02c3.57 0 6.5-2.93 6.5-6.52 0-1.79-.73-3.42-1.91-4.6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearRepeateMusicIcon.displayName = "MockupLinearRepeateMusicIcon";
