import React from "react";

export interface MockupBoldHappyemojiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldHappyemojiIcon = React.forwardRef<SVGSVGElement, MockupBoldHappyemojiIconProps>(
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
      <path d="M11.97 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.47-10-10-10Zm5.43 14.43a6.576 6.576 0 0 1-5.4 2.82c-2.15 0-4.17-1.05-5.4-2.82a.742.742 0 0 1 .19-1.04c.34-.24.81-.15 1.04.19A5.098 5.098 0 0 0 12 17.76c1.66 0 3.22-.81 4.17-2.18.24-.34.7-.42 1.04-.19.35.23.43.7.19 1.04Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldHappyemojiIcon.displayName = "MockupBoldHappyemojiIcon";
