import React from "react";

export interface CashwalkAdSoundMaxStrokeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkAdSoundMaxStrokeIcon = React.forwardRef<SVGSVGElement, CashwalkAdSoundMaxStrokeIconProps>(
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
<path d="M3.15835 13.9306C2.44534 12.7423 2.44534 11.2577 3.15835 10.0694C3.37593 9.7067 3.73638 9.45268 4.15107 9.36974L5.8441 9.03113C5.94496 9.01096 6.03588 8.95687 6.10173 8.87784L8.17082 6.39494C9.35337 4.97588 9.94465 4.26634 10.4723 4.45738C11 4.64842 11 5.57203 11 7.41924V16.5807C11 18.4279 11 19.3515 10.4723 19.5426C9.94465 19.7336 9.35337 19.0241 8.17082 17.605L6.10173 15.1221C6.03588 15.0431 5.94496 14.989 5.8441 14.9688L4.15107 14.6302C3.73638 14.5473 3.37593 14.2933 3.15835 13.9306Z" stroke="white" strokeWidth="1.5"/>
<path d="M15.5355 8.46436C16.4684 9.39721 16.9948 10.661 17 11.9802C17.0052 13.2995 16.4888 14.5673 15.5633 15.5075" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M19.6569 6.34326C21.1494 7.83584 21.9916 9.85781 21.9999 11.9686C22.0083 14.0794 21.182 16.1079 19.7012 17.6122" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

CashwalkAdSoundMaxStrokeIcon.displayName = "CashwalkAdSoundMaxStrokeIcon";
