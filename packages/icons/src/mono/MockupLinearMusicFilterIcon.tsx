import React from "react";

export interface MockupLinearMusicFilterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMusicFilterIcon = React.forwardRef<SVGSVGElement, MockupLinearMusicFilterIconProps>(
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
      <path d="M2 3h20M2 9h9M2 15h6M2 21h4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.84 22a2.18 2.18 0 1 0 0-4.36 2.18 2.18 0 0 0 0 4.36Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 18.37V9.86c0-1.81-1.14-2.06-2.29-1.75L15.36 9.3c-.79.22-1.34.84-1.34 1.75v8.77" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M19.82 20.55a2.18 2.18 0 1 0 0-4.36 2.18 2.18 0 0 0 0 4.36ZM14.02 13.6 22 11.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMusicFilterIcon.displayName = "MockupLinearMusicFilterIcon";
