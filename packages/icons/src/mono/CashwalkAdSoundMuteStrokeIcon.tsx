import React from "react";

export interface CashwalkAdSoundMuteStrokeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkAdSoundMuteStrokeIcon = React.forwardRef<SVGSVGElement, CashwalkAdSoundMuteStrokeIconProps>(
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
      <path d="M3.15835 13.9306C2.44534 12.7423 2.44534 11.2577 3.15835 10.0694C3.37593 9.7067 3.73638 9.45268 4.15107 9.36974L5.8441 9.03113C5.94496 9.01096 6.03588 8.95687 6.10173 8.87784L8.17082 6.39494C9.35337 4.97588 9.94465 4.26634 10.4723 4.45738C11 4.64842 11 5.57203 11 7.41924V16.5807C11 18.4279 11 19.3515 10.4723 19.5426C9.94465 19.7336 9.35337 19.0241 8.17082 17.605L6.10173 15.1221C6.03588 15.0431 5.94496 14.989 5.8441 14.9688L4.15107 14.6302C3.73638 14.5473 3.37593 14.2933 3.15835 13.9306Z" fill="white" fill-opacity="0.4" stroke="white" strokeWidth="1.5"/>
<path d="M3.15841 13.9306C2.4454 12.7423 2.4454 11.2577 3.15841 10.0694C3.37599 9.7067 3.73644 9.45268 4.15113 9.36974L5.84416 9.03113C5.94502 9.01096 6.03594 8.95687 6.10179 8.87784L8.17088 6.39494C9.35343 4.97588 9.94471 4.26634 10.4723 4.45738C11 4.64842 11 5.57203 11 7.41924V16.5807C11 18.4279 11 19.3515 10.4723 19.5426C9.94471 19.7336 9.35343 19.0241 8.17088 17.605L6.10179 15.1221C6.03594 15.0431 5.94502 14.989 5.84416 14.9688L4.15113 14.6302C3.73644 14.5473 3.37599 14.2933 3.15841 13.9306Z" stroke="white" strokeWidth="1.5"/>
<path d="M15 15L21 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M21 15L15 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

CashwalkAdSoundMuteStrokeIcon.displayName = "CashwalkAdSoundMuteStrokeIcon";
