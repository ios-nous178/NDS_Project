import React from "react";

export interface ChallengeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ChallengeIcon = React.forwardRef<SVGSVGElement, ChallengeIconProps>(
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
      <path d="M7 3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22C6.55228 22 7 21.5523 7 21V3Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M6 4H18.0586C18.9435 4 19.6608 4.71734 19.6608 5.60222C19.6608 6.03448 19.4861 6.4484 19.1765 6.75L17.0885 8.78363C16.6928 9.16897 16.6845 9.80208 17.0698 10.1977C17.0759 10.204 17.0822 10.2102 17.0885 10.2164L19.1765 12.25C19.8104 12.8674 19.8238 13.8818 19.2064 14.5157C18.9048 14.8253 18.4908 15 18.0586 15H6V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
);

ChallengeIcon.displayName = "ChallengeIcon";
