import React from "react";

export interface TrostMkMypageActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkMypageActiveIcon = React.forwardRef<SVGSVGElement, TrostMkMypageActiveIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5 21.375V19.2321C19.5 16.8652 17.7091 14.9464 15.5 14.9464H8.5C6.29086 14.9464 4.5 16.8652 4.5 19.2321V21.375H19.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M12 11.5179C14.2486 11.5179 16.0714 9.69502 16.0714 7.44643C16.0714 5.19784 14.2486 3.375 12 3.375C9.75141 3.375 7.92857 5.19784 7.92857 7.44643C7.92857 9.69502 9.75141 11.5179 12 11.5179Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
);

TrostMkMypageActiveIcon.displayName = "TrostMkMypageActiveIcon";
