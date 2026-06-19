import React from "react";

export interface RunmileQuestionMarkIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileQuestionMarkIcon = React.forwardRef<SVGSVGElement, RunmileQuestionMarkIconProps>(
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
      <g transform="translate(2 2)">
    <g id="ic_questionmark_stroke">
    <path id="Union" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5ZM9.47559 13.4736C10.0723 13.4737 10.5429 13.9581 10.543 14.541C10.543 15.124 10.0704 15.6083 9.47559 15.6084C8.88072 15.6084 8.4082 15.1359 8.4082 14.541C8.40825 13.9462 8.88076 13.4736 9.47559 13.4736ZM9.84863 4.7998C11.8842 4.7998 13.0009 5.86715 13.001 7.54297C13.001 8.80977 11.9336 9.77655 11.0146 10.2607C10.5426 10.5097 10.4063 10.7942 10.4062 11.2031V11.8232C10.4062 12.7916 8.63184 12.8529 8.63184 11.8232V10.9678C8.63191 10.1736 9.05435 9.59057 9.59961 9.28027C10.2202 8.93245 10.9521 8.31142 10.9521 7.65332C10.952 6.88484 10.5541 6.51172 9.75977 6.51172C9.32519 6.51185 8.91635 6.79604 8.63184 7.13184C7.91258 7.97558 6.73306 7.10671 7.05469 6.32617C7.39063 5.47052 8.48319 4.79992 9.84863 4.7998Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileQuestionMarkIcon.displayName = "RunmileQuestionMarkIcon";
