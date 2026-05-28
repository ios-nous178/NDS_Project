import React from "react";

export interface RunmileQuestionmarkActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileQuestionmarkActiveIcon = React.forwardRef<SVGSVGElement, RunmileQuestionmarkActiveIconProps>(
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
    <g id="ic_questionmark_fill">
    <path id="Subtract" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM9.47559 13.4736C8.88076 13.4736 8.40825 13.9462 8.4082 14.541C8.4082 15.1359 8.88072 15.6084 9.47559 15.6084C10.0704 15.6083 10.543 15.124 10.543 14.541C10.5429 13.9581 10.0723 13.4737 9.47559 13.4736ZM9.84863 4.7998C8.48319 4.79992 7.39063 5.47052 7.05469 6.32617C6.73306 7.10671 7.91258 7.97558 8.63184 7.13184C8.91635 6.79604 9.32519 6.51185 9.75977 6.51172C10.5541 6.51172 10.952 6.88484 10.9521 7.65332C10.9521 8.31142 10.2202 8.93245 9.59961 9.28027C9.05435 9.59057 8.63191 10.1736 8.63184 10.9678V11.8232C8.63184 12.8529 10.4062 12.7916 10.4062 11.8232V11.2031C10.4063 10.7942 10.5426 10.5097 11.0146 10.2607C11.9336 9.77655 13.001 8.80977 13.001 7.54297C13.0009 5.86715 11.8842 4.7998 9.84863 4.7998Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileQuestionmarkActiveIcon.displayName = "RunmileQuestionmarkActiveIcon";
