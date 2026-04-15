import React from "react";

export interface EyeOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const EyeOffIcon = React.forwardRef<SVGSVGElement, EyeOffIconProps>(
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
      <g transform="translate(0, 3)">
    <path fillRule="evenodd" clipRule="evenodd" d="M0.156796 8.93661C-0.0522653 9.29924 -0.0522653 9.74743 0.156796 10.1101C1.13231 11.8068 2.42448 13.2384 3.94195 14.3485L2.30912 15.9984C2.08973 16.2174 1.96625 16.516 1.96625 16.8276C1.96625 17.1392 2.08973 17.4378 2.30912 17.6568C2.76253 18.1144 3.49706 18.1144 3.95046 17.6568L19.4557 1.98908C20.48 0.900126 18.8557 -0.72313 17.7912 0.354086L15.6388 2.53121C9.77336 0.79921 3.16154 3.5654 0.156022 8.9374L0.156796 8.93661ZM20.0661 4.69033L16.4513 8.34286C16.5798 8.82005 16.6347 9.35201 16.5906 9.8605C16.4381 12.7057 13.5402 14.7944 10.8312 14.0207L8.35371 16.5241C14.2385 18.2271 20.8279 15.4977 23.8435 10.1101C24.0525 9.7502 24.0525 9.29647 23.8435 8.93661C22.8804 7.23356 21.5843 5.8403 20.0661 4.68955V4.69033ZM7.5485 10.7046L13.1693 5.02518C10.3187 4.21551 7.3503 6.52718 7.39443 9.52336C7.39443 9.93015 7.44863 10.3291 7.5485 10.7046Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

EyeOffIcon.displayName = "EyeOffIcon";
