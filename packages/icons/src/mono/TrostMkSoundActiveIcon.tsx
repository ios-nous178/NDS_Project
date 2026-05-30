import React from "react";

export interface TrostMkSoundActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkSoundActiveIcon = React.forwardRef<SVGSVGElement, TrostMkSoundActiveIconProps>(
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
      <path d="M8 15.5C8 14.1193 6.88071 13 5.5 13C4.11929 13 3 14.1193 3 15.5V18.5C3 19.8807 4.11929 21 5.5 21C6.88071 21 8 19.8807 8 18.5V15.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M21 15.5C21 14.1193 19.8807 13 18.5 13C17.1193 13 16 14.1193 16 15.5V18.5C16 19.8807 17.1193 21 18.5 21C19.8807 21 21 19.8807 21 18.5V15.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M21 17V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12V17" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
);

TrostMkSoundActiveIcon.displayName = "TrostMkSoundActiveIcon";
