import React from "react";

export interface GenietShareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietShareIcon = React.forwardRef<SVGSVGElement, GenietShareIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="515.79 605.29 21.43 21.43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="stroke">
<circle id="Oval" cx="532" cy="609.5" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<circle id="Oval_2" cx="521" cy="616" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<circle id="Oval_3" cx="532" cy="622.5" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path" d="M523.5 617L529.5 621" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path_2" d="M529.5 611L523.5 615" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<g id="ic_share">
<circle id="Oval_4" cx="532" cy="609.5" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<circle id="Oval_5" cx="521" cy="616" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<circle id="Oval_6" cx="532" cy="622.5" r="2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path_3" d="M523.5 617L529.5 621" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path_4" d="M529.5 611L523.5 615" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
</g>
    </svg>
  )
);

GenietShareIcon.displayName = "GenietShareIcon";
