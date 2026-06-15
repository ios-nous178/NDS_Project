import React from "react";

export interface GenietVideoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietVideoIcon = React.forwardRef<SVGSVGElement, GenietVideoIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0.10 0.10 23.81 23.81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g clipPath="url(#clip0_3062_8865)">
<g filter="url(#filter0_d_3062_8865)">
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM9.75 7.75217C9.21744 7.75217 8.78571 8.18389 8.78571 8.71645V15.3587C8.78571 15.5295 8.83104 15.6971 8.91707 15.8446C9.18541 16.3046 9.77586 16.46 10.2359 16.1917L15.9293 12.8705C16.0729 12.7867 16.1925 12.6672 16.2763 12.5235C16.5447 12.0635 16.3893 11.473 15.9293 11.2047L10.2359 7.88352C10.0884 7.7975 9.92073 7.75217 9.75 7.75217Z" fill="black"/>
</g>
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM9.75 7.75217C9.21744 7.75217 8.78571 8.18389 8.78571 8.71645V15.3587C8.78571 15.5295 8.83104 15.6971 8.91707 15.8446C9.18541 16.3046 9.77586 16.46 10.2359 16.1917L15.9293 12.8705C16.0729 12.7867 16.1925 12.6672 16.2763 12.5235C16.5447 12.0635 16.3893 11.473 15.9293 11.2047L10.2359 7.88352C10.0884 7.7975 9.92073 7.75217 9.75 7.75217Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_3062_8865" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3062_8865"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3062_8865" result="shape"/>
</filter>
<clipPath id="clip0_3062_8865">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

GenietVideoIcon.displayName = "GenietVideoIcon";
