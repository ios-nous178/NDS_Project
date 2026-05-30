import React from "react";

export interface TrostMkSoundIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkSoundIcon = React.forwardRef<SVGSVGElement, TrostMkSoundIconProps>(
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
      <rect x="3" y="13" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
  <rect x="16" y="13" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
  <path d="M21 17V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12V17" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
);

TrostMkSoundIcon.displayName = "TrostMkSoundIcon";
