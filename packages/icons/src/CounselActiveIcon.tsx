import React from "react";

export interface CounselActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CounselActiveIcon = React.forwardRef<SVGSVGElement, CounselActiveIconProps>(
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
      <g transform="translate(1.5 2.5)">
    <g id="Group 10">
<path id="Combined Shape" d="M10.5 0C16.299 0 21 3.80558 21 8.5C21 13.1944 16.299 17 10.5 17C9.68157 17 8.88566 16.9207 8.12109 16.7773L4.65332 18.457C3.65727 18.9391 2.50011 18.214 2.5 17.1074V14.002C0.941964 12.519 0 10.5993 0 8.5C0 3.80558 4.70101 0 10.5 0ZM6.7002 7.72266C6.14764 7.72266 5.70033 8.16854 5.7002 8.71973C5.7002 9.27103 6.14756 9.71777 6.7002 9.71777C7.25274 9.71767 7.7002 9.27096 7.7002 8.71973C7.70006 8.1686 7.25266 7.72276 6.7002 7.72266ZM10.5 7.72266C9.94745 7.72267 9.50013 8.16855 9.5 8.71973C9.5 9.27102 9.94736 9.71776 10.5 9.71777C11.0526 9.71777 11.5 9.27103 11.5 8.71973C11.4999 8.16854 11.0525 7.72266 10.5 7.72266ZM14.3008 7.72266C13.7478 7.72271 13.2999 8.16857 13.2998 8.71973C13.2998 9.27099 13.7494 9.71772 14.3008 9.71777C14.8521 9.71777 15.2998 9.27103 15.2998 8.71973C15.2997 8.16854 14.8538 7.72266 14.3008 7.72266Z" fill="currentColor"/>
</g>
  </g>
    </svg>
  )
);

CounselActiveIcon.displayName = "CounselActiveIcon";
